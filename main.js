"use strict";

let todos = []; // Array of Todos Object

window.addEventListener("load", () => {
  todos = JSON.parse(localStorage.getItem("todos")) || [];
  //console.log("Loading ", todos);

  const nameInput = document.querySelector("#name");
  const newTodoForm = document.querySelector("#new-todo-form");
  const userName = localStorage.getItem("username") || "";

  nameInput.value = userName;

  nameInput.addEventListener("change", (e) => {
    //console.log(e);
    localStorage.setItem("username", e.target.value);
  });

  newTodoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const todo = {
      content: e.target.content.value,
      done: false,
      status: "To-Do",
      createdAt: new Date().getTime(),
    };

    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));

    e.target.reset();

    DisplayTodos();
  });

  DisplayTodos();
});

function DisplayTodos() {
  const todoList = document.querySelector("#todo-list");

  todoList.innerHTML = ""; // Delete Previous All Things

  todos.forEach((todo) => {
    const todoItem = document.createElement("div");
    todoItem.classList.add(
      "flex",
      "items-center",
      "justify-between",
      "py-2",
      "px-4",
      "border",
      "border-gray-200",
      "mb-2",
      "rounded-[10px]",
      "shadow-md",
      "w-[450px]"
    );

    const input = document.createElement("input");
    const content = document.createElement("div");
    const actions = document.createElement("div");
    const edit = document.createElement("button");
    const deleteButton = document.createElement("button");
    const statusBtn = document.createElement("button");

    input.type = "checkbox";
    input.checked = todo.done;

    content.appendChild(input);
    actions.classList.add("flex", "gap-2", "text-sm", "font-light");
    edit.classList.add("bg-pink-500", "text-white", "p-1", "rounded");
    deleteButton.classList.add("bg-red-500", "text-white", "p-1", "rounded");
    statusBtn.classList.add("bg-green-400", "text-white", "p-1", "rounded");

    content.innerHTML = `<input class="bg-[#fffbf5] p-1" type="text" value="${todo.content}" readonly>`;

    edit.innerHTML = "Edit";
    deleteButton.innerHTML = "Delete";
    statusBtn.innerHTML = `${todo.status}`;

    actions.appendChild(statusBtn);
    actions.appendChild(edit);
    actions.appendChild(deleteButton);

    todoItem.appendChild(content);
    todoItem.appendChild(actions);

    todoList.appendChild(todoItem);

    if (todo.done) {
      todoItem.classList.add("text-gray-300");
    }

    input.addEventListener("click", (e) => {
      todo.done = e.target.checked;

      if (todo.done) {
        todo.status = "Done";
        todoItem.classList.add("text-gray-300");
      } else {
        todoItem.classList.add("text-gray-300");
        todo.status = "To-Do";
      }

      localStorage.setItem("todos", JSON.stringify(todos));

      DisplayTodos();
    });

    edit.addEventListener("click", (e) => {
      const input = content.querySelector("input");
      input.removeAttribute("readonly");
      input.focus();
      input.addEventListener("blur", (e) => {
        input.setAttribute("readonly", true);
        todo.content = e.target.value;
        localStorage.setItem("todos", JSON.stringify(todos));
        DisplayTodos();
      });
    });

    deleteButton.addEventListener("click", (e) => {
      todos = todos.filter((t) => t != todo);
      localStorage.setItem("todos", JSON.stringify(todos));
      DisplayTodos();
    });

    statusBtn.addEventListener("click", (e) => {
      let temp_status = todo.status;
      if (temp_status === "To-Do") {
        todo.status = "Doing";
        todo.done = false;
      } else if (temp_status === "Doing") {
        todo.status = "Done";
        todo.done = true;
      } else {
        todo.status = "To-Do";
        todo.done = false;
      }
      localStorage.setItem("todos", JSON.stringify(todos));
      DisplayTodos();
    });
  });
}
