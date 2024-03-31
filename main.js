"use strict";

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
  return status === "To-Do"
    ? (status = "Doing")
    : status === "Doing"
    ? (status = "Done")
    : (status = "To-Do");
};

const addNewTodoForm = () => {
  const newTodoForm = document.querySelector("#new-todo-form");
  newTodoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const content = e.target.content.value.trim();
    if (content !== "") {
      const todos = addTodo(content, fetchingToDo());
      saveTodos(todos);
      e.target.reset();
      DisplayTodos(todos);
    }
  });
};

const addTodo = (content, todos) => {
  const newTodo = {
    content,
    status: "To-Do",
    createdAt: new Date().getTime(),
  };
  return [...todos, newTodo];
};

const saveTodos = (todos) => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const deleteTodo = (todo, todos) => {
  return todos.filter((cur_todo) => cur_todo !== todo);
};

const fetchingToDo = () => {
  return JSON.parse(localStorage.getItem("todos")) || [];
};

window.addEventListener("load", () => {
  editUserName();
  addNewTodoForm();
  DisplayTodos(fetchingToDo());
});

function DisplayTodos(todos) {
  const todoList = document.querySelector("#todo-list");

  todoList.innerHTML = ""; // Clear previous todos

  const todoItems = todos.map((todo) => {
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

    todoItem.appendChild(content);
    todoItem.appendChild(actions);

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
        const updatedTodo = updateTodoEdit(todo, e.target.value, todos);
        saveTodos(updatedTodo);
        DisplayTodos(updatedTodo);
      });
    });

    deleteButton.addEventListener("click", () => {
      const updatedTodo = deleteTodo(todo, todos);
      saveTodos(updatedTodo);
      DisplayTodos(updatedTodo);
    });

    statusBtn.addEventListener("click", () => {
      const newStatus = toogleStatus(todo.status);
      const updatedTodo = updateTodoStatus(todo, newStatus, todos);
      saveTodos(updatedTodo);
      DisplayTodos(updatedTodo);
    });

    return todoItem;
  });

  todoItems.forEach((todoItem) => {
    todoList.appendChild(todoItem);
  });
}

const updateTodoStatus = (todo, newStatus, todos) => {
  return todos.map((cur_todo) => {
    return cur_todo === todo ? { ...todo, status: newStatus } : cur_todo;
  });
};

const updateTodoEdit = (todo, newContent, todos) => {
  return todos.map((cur_todo) => {
    return cur_todo === todo ? { ...todo, content: newContent } : cur_todo;
  });
};
