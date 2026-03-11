'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import prisma from './prisma';
import { getSessionId } from './session';
import { Todo } from '@prisma/client';

const todoSchema = z.object({
  text: z.string().min(1, 'Todo text cannot be empty.').max(200),
});

export async function getTodos(): Promise<Todo[]> {
  const sessionId = getSessionId();
  try {
    const todos = await prisma.todo.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });
    return todos;
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    return [];
  }
}

export async function addTodo(formData: FormData) {
  const sessionId = getSessionId();
  const validatedFields = todoSchema.safeParse({
    text: formData.get('text'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.todo.create({
      data: {
        text: validatedFields.data.text,
        sessionId,
      },
    });
  } catch (error) {
    console.error('Failed to create todo:', error);
    return { message: 'Database Error: Failed to Create Todo.' };
  }

  revalidatePath('/');
}

export async function toggleTodo(id: string, completed: boolean) {
  const sessionId = getSessionId();
  try {
    await prisma.todo.updateMany({
      where: { id, sessionId },
      data: { completed },
    });
  } catch (error) {
    console.error('Failed to toggle todo:', error);
    return { message: 'Database Error: Failed to Update Todo.' };
  }
  revalidatePath('/');
}

export async function updateTodoText(id: string, text: string) {
  const sessionId = getSessionId();
  const validatedFields = todoSchema.safeParse({ text });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.todo.updateMany({
      where: { id, sessionId },
      data: { text: validatedFields.data.text },
    });
  } catch (error) {
    console.error('Failed to update todo text:', error);
    return { message: 'Database Error: Failed to Update Todo.' };
  }

  revalidatePath('/');
}

export async function deleteTodo(id: string) {
  const sessionId = getSessionId();
  try {
    await prisma.todo.deleteMany({
      where: { id, sessionId },
    });
  } catch (error) {
    console.error('Failed to delete todo:', error);
    return { message: 'Database Error: Failed to Delete Todo.' };
  }
  revalidatePath('/');
}

export async function clearCompletedTodos() {
    const sessionId = getSessionId();
    try {
        await prisma.todo.deleteMany({
            where: {
                sessionId,
                completed: true,
            },
        });
    } catch (error) {
        console.error('Failed to clear completed todos:', error);
        return { message: 'Database Error: Failed to Clear Completed Todos.' };
    }
    revalidatePath('/');
}