import { saveTasks, loadTasks } from './storage.js';
import { createTaskElement } from './dom.js';
import { debounce, throttle } from './utils.js';
import { getTimeAgo } from './dom.js';

let tasks = loadTasks();
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskCategory = document.getElementById('task-category');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search-input');
const clearBtn = document.getElementById('clear-tasks');
const backToTopBtn = document.getElementById('back-to-top');


function renderTasks(filtered = null) {
  taskList.innerHTML = '';
  const renderList = (filtered || tasks).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  renderList.forEach((task, index) => {
    const li = createTaskElement(task, index);
    taskList.appendChild(li);
  });
}

taskForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({id: Date.now(), text, completed: false, category: taskCategory.value, createdAt: new Date().toISOString() });
    saveTasks(tasks);
    renderTasks();
    taskInput.value = '';
  }
});

taskList.addEventListener('click', e => {
  const taskId = parseInt(e.target.dataset.id);
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) return;

  if (e.target.classList.contains('delete-btn')) {
    tasks.splice(taskIndex, 1);
  } else if (e.target.classList.contains('complete-btn')) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
  }

  saveTasks(tasks);
  renderTasks();
});


taskList.addEventListener('click', e => {
  const taskId = parseInt(e.target.dataset.createdAt);
  const taskIndex = tasks.findIndex(task => task.createdAt === taskId);
  if (taskIndex === -1) return;

  if (e.target.classList.contains('delete-btn')) {
    tasks.splice(taskIndex, 1);
  } else if (e.target.classList.contains('complete-btn')) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
  }
  saveTasks(tasks);
  renderTasks();
});


const handleSearch = debounce(() => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = tasks.filter(task => task.text.toLowerCase().includes(keyword));
  renderTasks(filtered);
}, 300);

searchInput.addEventListener('input', handleSearch);

clearBtn.addEventListener('click', () => {
  tasks = [];
  saveTasks(tasks);
  renderTasks();
});

const handleScroll = throttle(() => {
  backToTopBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
}, 200);

window.addEventListener('scroll', handleScroll);

backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

setInterval(() => {
  document.querySelectorAll('.timestamp').forEach(span => {
    const createdAt = span.dataset.createdAt;
    span.textContent = ` (Created ${getTimeAgo(createdAt)})`;
  });
}, 1000);

// Initial render
renderTasks();