let currentQuestId = null;
let currentQuestType = null;
let level = 1;
let pointsToNextLevel = 5;

function completeQuest(questId, questType) {
    currentQuestId = questId;
    currentQuestType = questType;
    openModal();

    // Find and animate the button
    const button = document.querySelector(`#${questId} button`);
    if (button) {
        animateButton(button);
    }
}

function updateMainScreen(message) {
    const mainScreen = document.createElement('div');
    mainScreen.textContent = `${message} completed!`;
    mainScreen.style.position = 'fixed';
    mainScreen.style.top = '10px';
    mainScreen.style.left = '50%';
    mainScreen.style.transform = 'translateX(-50%)';
    mainScreen.style.backgroundColor = '#4b5b6b';
    mainScreen.style.color = '#ffffff';
    mainScreen.style.padding = '10px';
    mainScreen.style.borderRadius = '5px';
    mainScreen.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    document.body.appendChild(mainScreen);

    setTimeout(() => {
        mainScreen.remove();
    }, 3000);
}

function addDailyTask() {
    const newDailyTaskInput = document.getElementById('new-daily-task-input');
    const newDailyTaskText = newDailyTaskInput.value.trim();
    if (newDailyTaskText === '') {
        return;
    }

    const dailyTaskList = document.getElementById('daily-task-list');
    const newDailyTaskId = `daily${dailyTaskList.children.length + 1}`;
    const newDailyTaskItem = document.createElement('li');
    newDailyTaskItem.id = newDailyTaskId;

    newDailyTaskItem.innerHTML = `<span>${newDailyTaskText}</span> - <button onclick="completeQuest('${newDailyTaskId}', 'daily')">Complete</button>`;
    dailyTaskList.appendChild(newDailyTaskItem);
    newDailyTaskInput.value = '';
}

function addMainQuest() {
    const newMainQuestInput = document.getElementById('new-main-quest-input');
    const newMainQuestText = newMainQuestInput.value.trim();
    if (newMainQuestText === '') {
        return;
    }

    const mainQuestList = document.getElementById('main-quest-list');
    const newMainQuestId = `quest${mainQuestList.children.length + 1}`;
    const newMainQuestItem = document.createElement('li');
    newMainQuestItem.id = newMainQuestId;

    newMainQuestItem.innerHTML = `<span>${newMainQuestText}</span> - <button onclick="completeQuest('${newMainQuestId}', 'main')">Complete</button>`;
    mainQuestList.appendChild(newMainQuestItem);
    newMainQuestInput.value = '';
}

function openModal() {
    document.getElementById('stat-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('stat-modal').style.display = 'none';
}

function increaseStat(stat) {
    const statElement = document.getElementById(stat);
    statElement.textContent = parseInt(statElement.textContent) + 1;
    closeModal();

    if (currentQuestId && currentQuestType) {
        const questElement = document.getElementById(currentQuestId);
        if (questElement) {
            updateMainScreen(questElement.textContent);
            if (currentQuestType === 'main') {
                questElement.remove();
            }
            currentQuestId = null;
            currentQuestType = null;

            // Check if a level-up is needed
            if (parseInt(statElement.textContent) % pointsToNextLevel === 0) {
                updateLevel();
            }
        }
    }
}

function updateLevel() {
    const levelElement = document.getElementById('level');
    level++;
    levelElement.textContent = level;
    pointsToNextLevel = Math.floor(pointsToNextLevel * 1.5); // Increase the required points
}

function animateButton(button) {
    button.classList.add('animate');
    setTimeout(() => {
        button.classList.remove('animate');
    }, 500); // Duration of the animation
}

function resetDailyTasks() {
    const dailyTaskList = document.getElementById('daily-task-list');
    const tasks = dailyTaskList.children;
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const button = task.querySelector('button');
        if (button.textContent === 'Completed') {
            button.textContent = 'Complete';
        }
    }
}

function scheduleDailyReset() {
    const now = new Date();
    const nextReset = new Date();
    nextReset.setHours(24, 0, 0, 0); // Set to midnight of the next day
    const timeUntilReset = nextReset - now;

    setTimeout(() => {
        resetDailyTasks();
        setInterval(resetDailyTasks, 24 * 60 * 60 * 1000); // Reset every 24 hours
    }, timeUntilReset);
}

// Schedule the daily task reset when the script loads
scheduleDailyReset();
