const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

let draggedItem = null; // To keep track of the dragged item 

function addTask() {
    if (inputBox.value === '') {
        alert("You need to write something!");
    } else {
        let li = document.createElement("li");
        li.textContent = inputBox.value; // Add the task text
        li.draggable = true; // Make the list item draggable

        li.addEventListener("click", function () {
            this.classList.toggle("checked"); // Toggle the checked state on the LI
            saveData();
        });

        // Create the delete button
        let deleteSpan = document.createElement("span");
        deleteSpan.innerHTML = "\u00d7"; // Delete button
        li.appendChild(deleteSpan);

        listContainer.appendChild(li);

        // Add drag and drop event listeners to the newly created item
        li.addEventListener("dragstart", dragStart);
        li.addEventListener("dragover", dragOver);
        li.addEventListener("dragenter", dragEnter);
        li.addEventListener("dragleave", dragLeave);
        li.addEventListener("dragend", dragEnd);
    }
    inputBox.value = "";
    saveData();
}

// Event listener for deleting tasks (remains on the container)
listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "SPAN") {
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

    // Add drag and drop event listeners to each list item loaded from storage
    const listItems = document.querySelectorAll("#list-container li");
    listItems.forEach(item => {
        item.draggable = true; // Ensure loaded items are draggable
        item.addEventListener("dragstart", dragStart);
        item.addEventListener("dragover", dragOver);
        item.addEventListener("dragenter", dragEnter);
        item.addEventListener("dragleave", dragLeave);
        item.addEventListener("dragend", dragEnd);

        // Add click listener for toggling 'checked' state to loaded items
        item.addEventListener("click", function () {
            this.classList.toggle("checked");
            saveData();
        });
    });
}
showTask();

// Add tasks with the Enter key
inputBox.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

function dragStart(e) {
    draggedItem = this; // 'this' refers to the dragged list item 
    setTimeout(() => this.classList.add("dragging"), 0); // Add 'dragging' class (for styling) 
}

function dragOver(e) {
    e.preventDefault(); // Prevents default handling to allow drop 
}

function dragEnter(e) {
    e.preventDefault();
    this.classList.add("hovered"); // Add 'hovered' class (for styling if needed) 
}

function dragLeave(e) {
    this.classList.remove("hovered"); // Remove 'hovered' class 
}

function dragEnd(e) {
    this.classList.remove("dragging"); // Remove 'dragging' class 
    this.classList.remove("hovered");  // Ensure the dragged item loses hover 
    saveData(); // Save the new order to localStorage 
}

listContainer.addEventListener("drop", function (e) {
    e.preventDefault();
    if (e.target.tagName === "LI") {
        if (draggedItem !== e.target) {
            // Basic swap of innerHTML - consider more robust node manipulation
            let temp = draggedItem.innerHTML;
            draggedItem.innerHTML = e.target.innerHTML;
            e.target.innerHTML = temp;
        }
        e.target.classList.remove("hovered"); // Remove hover from the drop target
    }
    saveData();
});

// Drag and Drop for Mobile
let touchStartY = null;
let touchedItem = null;

listContainer.addEventListener("touchstart", function(e) {
    const li = e.target.closest("li");
    if (!li) return;
    touchedItem = li;
    touchStartY = e.touches[0].clientY;
    li.classList.add("dragging");
}, { passive: true });

listContainer.addEventListener("touchmove", function(e) {
    if (!touchedItem) return;
    const touchY = e.touches[0].clientY;
    const items = Array.from(listContainer.children);
    let swapWith = null;
    items.forEach(item => {
        const rect = item.getBoundingClientRect();
        if (touchY > rect.top && touchY < rect.bottom && item !== touchedItem) {
            swapWith = item;
        }
    });
    if (swapWith) {
        if (touchStartY < e.touches[0].clientY) {
            swapWith.after(touchedItem);
        } else {
            swapWith.before(touchedItem);
        }
    }
    touchStartY = touchY;
}, { passive: false });

listContainer.addEventListener("touchend", function(e) {
    if (touchedItem) {
        touchedItem.classList.remove("dragging");
        touchedItem = null;
        saveData();
    }
});