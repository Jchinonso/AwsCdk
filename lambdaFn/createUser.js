const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

async function createUser(user) {
  const params = {
    TableName: process.env.USERS_TABLE,
    Item: user,
  };
  try {
    await docClient.put(params).promise();
    return user;
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return null;
  }
}

module.exports = createUser;
