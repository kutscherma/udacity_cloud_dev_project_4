import * as AWS  from 'aws-sdk'

import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate'

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

    // async updateTodo()

}
