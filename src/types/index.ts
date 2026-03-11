import { Prisma } from '@prisma/client';

// We can use Prisma's generated types to ensure consistency
// from the database to the frontend.
export type Todo = Prisma.TodoGetPayload<{}>;