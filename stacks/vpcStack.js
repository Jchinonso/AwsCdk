const ec2 = require("@aws-cdk/aws-ec2");

function vpcStack(self) {
  return new ec2.Vpc(self, "Vpc", {
    subnetConfiguration: [
      {
        cidrMask: 24,
        name: "Ingress",
        subnetType: ec2.SubnetType.ISOLATED,
      },
    ],
  });
}

module.exports = vpcStack;
