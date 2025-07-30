const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

// Load tasks from local storage
document.addEventListener("DOMContentLoaded", loadTasks);

taskForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const taskText = taskInput.value.trim();

  if (taskText !== "") {
    const task = { text: taskText, completed: false };
    addTask(task);
    saveTask(task);
    taskInput.value = "";
  }
});

function addTask(taskObj) {
  const li = document.createElement("li");
  li.classList.toggle("completed", taskObj.completed);

  const taskSpan = document.createElement("span");
  taskSpan.textContent = taskObj.text;
  taskSpan.classList.add("task-text");

  taskSpan.addEventListener("click", () => {
    taskObj.completed = !taskObj.completed;
    li.classList.toggle("completed", taskObj.completed);
    updateTaskInStorage(taskObj.text, taskObj.completed, "toggle");
  });

  // Edit button
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit-btn";
  editBtn.addEventListener("click", () => {
    const newText = prompt("Edit task:", taskObj.text);
    if (newText && newText.trim() !== "") {
      updateTaskInStorage(taskObj.text, newText.trim(), "edit");
      taskObj.text = newText.trim();
      taskSpan.textContent = taskObj.text;
    }
  });

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", () => {
    li.remove();
    removeTask(taskObj.text);
  });

  li.appendChild(taskSpan);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

function saveTask(taskObj) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(taskObj);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => addTask(task));
}

function removeTask(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task => task.text !== taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskInStorage(originalText, newValue, type) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map(task => {
    if (task.text === originalText) {
      if (type === "toggle") {
        task.completed = newValue;
      } else if (type === "edit") {
        task.text = newValue;
      }
    }
    return task;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
