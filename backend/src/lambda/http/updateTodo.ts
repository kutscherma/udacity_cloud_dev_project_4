import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODOS_TABLE
const logger = createLogger('updateTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

    logger.info(`Event: ${JSON.stringify(event)}`)
    logger.info(`To be updated: ${updatedTodo}`)
    logger.info(`Updating a todo with id: ${todoId}`)

    const params = {
        TableName: todoTable,
        Key: {
            'userId': userId,
            'todoId': todoId
        },
        UpdateExpression: 'set #name = :name, #dueDate = :due, #done= :d',
        ExpressionAttributeValues: {
            ':name' : updatedTodo.name,
            ':due': updatedTodo.dueDate,
            ':d': updatedTodo.done
        },
        ExpressionAttributeNames: {
            '#name': 'name',
            '#dueDate': 'dueDate',
            '#done': 'done'
        },
        ReturnValues:'UPDATED_NEW'
    }

    const result = await docClient.update(params).promise()
    logger.info(`Updated todo: ${result}`)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            result
        })
    }
}
