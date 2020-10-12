import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { TodoItem } from '../../models/TodoItem'


import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODOS_TABLE


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body);
  console.log('Processing event: ', newTodo);

  const itemId = uuid.v4();

  const todo: TodoItem = {
    userId: 'Judith',   // retrieve from jwt
    todoId: itemId,
    createdAt: '',
    name: newTodo.name,
    dueDate: newTodo.dueDate,
    done: false
  }

  console.log('Info Table: ', todoTable);
  console.log('Todo Item: ', todo);

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
}
