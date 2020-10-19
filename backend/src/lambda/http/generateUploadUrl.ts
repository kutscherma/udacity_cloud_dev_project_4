import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { getUploadUrl } from "../../services/todos";
import { createLogger } from '../../utils/logger'
const logger = createLogger('generateUploadUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    const uploadUrl = await getUploadUrl(todoId, getUserId(event))
    logger.info(`Upload URL: ${uploadUrl}`)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Request-Method': 'POST'
        },
        body: JSON.stringify({ uploadUrl })
    }
}
