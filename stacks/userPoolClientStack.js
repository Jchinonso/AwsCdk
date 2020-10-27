const { UserPoolClient } = require("@aws-cdk/aws-cognito");

function userPoolClientStack(self, userPool) {
  return new UserPoolClient(self, "UserPoolClient", {
    userPool,
  });
}


module.exports = userPoolClientStack;