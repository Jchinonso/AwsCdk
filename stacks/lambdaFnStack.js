const lambda = require("@aws-cdk/aws-lambda");

function lambdaFnStack(self) {
  return new lambda.Function(self, "UserRegistryHandler", {
    runtime: lambda.Runtime.NODEJS_12_X,
    handler: "main.handler",
    code: lambda.Code.fromAsset("lambdaFn"),
    memorySize: 1024,
  });
}

module.exports = lambdaFnStack;
