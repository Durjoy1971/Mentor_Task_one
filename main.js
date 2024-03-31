"use strict";

class TodoApp {
  constructor() {
    this.todos = [];
    this.username = "";
  }

  load() {
    this.editUserName();
    this.addNewTodoForm();
    this.DisplayTodos(this.fetchingToDo());
  }

  editUserName() {
    const nameInput = document.querySelector("#name");
    nameInput.value = localStorage.getItem("username") || "";
    nameInput.addEventListener("change", this.handleUserName);
  }

  handleUserName = (e) => {
    this.saveUserName(e.target.value);
  };
  saveUserName = (name) => {
    localStorage.setItem("username", name);
  };

  toogleStatus = (status) => {
    return status === "To-Do"
      ? (status = "Doing")
      : status === "Doing"
      ? (status = "Done")
      : (status = "To-Do");
  };

  addNewTodoForm = () => {
    const newTodoForm = document.querySelector("#new-todo-form");
    newTodoForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const content = e.target.content.value.trim();
      if (content !== "") {
        const todos = this.addTodo(content, this.fetchingToDo());
        this.saveTodos(todos);
        e.target.reset();
        this.DisplayTodos(todos);
      }
    });
  };

  addTodo = (content, todos) => {
    const newTodo = {
      content,
      status: "To-Do",
      createdAt: new Date().getTime(),
    };
    return [...todos, newTodo];
  };

  saveTodos = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  deleteTodo = (todo, todos) => {
    return todos.filter((cur_todo) => cur_todo !== todo);
  };

  fetchingToDo = () => {
    return JSON.parse(localStorage.getItem("todos")) || [];
  };

  DisplayTodos(todos) {
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
          const updatedTodo = this.updateTodoEdit(todo, e.target.value, todos);
          this.saveTodos(updatedTodo);
          this.DisplayTodos(updatedTodo);
        });
      });

      deleteButton.addEventListener("click", () => {
        const updatedTodo = this.deleteTodo(todo, todos);
        this.saveTodos(updatedTodo);
        this.DisplayTodos(updatedTodo);
      });

      statusBtn.addEventListener("click", () => {
        const newStatus = this.toogleStatus(todo.status);
        const updatedTodo = this.updateTodoStatus(todo, newStatus, todos);
        this.saveTodos(updatedTodo);
        this.DisplayTodos(updatedTodo);
      });

      return todoItem;
    });

    todoItems.forEach((todoItem) => {
      todoList.appendChild(todoItem);
    });
  }

  updateTodoStatus = (todo, newStatus, todos) => {
    return todos.map((cur_todo) => {
      return cur_todo === todo ? { ...todo, status: newStatus } : cur_todo;
    });
  };

  updateTodoEdit = (todo, newContent, todos) => {
    return todos.map((cur_todo) => {
      return cur_todo === todo ? { ...todo, content: newContent } : cur_todo;
    });
  };
}

window.addEventListener("load", () => {
  const todoApp = new TodoApp();
  todoApp.load();
});
