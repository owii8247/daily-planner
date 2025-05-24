const STORAGE_KEY = 'dailyPlanner';

export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function loadTasks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}