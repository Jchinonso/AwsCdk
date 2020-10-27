const dynamoDB = require("@aws-cdk/aws-dynamodb");

function dynamoDbStack(self) {
 return new dynamoDB.Table(self, "UsersTable", {
    billingMode: dynamoDB.BillingMode.PAY_PER_REQUEST,
    partitionKey: {
      name: "id",
      type: dynamoDB.AttributeType.STRING,
    },
  });
}


module.exports = dynamoDbStack;