import React, { useState } from 'react';
import Calendar from 'react-calendar';
import './styles.css'; // Импорт файла стилей

import cross from "./../img/cross.svg"


const TodoList = () => {
    const [tasks, setTasks] = useState([]); // Массив для хранения задач
    const [newTask, setNewTask] = useState(''); // Ввод новой задачи
    const [selectedDate, setSelectedDate] = useState(null);

    const tasksByDate = {};
    tasks.forEach(task => {
      if (!tasksByDate[task.date]) {
        tasksByDate[task.date] = [];
      }
      tasksByDate[task.date].push(task);
    });
  
    const handleInputChange = (event) => {
      setNewTask(event.target.value);
    };
  
    const handleAddTask = () => {
      if (newTask.trim() !== '' && selectedDate) { // Добавляем проверку на selectedDate
        const newTaskObj = { task: newTask, date: selectedDate };
        setTasks([...tasks, newTaskObj]);
        setNewTask('');
      }
    };
    const handleDeleteTask = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
      };

    return (
      <div>
        <h2>Список дел</h2>
        <Calendar
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)}
       />
       <p className='placeholderCalendar'>Выбери дату выполнения задачи</p>
        <div className='wrapperTop'>
          <input className='input'
            placeholder='новая задача'
            type="text"
            value={newTask}
            onChange={handleInputChange}
          />
          <button className='btnAdd' onClick={handleAddTask}>Добавить</button>
        </div>

        <ol className='list'>
        {Object.entries(tasksByDate).map(([date, tasksForDate]) => (
          <li key={date}>
            <h3 className='title_date'>{new Date(date).toLocaleDateString()}</h3>
            {tasksForDate.map((task, index) => (
              <div key={index}>
                {task.task}
                <button className='btnX' onClick={() => handleDeleteTask(index)}>
                  <img className='vectorX' src={cross} alt='' />
                </button>
              </div>
            ))}
          </li>
        ))}
      </ol>
      <p className='count'>Всего задач: {tasks.length}</p>
      </div>
    );
};

export default TodoList;