const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

async function deleteUser(userId) {
  const params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      id: userId,
    },
  };
  try {
    await docClient.delete(params).promise();
    return userId;
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return null;
  }
}

module.exports = deleteUser;
