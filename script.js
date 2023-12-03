// Define the API endpoint for fetching and manipulating todos
const apiUrl = "https://js1-todo-api.vercel.app/api/todos?apikey=3258fd01-3052-4e57-8b95-d6c1256e4f22";

// Create a <ul> element to display todos
const todosElement = document.createElement("ul");
todosElement.id = "todos";
document.body.appendChild(todosElement);

// Create an element to display error messages to the document body
const errorMessageElement = document.createElement("p");
errorMessageElement.id = "todo-error";
document.body.appendChild(errorMessageElement);

// Function to validate a todo item
function validateTodo(todo) {
  const todoInput = document.querySelector("input[name='todo']");
  const errorMessageElement = document.querySelector("#todo-error");

  // Display error message and remove error message 
  if (todo.trim() === '') {
    
    todoInput.classList.add("error");
    errorMessageElement.textContent = "Du behöver skriva en todo";
    return false;
  } else {
    todoInput.classList.remove("error");
    errorMessageElement.textContent = "";
    return true;
  }
}

// Function to fetch todos from the API
async function fetchTodos() {
  const response = await fetch(apiUrl);
  const todos = await response.json();

  // Update with the fetched todos
  document.querySelector("#todos").innerHTML = todos.map((todo) => {
    const completedClass = todo.completed ? 'completed' : '';
    // Display todo item and a delete button
    return `<li class="${completedClass}" data-id="${todo._id}">${todo.title} <button class="delete-button" onclick="deleteTodo('${todo._id}', ${todo.completed})">Ta bort</button></li>`;
  }).join("");
}

// Add event listener for form to add a new todo
document.querySelector("form").addEventListener("submit", async (event) => {
  event.preventDefault();

  // Get the value of the new todo from the input
  const todo = document.querySelector("input[name='todo']").value;

  // Validate the todo before adding it
  if (!validateTodo(todo)) {
    return;
  }

  // Add the new todo and update
  await addTodo(todo);
  await fetchTodos();

  // Reset the form
  event.target.reset();
});

// Function to add a new todo to the API
async function addTodo(todo) {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: todo,
    }),
  });

  await fetchTodos();
}

// Function to open a modal with a message
function openModal(message) {
  const modal = document.getElementById("modal");
  const modalText = document.getElementById("modal-text");

  // Set the modal text and display the modal
  modalText.textContent = message;
  modal.style.display = "block";
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}

// Function to delete a todo from the API
async function deleteTodo(todoId, completed) {
  const apiKey = "3258fd01-3052-4e57-8b95-d6c1256e4f22";
  const deleteUrl = `https://js1-todo-api.vercel.app/api/todos/${todoId}?apikey=${apiKey}`;

  // If the todo is not completed, show a modal
  if (!completed) {
    openModal("Todon måste vara avklarad för att kunna ta bort");
    return;
  }

  try {
    // Make a DELETE request to delete the todo
    const response = await fetch(deleteUrl, {
      method: "DELETE",
    });
    // Errors and success
    if (response.ok) {
      console.log("Delete success for todo ID:", todoId);
      await fetchTodos();
    } else {
      console.error("Delete request failed with status:", response.status);
      const responseData = await response.text();
      console.error("Server response data:", responseData);
    }
  } catch (error) {
    console.error("Error during delete request:", error);
  }
}

// Add event listener for todo item clicks to get completion status
document.querySelector("#todos").addEventListener("click", async (event) => {
  const todoId = event.target.getAttribute("data-id");
  const isCompleted = event.target.classList.contains("completed");

  if (isCompleted) {
    await updateTodoStatus(todoId, false);
  } else {
    await updateTodoStatus(todoId, true);
  }
});

// Function to update the completion status of a todo in the API
async function updateTodoStatus(todoId, completed) {
  const updateUrl = `https://js1-todo-api.vercel.app/api/todos/${todoId}?apikey=3258fd01-3052-4e57-8b95-d6c1256e4f22`;

  // Make a PUT request to update the completion status
  try {
    const response = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: completed,
      }),
    });

    // Log success and log error
    if (response.ok) {
      
      console.log("Update success for todo ID:", todoId);
      await fetchTodos();
    } else {
      
      console.error("Update request failed with status:", response.status);
      const responseData = await response.text();
      console.error("Server response data:", responseData);
    }
  } catch (error) {
    console.error("Error during update request:", error);
  }
}

// Fetch todos when the page loads
fetchTodos();
