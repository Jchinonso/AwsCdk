const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
// var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

async function listUsers() {
  const params = {
    TableName: process.env.USERS_TABLE,
  };
  try {
    const data = await docClient.scan(params).promise();
    return data.Items;
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return null;
  }
}

module.exports = listUsers;
