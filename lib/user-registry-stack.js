const cdk = require("@aws-cdk/core");
const appsync = require("@aws-cdk/aws-appsync");
const ddb = require("@aws-cdk/aws-dynamodb");
const lambda = require("@aws-cdk/aws-lambda");
const {
  UserPool,
  UserPoolClient,
  VerificationEmailStyle,
} = require("@aws-cdk/aws-cognito");
const { Role, ServicePrincipal, ManagedPolicy }= require('@aws-cdk/aws-iam');

class UserRegistryStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const userPool = new UserPool(this, "user-registry-pool", {
      selfSignUpEnabled: true,
      userVerification: {
        emailStyle: VerificationEmailStyle.CODE
      },
      autoVerify: {
        email: true
      },

      signInAliases: {
        email: false,
        username: true,
      },
      
      standardAttributes: {
        email: {
          required: false,
          mutable: true
        },
        address: {
          required: false,
          mutable: true
        },
        givenName: {
          required: false,
          mutable: true
        },
        familyName: {
          required: false,
          mutable: true
        }
      }
    });

    const api = new appsync.GraphqlApi(this, "Api", {
      name: "user-registry-api",
      schema: appsync.Schema.fromAsset("graphql/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: userPool,
            defaultAction: appsync.UserPoolDefaultAction.ALLOW,
          },
        },
      },
      xrayEnabled: true,
    });

    const userPoolClient = new UserPoolClient(this, "UserPoolClient", {
      userPool
    });

    // print out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl,
    });

    // print out the AppSync API Key to the terminal
    // new cdk.CfnOutput(this, "GraphQLAPIKey", {
    //   value: api.apiKey || "",
    // });
    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId
    });
    
    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId
    });
    // print out the stack region
    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region,
    });

    const usersTableRole = new Role(this, 'ItemsDynamoDBRole', {
      assumedBy: new ServicePrincipal('appsync.amazonaws.com')
    });

    usersTableRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'));

    const usersLambda = new lambda.Function(this, "UserRegistryHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "main.handler",
      code: lambda.Code.fromAsset("lambdaFn"),
      memorySize: 1024,
    });
   
    // set the new Lambda function as a data source for the AppSync API
    const lambdaDs = api.addLambdaDataSource("lambdaDatasource", usersLambda, {
      serviceRoleArn: usersTableRole.roleArn
    });

    // create resolvers to match GraphQL operations in schema

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "listUsers",
      requestMappingTemplate: appsync.MappingTemplate.fromString(`
        {
          "version" : "2018-05-29",
          "operation" : "Invoke",
          "payload": {
            "field": "listUsers",
            "arguments": {
                "id" : $util.dynamodb.toDynamoDBJson($ctx.identity.sub)
            }
          }
        }
      `)
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "createUser",
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "deleteUser",
    });

    // create DynamoDB table
    const usersTable = new ddb.Table(this, "UsersTable", {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });

    // enable the Lambda function to access the DynamoDB table (using IAM)
    usersTable.grantReadWriteData(usersLambda);

    // grant the lambda role invoke permissions to the downstream function

    usersLambda.addEnvironment("USERS_TABLE", usersTable.tableName);
  }
}

module.exports = UserRegistryStack;
