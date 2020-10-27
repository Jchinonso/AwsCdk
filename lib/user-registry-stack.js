const cdk = require("@aws-cdk/core");
const appsync = require("@aws-cdk/aws-appsync");
const dynamoDbStack = require("../stacks/dynamoDbStack")
const graphQLStack = require("../stacks/graphQLStack");
const userPoolStack = require("../stacks/userPoolStack");
const lambdaFnStack = require("../stacks/lambdaFnStack")
const userPoolClientStack = require("../stacks/userPoolClientStack")


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
    const userPool = userPoolStack(this)
    const api = graphQLStack(this, appsync, userPool);

    const userPoolClient = userPoolClientStack(this, userPool)

    // print out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl,
    });

    // print out the AppSync API Key to the terminal
    // new cdk.CfnOutput(this, "GraphQLAPIKey", {
    //   value: api.apiKey || "",
    // });
    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });
    // print out the stack region
    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region,
    });

    const usersLambda = lambdaFnStack(this);
    // set the new Lambda function as a data source for the AppSync API
    const lambdaDs = api.addLambdaDataSource("lambdaDatasource", usersLambda);

    // create resolvers to match GraphQL operations in schema

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "listUsers",
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
    const usersTable = dynamoDbStack(this);

    // enable the Lambda function to access the DynamoDB table (using IAM)
    usersTable.grantReadWriteData(usersLambda);

    usersLambda.addEnvironment("USERS_TABLE", usersTable.tableName);
  }
}

module.exports = UserRegistryStack;
