let tasks = [];

// Load tasks from local storage on page load
document.addEventListener("DOMContentLoaded", () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
        tasks = storedTasks;
        updateTaskList();
        updateNo();
    }
});

const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const addTask = () => {
    const taskinput = document.getElementById('taskinput');
    const text = taskinput.value.trim();
    if (text) {
        tasks.push({ text: text, completed: false });
        taskinput.value = "";
        updateTaskList();
        updateNo();
        saveTasks();
    }
};

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTaskList();
    updateNo();
    saveTasks();
};

const deleteTask = (index) => {
    const confirmDelete = confirm("Are you sure you want to delete this?");
    if (confirmDelete) {
        tasks.splice(index, 1);
        updateTaskList();
        updateNo();
        saveTasks();
    }
};

const editTask = (index) => {
    const taskItem = document.querySelectorAll('.taskitem p')[index];
    
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = tasks[index].text;
    editInput.className = 'edit-input';
    editInput.style.background = "#303a9a"; 
    editInput.style.color = "#fff";
    editInput.style.padding = "5px";
    editInput.style.borderRadius = "5px";
    editInput.style.border = "2px solid #4c56af";

    taskItem.replaceWith(editInput);
    editInput.focus();

    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && editInput.value.trim()) {
            tasks[index].text = editInput.value.trim();
            updateTaskList();
            saveTasks();
        }
    });

    editInput.addEventListener('blur', () => {
        updateTaskList(); // Restore task list if input loses focus
    });
};

const updateNo = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
    document.getElementById('progress').style.width = `${progress}%`;
    document.getElementById("num").innerText = `${completedTasks}/${totalTasks}`;

    // Show alert only when there are tasks and all are completed
    if (totalTasks > 0 && completedTasks === totalTasks) {
        setTimeout(() => alert("You did all your work! What next will you do?"), 300);
    }
};

const updateTaskList = () => {
    const taskList = document.querySelector(".tasklist");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add("taskitem");
        
        listItem.innerHTML = `
            <div class="task ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} onChange="toggleTaskComplete(${index})"/>
                <p>${task.text}</p>
            </div>
            <div class="icons">
                <img src="edit-button-svgrepo-com.svg" alt="Edit" onClick="editTask(${index})"/>
                <img src="delete-button-svgrepo-com.svg" alt="Delete" onClick="deleteTask(${index})"/>
            </div>
        `;
        
        taskList.appendChild(listItem);
    });
};

// Add event listener to 'Add Task' button
document.getElementById('newtask').addEventListener('click', (e) => {
    e.preventDefault();
    addTask();
});
