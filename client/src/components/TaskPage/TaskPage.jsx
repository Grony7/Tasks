import {useState, useEffect} from 'react';
import {AiOutlineClose, AiFillEdit} from 'react-icons/ai'
import axios from 'axios';
import styles from './TaskPage.module.scss'
import cn from 'classnames'

const HOST = 'http://localhost:5000/api';

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    executed: false,
  });
  const [editingTask, setEditingTask] = useState(null);
  const [editedTask, setEditedTask] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    axios.get(`${HOST}/tasks`)
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении задач:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setNewTask(prevTask => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleEditInputChange = (name, value) => {
    setEditedTask(prevEditedTask => ({
      ...prevEditedTask,
      [name]: value,
    }));
  };

  const handleCreateTask = () => {
    if (!newTask.title) {
      alert('Пожалуйста, заполните поле заголовка.');
      return;
    }

    axios.post(`${HOST}/tasks`, newTask)
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTask({
          title: '',
          description: '',
          executed: false,
        });
      })
      .catch(error => {
        console.error('Ошибка при создании задачи:', error);
      });
  };


  const handleEditTask = (taskId) => {
    setEditingTask(taskId);
    const taskToEdit = tasks.find(task => task.id === taskId);
    setEditedTask({
      title: taskToEdit.title,
      description: taskToEdit.description || '',
    });
  };

  const handleSaveEdit = (taskId) => {
    if (!editedTask.title) {
      alert('Пожалуйста, заполните поле заголовка.');
      return;
    }

    axios.put(`${HOST}/tasks/${taskId}`, editedTask)
      .then(response => {
        const updatedTasks = tasks.map(task =>
          task.id === taskId ? {...task, ...response.data} : task
        );
        setTasks(updatedTasks);
        setEditingTask(null);
      })
      .catch(error => {
        console.error('Ошибка при редактировании задачи:', error);
      });
  };

  const handleDeleteTask = (taskId) => {
    axios.delete(`${HOST}/tasks/${taskId}`)
      .then(() => {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
      })
      .catch(error => {
        console.error('Ошибка при удалении задачи:', error);
      });
  };

  const handleToggleExecution = (taskId) => {
    const task = tasks.find(task => task.id === taskId);

    if (!task) {
      console.error('Задача не найдена');
      return;
    }

    axios.put(`${HOST}/tasks/${taskId}`, {executed: !task.executed})
      .then(response => {
        const updatedTasks = tasks.map(task =>
          task.id === taskId ? {...task, executed: response.data.executed} : task
        );
        setTasks(updatedTasks);
      })
      .catch(error => {
        console.error('Ошибка при изменении статуса задачи:', error);
      });
  };


  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.title}>Список задач</h1>
        {
          tasks.length ?
            <ul className={styles.taskList}>
              {tasks.map(task => (
                <li
                  key={task.id}
                  className={cn(
                    styles.taskItem,
                    { [styles.isExecuted]: task.executed }
                  )}
                >
                  {editingTask === task.id ? (
                    <>
                      <input
                        type="text"
                        name="title"
                        placeholder="Заголовок"
                        value={editedTask.title}
                        onChange={(e) => handleEditInputChange('title', e.target.value)}
                        className={styles.editTitle}
                      />
                      <textarea
                        name="description"
                        placeholder="Описание"
                        value={editedTask.description}
                        onChange={(e) => handleEditInputChange('description', e.target.value)}
                        className={styles.editDescription}
                      />
                      <button onClick={() => handleSaveEdit(task.id)} className={styles.saveButton}>Сохранить</button>
                    </>
                  ) : (
                    <>
                  <span className={styles.taskTitle}>
                    {task.title}
                  </span>
                      <div className={styles.taskDescription}>
                        {task.description.split('\n').map((text, index) => (
                          <p key={index}>
                            {text}
                          </p>
                        ))}
                      </div>

                      <div>
                        <button onClick={() => handleEditTask(task.id)} className={styles.editButton}><AiFillEdit /></button>
                        <button onClick={() => handleDeleteTask(task.id)} className={styles.deleteButton}><AiOutlineClose/></button>
                        <button onClick={() => handleToggleExecution(task.id)} className={styles.toggleButton} />

                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
            :
            <>
              <p className={styles.listEmpty}>Список задач пуст</p>
              <blockquote className={styles.blockquote}>
                ████████████████████████████████████████
                ████████████████████████████████████████
                ██████▀░░░░░░░░▀████████▀▀░░░░░░░▀██████
                ████▀░░░░░░░░░░░░▀████▀░░░░░░░░░░░░▀████
                ██▀░░░░░░░░░░░░░░░░▀▀░░░░░░░░░░░░░░░░▀██
                ██░░░░░░░░░░░░░░░░░░░▄▄░░░░░░░░░░░░░░░██
                ██░░░░░░░░░░░░░░░░░░█░█░░░░░░░░░░░░░░░██
                ██░░░░░░░░░░░░░░░░░▄▀░█░░░░░░░░░░░░░░░██
                ██░░░░░░░░░░████▄▄▄▀░░▀▀▀▀▄░░░░░░░░░░░██
                ██▄░░░░░░░░░████░░░░░░░░░░█░░░░░░░░░░▄██
                ████▄░░░░░░░████░░░░░░░░░░█░░░░░░░░▄████
                ██████▄░░░░░████▄▄▄░░░░░░░█░░░░░░▄██████
                ████████▄░░░▀▀▀▀░░░▀▀▀▀▀▀▀░░░░░▄████████
                ██████████▄░░░░░░░░░░░░░░░░░░▄██████████
                ████████████▄░░░░░░░░░░░░░░▄████████████
                ██████████████▄░░░░░░░░░░▄██████████████
                ████████████████▄░░░░░░▄████████████████
                ██████████████████▄▄▄▄██████████████████
                ████████████████████████████████████████
                ████████████████████████████████████████
              </blockquote>
            </>
        }

        <h2 className={styles.subTitle}>Создать новую задачу</h2>
        <div className={styles.newTask}>
          <input
            type="text"
            name="title"
            placeholder="Заголовок"
            value={newTask.title}
            onChange={handleInputChange}
            className={styles.newInput}
          />
          <textarea
            name="description"
            placeholder="Описание"
            value={newTask.description}
            onChange={handleInputChange}
            className={styles.newTextarea}
          />
          <button onClick={handleCreateTask} className={styles.createButton}>Создать</button>
        </div>
      </div>
    </section>
  );
}

export default TaskPage;
