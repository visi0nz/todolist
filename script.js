const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
    if (inputBox.value === '') {
        alert("You need to write something!");
    } else {
        let li = document.createElement("li");
        li.textContent = inputBox.value; // Add the task text

        // Create the delete button
        let deleteSpan = document.createElement("span");
        deleteSpan.innerHTML = "\u00d7"; // Delete button
        li.appendChild(deleteSpan);

        listContainer.appendChild(li);
    }
    inputBox.value = "";
    saveData();
}

// Add event listener for the delete functionality
listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked"); // Toggle the checked state
        saveData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove(); // Remove the task
        saveData();
    }
});

// Save tasks to localStorage
function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

// Load tasks from localStorage
function showTask() {
    listContainer.innerHTML = localStorage.getItem("data") || "";
}
showTask();

// Add tasks with the Enter key
inputBox.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});
