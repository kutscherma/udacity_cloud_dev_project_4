import * as uuid from 'uuid'

import { Todos } from '../dataAccess/todos'
import { TodoItem } from '../models/TodoItem'
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

export async function updateTodo( userId: string, todoId: string, updateTodoRequest: UpdateTodoRequest): Promise<TodoItem> {
    return await todosDB.updateTodo(todoId, userId, updateTodoRequest)
}
