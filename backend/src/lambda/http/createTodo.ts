import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { createTodo } from "../../services/todos";
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
const logger = createLogger('createTodo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  logger.info(`Processing event: ${newTodo}`)

  const todoItem = await createTodo(getUserId(event), newTodo)

  logger.info(`Todo Item: ${todoItem}`);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      todoItem
    })
  }
})

handler.use(
    cors({
      credentials: true
    })
)
