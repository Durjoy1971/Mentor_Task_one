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

    const content = document.createElement("div");
    content.innerHTML = `<input class="bg-[#fffbf5] p-1" type="text" value="${todo.content}" readonly>`;

    const edit = document.createElement("button");
    edit.classList.add("bg-pink-500", "text-white", "p-1", "rounded");
    edit.innerHTML = "Edit";

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("bg-red-500", "text-white", "p-1", "rounded");
    deleteButton.innerHTML = "Delete";

    const statusBtn = document.createElement("button");
    statusBtn.classList.add("bg-green-500", "text-white", "p-1", "rounded");
    statusBtn.innerHTML = `${todo.status}`;

    const actions = document.createElement("div");
    actions.classList.add("flex", "gap-2", "text-sm", "font-light");
    actions.appendChild(statusBtn);
    actions.appendChild(edit);
    actions.appendChild(deleteButton);

    todoItem.appendChild(content);
    todoItem.appendChild(actions);
    todoList.appendChild(todoItem);

    if (todo.status === "Done") {
      todoItem.classList.add("text-gray-300");
    } else if (todo.status === "Doing") {
      todoItem.classList.add("text-blue-600", "font-semibold");
    }

    edit.addEventListener("click", () => {
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

    deleteButton.addEventListener("click", () => {
      const temp = [];
      todos.forEach((t) => {
        if (t != todo) {
          temp.push(t);
        }
      });
      todos = temp;
      localStorage.setItem("todos", JSON.stringify(todos));
      DisplayTodos();
    });

    statusBtn.addEventListener("click", () => {
      let temp_status = todo.status;
      if (temp_status === "To-Do") {
        todo.status = "Doing";
      } else if (temp_status === "Doing") {
        todo.status = "Done";
      } else {
        todo.status = "To-Do";
      }
      localStorage.setItem("todos", JSON.stringify(todos));
      DisplayTodos();
    });
  });
}
