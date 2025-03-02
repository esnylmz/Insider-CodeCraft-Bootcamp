document.addEventListener("DOMContentLoaded", function () {
    const taskForm = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskInput");
    const prioritySelect = document.getElementById("prioritySelect");
    const taskList = document.getElementById("taskList");
    const filterCompleted = document.getElementById("filterCompleted");
    const sortByPriority = document.getElementById("sortByPriority");
    const errorMessage = document.getElementById("errorMessage");

    let tasks = [];

    // Görevleri ekleme
    taskForm.addEventListener("submit", function (event) {
        event.preventDefault();
        errorMessage.textContent = ""; // Hata mesajını sıfırla

        const taskName = taskInput.value.trim();
        const priority = prioritySelect.value;

        if (!taskName) {
            errorMessage.textContent = "Lütfen görev adını giriniz!";
            return;
        }
        if (!priority) {
            errorMessage.textContent = "Lütfen bir öncelik seçiniz!";
            return;
        }

        const newTask = {
            id: Date.now(),
            name: taskName,
            priority: priority,
            completed: false
        };

        tasks.push(newTask);
        renderTasks();
        taskInput.value = "";
        prioritySelect.value = "";
    });

    // Event Delegation ile görevleri yönetme
    taskList.addEventListener("click", function (event) {
        const target = event.target;
        const taskId = target.closest(".task").dataset.id;

        if (target.classList.contains("completeTask")) {
            tasks.forEach(task => {
                if (task.id == taskId) {
                    task.completed = !task.completed;
                }
            });
            renderTasks();
        }

        if (target.classList.contains("deleteTask")) {
            tasks = tasks.filter(task => task.id != taskId);
            renderTasks();
        }

        event.stopPropagation(); // Bubbling engelleme
    });

    // Görevleri filtreleme
    filterCompleted.addEventListener("click", function () {
        const completedTasks = tasks.filter(task => task.completed);
        renderTasks(completedTasks);
    });

    // Önceliğe göre sıralama
    sortByPriority.addEventListener("click", function () {
        tasks.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
        renderTasks();
    });

    // Görevleri ekrana yazdırma
    function renderTasks(filteredTasks = tasks) {
        taskList.innerHTML = "";

        filteredTasks.forEach(task => {
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("task");
            taskDiv.dataset.id = task.id;

            if (task.completed) {
                taskDiv.classList.add("completed");
            }

            taskDiv.innerHTML = `
                <span>${task.name} - ${task.priority}</span>
                <div>
                    <button class="completeTask">Tamamlandı</button>
                    <button class="deleteTask">Sil</button>
                </div>
            `;

            taskList.appendChild(taskDiv);
        });
    }
});
