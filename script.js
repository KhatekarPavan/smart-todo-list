const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filter-btn");
const taskCountSpan = document.getElementById("task-count");
const clearCompletedBtn = document.getElementById("clear-completed");

let tasks = [];

function loadTasks() {
  const saved = localStorage.getItem("smart_todo_tasks");
  tasks = saved ? JSON.parse(saved) : [];
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("smart_todo_tasks", JSON.stringify(tasks));
}

function addTask(title) {
  if (!title.trim()) return;
  tasks.push({
    id: Date.now(),
    title: title.trim(),
    completed: false
  });
  saveTasks();
  renderTasks();
  taskInput.value = "";
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(t => 
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  renderTasks();
}

let currentFilter = "all";

function setFilter(filter) {
  currentFilter = filter;
  filterButtons.forEach(btn => {
    btn.classList.toggle(
      "active",
      btn.dataset.filter === filter
    );
  });
  renderTasks();
}

function getFilteredTasks() {
  if (currentFilter === "pending") {
    return tasks.filter(t => !t.completed);
  }
  if (currentFilter === "completed") {
    return tasks.filter(t => t.completed);
  }
  return tasks;
}

function updateTaskCount() {
  const count = tasks.length;
  taskCountSpan.textContent = `${count} task${count !== 1 ? "s" : ""}`;
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";
  const filtered = getFilteredTasks();

  filtered.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";

    const left = document.createElement("div");
    left.className = "task-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const span = document.createElement("span");
    span.className = "task-title";
    if (task.completed) span.classList.add("completed");
    span.textContent = task.title;

    left.appendChild(checkbox);
    left.appendChild(span);

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => deleteTask(task.id));

    li.appendChild(left);
    li.appendChild(delBtn);

    taskList.appendChild(li);
  });

  updateTaskCount();
}

addBtn.addEventListener("click", () => {
  addTask(taskInput.value);
});

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask(taskInput.value);
  }
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    setFilter(btn.dataset.filter);
  });
});

clearCompletedBtn.addEventListener("click", clearCompleted);

loadTasks();
