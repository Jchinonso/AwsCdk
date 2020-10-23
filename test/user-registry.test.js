const { expect, matchTemplate, MatchStyle } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const UserRegistry = require('../lib/user-registry-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new UserRegistry.UserRegistryStack(app, 'MyTestStack');
    // THEN
    expect(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
