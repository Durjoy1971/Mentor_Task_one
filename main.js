"use strict";

let todos = [];

const editUserName = () => {
  const nameInput = document.querySelector("#name");
  nameInput.value = localStorage.getItem("username") || "";
  nameInput.addEventListener("change", handleUserName);
};

const handleUserName = (e) => {
  saveUserName(e.target.value);
};

const saveUserName = (name) => {
  localStorage.setItem("username", name);
};

const toogleStatus = (status) => {
  if (status === "To-Do") {
    return "Doing";
  } else if (status === "Doing") {
    return "Done";
  } else {
    return "To-Do";
  }
};

const addNewTodoForm = () => {
  const newTodoForm = document.querySelector("#new-todo-form");
  newTodoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const content = e.target.content.value;
    if (content.trim() !== "") {
      todos = addTodo(content);
      saveTodos(todos);
      e.target.reset();
      DisplayTodos();
    }
  });
};

const addTodo = (content) => {
  const todo = {
    content,
    status: "To-Do",
    createdAt: new Date().getTime(),
  };
  return [...todos, todo];
};

const saveTodos = (todos) =>
  localStorage.setItem("todos", JSON.stringify(todos));

const deleteTodo = (todo) => {
  return todos.filter((cur_todo) => cur_todo !== todo);
};

const fetchingToDo = () => {
  todos = JSON.parse(localStorage.getItem("todos")) || [];
};

window.addEventListener("load", () => {
  editUserName();
  addNewTodoForm();
  fetchingToDo();
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
      todos = deleteTodo(todo);
      saveTodos(todos);
      DisplayTodos();
    });

    statusBtn.addEventListener("click", () => {
      todo.status = toogleStatus(todo.status);
      saveTodos(todos);
      DisplayTodos();
    });
  });
}
