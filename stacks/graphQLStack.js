function graphQLStack(self, appsync, userPool) {
  return new appsync.GraphqlApi(self, "Api", {
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
}


module.exports = graphQLStack;