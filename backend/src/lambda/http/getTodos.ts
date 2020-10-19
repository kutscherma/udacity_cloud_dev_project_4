import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { getTodos } from "../../services/todos";
import { createLogger } from '../../utils/logger'
const logger = createLogger('getToDo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info(event)
    logger.info(`userId: ${getUserId(event)}`)

    const todoItems = await getTodos(getUserId(event))

    logger.info(`Search result ${JSON.stringify(todoItems)}`);

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(todoItems)
    }
}
