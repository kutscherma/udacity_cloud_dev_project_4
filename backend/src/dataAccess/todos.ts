import * as AWS  from 'aws-sdk'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

import { createLogger } from '../utils/logger'

export class Todos {
    constructor(
        private readonly docClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly logger = createLogger('dataAccess_todos')
    ) {}

    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        this.logger.info(`Creating todoItem: ${todoItem}`)

        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()

        return todoItem
    }

    async deleteTodo(todoId: string, userId: string): Promise<TodoItem> {
        const deletedItem = await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                'todoId': todoId,
                'userId': userId
            },
            ReturnValues: 'ALL_OLD'
        }).promise()

        return deletedItem.Attributes as TodoItem
    }

    async getTodos(userId: string): Promise<TodoItem[]> {
        const todos = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId':  userId
            }
        }).promise()

        return todos.Items as TodoItem[]
    }

    async updateTodo(todoId: string, userId: string, updatedTodo: TodoUpdate): Promise<TodoItem> {
        const params = {
            TableName: this.todosTable,
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

        const result = await this.docClient.update(params).promise()
        return result.Attributes as TodoItem
    }

}
