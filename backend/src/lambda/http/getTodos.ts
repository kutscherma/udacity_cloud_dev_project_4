
import 'source-map-support/register'
//
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODOS_TABLE
//
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

      console.log(event);

      let userId = 'Manuel'

//       var params = {
//              TableName: todoTable,
//              FilterExpression: 'contains(userId, :userId)',
//              ExpressionAttributeValues: {
//              ":userId": userId
//              }
//       };


      var params = {
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': {'S': userId}
            },
            TableName: todoTable
      };

      const toDoItem = await docClient.query(params).promise();

      return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            toDoItem
          })
        }

}
