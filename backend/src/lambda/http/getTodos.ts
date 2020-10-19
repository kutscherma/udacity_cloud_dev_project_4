import 'source-map-support/register'
//
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'

import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODOS_TABLE
const logger = createLogger('getToDo')


//
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info(event)

  logger.info(`userId: ${getUserId(event)}`)

  var params = {
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId':  getUserId(event)
        },
        TableName: todoTable
  };

  const toDoItems = await docClient.query(params).promise();

  logger.info(`Search result ${toDoItems}`);

  return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        toDoItems
      })
    }
}