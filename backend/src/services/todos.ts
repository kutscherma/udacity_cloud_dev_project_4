import * as uuid from 'uuid'

import { Todos } from '../dataAccess/todos'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from "../models/TodoUpdate";
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todosDB = new Todos();

export async function createTodo( userId: string, createTodoRequest: CreateTodoRequest ): Promise<TodoItem> {
    const todoItem = {
        todoId: uuid.v4(),
        userId: userId,
        createdAt: new Date().toISOString(),
        done: false,
        ...createTodoRequest
    }

    return await todosDB.createTodo(todoItem)
}

export  async function deleteTodo( todoId: string, userId: string ): Promise<TodoItem> {
    return await todosDB.deleteTodo(todoId, userId)
}

export  async function getTodos( userId: string ): Promise<TodoItem[]> {
    return await todosDB.getTodos(userId)
}

export async function getUploadUrl(todoId: string, userId: string): Promise<any> {
    return await todosDB.getUploadUrl(todoId, userId)
}

export async function updateTodo( todoId: string, userId: string, updateTodoRequest: UpdateTodoRequest): Promise<TodoItem> {
    return await todosDB.updateTodo(todoId, userId, updateTodoRequest as TodoUpdate)
}
