export function createTaskElement(task, index) {
  const li = document.createElement('li');
  li.className = 'task-item';
  if (task.completed) li.classList.add('completed');

  const timeSpan = document.createElement('span');
  timeSpan.className = 'timestamp';
  timeSpan.dataset.createdAt = task.createdAt;

  const timeAgoText = getTimeAgo(task.createdAt);
  timeSpan.textContent = ` (Created ${timeAgoText})`;

  li.innerHTML = `
    <span>${task.text} (${task.category})</span>
    <div>
      <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}" class="complete-btn" />
      <button class="delete-btn" data-id="${task.id}">Delete</button>
    </div>
  `;

  li.querySelector('span').appendChild(timeSpan);
  return li;
}

function getTimeAgo(timestamp) {
  const now = new Date();
  const created = new Date(timestamp);
  const diff = Math.floor((now - created) / 1000); // seconds

  // if (diff < 60) return `${diff} second${diff !== 1 ? 's' : ''} ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minute${diff < 120 ? '' : 's'} ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour${diff < 7200 ? '' : 's'} ago`;
  return created.toLocaleDateString();
}

export { getTimeAgo };
