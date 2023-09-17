import express from 'express';
import {
  createTask,
  getAllTasks,
  updateTaskById,
  deleteTaskById,
} from './tasks.controller.js';

const router = express.Router();

router.post('/', createTask);
router.get('/', getAllTasks);
router.put('/:id', updateTaskById);
router.delete('/:id', deleteTaskById);

export default router;
