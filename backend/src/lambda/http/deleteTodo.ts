import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import * as AWS from "aws-sdk";

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODOS_TABLE
const logger = createLogger('deleteTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event);

    logger.info('Event: ', event)
    logger.info('Deleting a todo with id: ', todoId)

    const params = {
        TableName: todoTable,
        Key: {
            'userId': userId,
            'todoId': todoId
        }
    }

    const result = await docClient.delete(params).promise();
    logger.info('Delete result: ', result);

    return {
        statusCode: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: null
    }
}
