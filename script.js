const taskInput = document.getElementById('taskInput');
const additionalFields = document.getElementById('additionalFields');
const taskPriority = document.getElementById('taskPriority');
const taskDueDate = document.getElementById('taskDueDate');
const taskCategory = document.getElementById('taskCategory');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let addClickCount = 0; // Track the number of clicks or key presses

function showAdditionalFields() {
    additionalFields.classList.remove('hidden');
}

function hideAdditionalFields() {
    additionalFields.classList.add('hidden');
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="task-details">
                <input type="checkbox" ${task.completed ? 'checked' : ''} data-index="${index}">
                <span class="${task.completed ? 'completed' : ''} ${task.priority}-priority">${task.text}</span>
                <span>Due: ${task.dueDate || 'N/A'}</span>
                <span>Category: ${task.category || 'N/A'}</span>
                <div class="task-actions">
                    <button class="editTask" data-index="${index}">Edit</button>
                    <button class="removeTask" data-index="${index}">Remove</button>
                </div>
            </div>
        `;
        taskList.appendChild(li);
    });
}

function addTask() {
    const taskText = taskInput.value.trim();
    const priority = taskPriority.value;
    const dueDate = taskDueDate.value;
    const category = taskCategory.value.trim();

    if (taskText) {
        if (addClickCount === 1) {
            tasks.push({ text: taskText, completed: false, priority, dueDate, category });
            taskInput.value = '';
            taskPriority.value = '';
            taskDueDate.value = '';
            taskCategory.value = '';
            saveTasks();
            renderTasks();
            hideAdditionalFields(); 
            addClickCount = 0; 
        } else {
            showAdditionalFields(); 
            addClickCount++;
        }
    }
}

function removeTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}


function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function editTask(index) {
    const newText = prompt('Edit task text:', tasks[index].text);
    if (newText !== null) {
        tasks[index].text = newText;
        saveTasks();
        renderTasks();
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

addTaskBtn.addEventListener('click', addTask);
taskList.addEventListener('click', function (e) {
    if (e.target.classList.contains('removeTask')) {
        removeTask(e.target.dataset.index);
    } else if (e.target.classList.contains('editTask')) {
        editTask(e.target.dataset.index);
    } else if (e.target.type === 'checkbox') {
        toggleTaskCompletion(e.target.dataset.index);
    }
});

taskInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTask();
    }
});

document.addEventListener('DOMContentLoaded', renderTasks);
