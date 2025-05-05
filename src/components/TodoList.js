import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Calendar from 'react-calendar';

import './styles.css'; 

import cross from "./../img/cross.svg"

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasksByDate, setTasksByDate] = useState({});
  const [sortOrder, setSortOrder] = useState('asc');
  const [dateError, setDateError] = useState(false); // NEW: Состояние для отображения ошибки выбора даты

  // Сохраняем задачи в localStorage
  const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  // Загружаем задачи из localStorage
  const loadTasksFromLocalStorage = () => {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  };

  // Загрузка задач при монтировании компонента
  useEffect(() => {
    const initialTasks = loadTasksFromLocalStorage();
    setTasks(initialTasks);
  }, []);

  // Сохранение задач при их изменении
  useEffect(() => {
    saveTasksToLocalStorage(tasks);
  }, [tasks]);

  // Группировка задач по датам
  useEffect(() => {
    const groupedTasks = {};
    tasks.forEach(task => {
      if (!groupedTasks[task.date]) {
        groupedTasks[task.date] = [];
      }
      groupedTasks[task.date].push(task);
    });
    setTasksByDate(groupedTasks);
  }, [tasks]);

  // Обработчик изменения текста задачи
  const handleInputChange = (event) => {
    setNewTask(event.target.value);
  };

  // NEW: Обработчик выбора даты в календаре
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setDateError(false); // Сбрасываем ошибку при выборе даты
  };

   // форматирует объект Date в строку YYYY-MM-DD, решение проблемы смещения дат
   const formatDateToYMD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
   } 

  // Обработчик добавления новой задачи
  const handleAddTask = () => {
    if (newTask.trim() === '') {
      return; // Не добавляем пустые задачи
    }
    
    // NEW: Проверка на выбор даты
    if (!selectedDate) {
      setDateError(true); // Устанавливаем флаг ошибки
      return;
    }
    
    const newTaskId = uuidv4();
    const newTaskObj = {
      id: newTaskId,
      task: newTask,
      date: formatDateToYMD(selectedDate) // Форматируем дату в YYYY-MM-DD
    };
    
    setTasks([...tasks, newTaskObj]);
    setNewTask('');
    setDateError(false); // Сбрасываем ошибку после успешного добавления
  };

  // Обработчик удаления задачи
  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };

  // Функция для переключения порядка сортировки
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Получение отсортированного списка дат
  const getSortedDates = () => {
    return Object.keys(tasksByDate).sort((a, b) => {
      return sortOrder === 'asc' 
        ? new Date(a) - new Date(b)
        : new Date(b) - new Date(a);
    });
  };

  // Форматирование даты для отображения
  const formatDisplayDate = (dateInput) => {
    const date = typeof dateInput ==='string'
      ? new Date(dateInput) : dateInput;

    return date.toLocaleDateString ('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="todo-container">
      <h2>Список дел</h2>
      
      {/* Календарь для выбора даты */}
      <div className={`calendar-wrapper ${dateError ? 'error' : ''}`}>
        <Calendar
          value={selectedDate}
          onChange={handleDateChange}
          locale="ru-RU"
        />
        {/* NEW: Сообщение об ошибке, если дата не выбрана */}
        {dateError && (
          <p className="error-message">Пожалуйста, выберите дату!</p>
        )}
      </div>

      {/* Поле ввода новой задачи */}
      <div className='input-wrapper'>
        <input
          className='task-input'
          placeholder='Новая задача'
          type="text"
          value={newTask}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddTask();
            }
          }}
        />
        <button className='add-button' onClick={handleAddTask}>
          Добавить
        </button>
      </div>

      {/* Кнопка сортировки */}
      <button className='sort-button' onClick={toggleSortOrder}>
        {sortOrder === 'asc' ? 'Сначала /старые' : 'Сначала /новые'}
      </button>

      {/* Список задач */}
      <ol className='tasks-list'>
        {getSortedDates().map((date) => (
          <li key={date} className="date-group">
            <h3 className='date-header'>{formatDisplayDate(date)}</h3>
            <ul className="tasks-group">
              {tasksByDate[date].map((task) => (
                <li key={task.id} className="task-item">
                  <span>{task.task}</span>
                  <button 
                    className='delete-button'
                    onClick={() => handleDeleteTask(task.id)}>
                    <img src={cross} alt="Удалить" className="delete-icon" />
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      {/* Счетчик задач */}
      <p className='tasks-count'>Всего задач: {tasks.length}</p>
    </div>
  );
};

export default TodoList;