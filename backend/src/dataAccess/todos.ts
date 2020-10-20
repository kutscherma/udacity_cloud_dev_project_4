import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new AWS.S3({
    signatureVersion: 'v4'
})
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export class Todos {
    constructor(
        private readonly docClient = createDynamoDBClient(),
        private readonly logger = createLogger('dataAccess_todos'),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly indexName = process.env.INDEX_NAME
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
            IndexName: this.indexName,
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

    async getUploadUrl(todoId: string, userId: string) {
        await this.attachImageURLToTodo(todoId, userId)
        const uploadUrl = this.getPreSignedUploadUrl(todoId)
        return uploadUrl
    }

    async attachImageURLToTodo(todoId: string, userId: string) {
        const params = {
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': `https://${bucketName}.s3.amazonaws.com/${todoId}`
            },
            ReturnValues: 'ALL_NEW'
        }

        await this.docClient.update(params).promise()
    }

    getPreSignedUploadUrl(imageId: string) {
        return s3.getSignedUrl('putObject', {
            Bucket: bucketName,
            Key: imageId,
            Expires: urlExpiration
        })
    }
}

function createDynamoDBClient(): DocumentClient {
    return new XAWS.DynamoDB.DocumentClient();
}
