#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { UserRegistryStack } = require('../lib/user-registry-stack');

const app = new cdk.App();
new UserRegistryStack(app, 'UserRegistryStack');
