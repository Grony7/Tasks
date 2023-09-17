import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import path from 'path';
import {prisma} from './app/prisma.js';
import tasksRoutes from './app/tasks/tasks.routes.js';
import cors from 'cors';

const PORT = process.env.PORT || 5000;
dotenv.config()
const app = express()

async function main() {
  if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))
  app.use(express.json())
  const __dirname = path.resolve()

  app.use(cors());
  app.use('/public', express.static(path.join(__dirname, '/public')))
  app.use('/api/tasks', tasksRoutes)

  app.listen(PORT, console.log(`🚀 Сервер запущен на http://localhost:${PORT}`))
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });
