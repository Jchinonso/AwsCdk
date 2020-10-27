const {
    UserPool,
    VerificationEmailStyle,
  } = require("@aws-cdk/aws-cognito");


function userPoolStack(self) {
  return new UserPool(self, "user-registry-pool", {
    selfSignUpEnabled: true,
    userVerification: {
      emailStyle: VerificationEmailStyle.CODE,
    },
    autoVerify: {
      email: true,
    },

    signInAliases: {
      email: false,
      username: true,
    },

    standardAttributes: {
      email: {
        required: false,
        mutable: true,
      },
      address: {
        required: false,
        mutable: true,
      },
      givenName: {
        required: false,
        mutable: true,
      },
      familyName: {
        required: false,
        mutable: true,
      },
    },
  });
}

module.exports = userPoolStack;
