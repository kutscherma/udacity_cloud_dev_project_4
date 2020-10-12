import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { TodoItem } from '../../models/TodoItem'

import { createLogger } from '../../utils/logger'

import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODOS_TABLE
const logger = createLogger('createTodo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body);
  logger.info('Processing event: ', newTodo);

  const itemId = uuid.v4();

  const todo: TodoItem = {
    userId: 'Judith',   // retrieve from jwt
    todoId: itemId,
    createdAt: '',
    name: newTodo.name,
    dueDate: newTodo.dueDate,
    done: false
  }

  logger.info('Info Table: ', todoTable);
  logger.info('Todo Item: ', todo);

  await docClient.put({
    TableName: todoTable,
    Item: todo
  }).promise();

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      todo
    })
  }
})

handler.use(
    cors({
      credentials: true
    })
)
