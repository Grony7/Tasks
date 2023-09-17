import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();

// Создать новую задачу
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, executed } = req.body;
  const task = await prisma.tasks.create({
    data: {
      title,
      description,
      executed,
    },
  });
  res.status(201).json(task);
});

// Получить список всех задач
export const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await prisma.tasks.findMany();
  res.status(200).json(tasks);
});

// Обновить задачу по ID
export const updateTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, executed } = req.body;
  const updatedTask = await prisma.tasks.update({
    where: { id: parseInt(id) },
    data: {
      title,
      description,
      executed,
    },
  });
  res.status(200).json(updatedTask);
});

// Удалить задачу по ID
export const deleteTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.tasks.delete({
    where: { id: parseInt(id) },
  });
  res.status(204).send();
});
