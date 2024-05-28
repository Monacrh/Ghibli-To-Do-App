//variables
let todoItems = []
const todoInput = document.querySelector('.todo-input')
const completedTodosDiv = document.querySelector('.completed-todos')
const uncompletedTodosDiv = document.querySelector('.uncompleted-todos')
const audio = new Audio('pop.mp3')
const audio2 = new Audio('pop2.mp3')

// Get todo list on first boot 
window.onload = () => {
    let storageTodoItems = localStorage.getItem('todoItems') // Ensure consistency in local storage key
    if (storageTodoItems !== null){
        todoItems = JSON.parse(storageTodoItems)
    }
    render()
}

// Get the content typed into the input
todoInput.onkeyup = (e) => {
    let value = e.target.value.trim()
    if (value && e.keyCode === 13) { // Enter key
        addTodo(value);

        todoInput.value = ''
        todoInput.focus()
    }
};

// Add todo
function addTodo(text) {
    todoItems.push({
        id: Date.now(),
        text,
        completed: false
    });
    console.log(todoItems)
    saveAndRender() // Ensure the UI updates after adding a todo
}

// Remove todo
function removeTodo(id){
    todoItems = todoItems.filter(todo => todo.id !== Number(id))
    saveAndRender()
}

// Mark as completed
function markAsCompleted(id){
    todoItems = todoItems.map(todo => {
        if(todo.id === Number(id)){
            todo.completed = true
        }
        return todo
    })
    audio.play()
    saveAndRender()
}

// Mark as uncompleted
function markAsUncompleted(id){
    todoItems = todoItems.map(todo => {
        if(todo.id === Number(id)){
            todo.completed = false
        }
        return todo
    })
    audio.play()
    saveAndRender()
}

// Save in local storage
function save(){
    localStorage.setItem('todoItems', JSON.stringify(todoItems)) // Ensure consistency in local storage key
}

// Render
function render(){
    let uncompletedTodos = todoItems.filter(item => !item.completed)
    let completedTodos = todoItems.filter(item => item.completed)

    completedTodosDiv.innerHTML = ''
    uncompletedTodosDiv.innerHTML = ''

    if(uncompletedTodos.length > 0){
        uncompletedTodos.forEach(todo => {
            uncompletedTodosDiv.append(createTodoElement(todo))
        })
    }else{
        uncompletedTodosDiv.innerHTML = '<div class="empty" style="color: black;"> No uncompleted mission</div>'
    }

    if(completedTodos.length > 0){
        completedTodosDiv.innerHTML = `<div class="completed-title"> Completed (${completedTodos.length}/${todoItems.length})</div>` // Use backticks for string interpolation
        completedTodos.forEach(todo => {
            completedTodosDiv.append(createTodoElement(todo))
        })
    }
}

// Save and render
function saveAndRender(){
    save()
    render()
}

// Create todo list item
function createTodoElement(todo){
    //create todo list container
    const todoDiv = document.createElement('div')
    todoDiv.setAttribute('data-id', todo.id)
    todoDiv.className = 'todo-item'

    //create todo item text
    const todoTextSpan = document.createElement('span')
    todoTextSpan.innerHTML = todo.text

    // checkbox for list
    const todoInputCheckbox = document.createElement('input')
    todoInputCheckbox.type = 'checkbox'
    todoInputCheckbox.checked = todo.completed
    todoInputCheckbox.onclick = (e) => {
        let id = e.target.closest('.todo-item').dataset.id
        e.target.checked ? markAsCompleted(id) : markAsUncompleted(id)
    }

    // Delete button for list
    const todoRemoveBtn = document.createElement('a')
    todoRemoveBtn.href = '#'
    todoRemoveBtn.innerHTML = '<img src="/images/totoro.png" alt="X">'

    todoRemoveBtn.onclick = (e) => {
        let id = e.target.closest('.todo-item').dataset.id
        removeTodo(id)
        audio2.play()
    }
    

    todoTextSpan.prepend(todoInputCheckbox)
    todoDiv.appendChild(todoTextSpan)
    todoDiv.appendChild(todoRemoveBtn)

    return todoDiv
}
