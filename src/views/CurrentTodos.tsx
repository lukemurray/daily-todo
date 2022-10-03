import TodoList from '../components/TodoList';
import TodoManager, { TodoItem, FilePath, ITodoListData } from '../TodoManager';
import Modal from '../components/Modal';
import { Key } from '../components/InlineEdit';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DropDown } from '../components/DropDown';
import { useNewListModal } from '../components/NewListModal';

const todoManager: TodoManager = new TodoManager(FilePath)

export const CurrentTodos = () => {
    const navigate = useNavigate()
    const [todos, setTodos] = useState<TodoItem[]>([])
    const [hasActiveInput, setHasActiveInput] = useState(false)
    const [activeList, setActiveList] = useState<string>()
    const [editingIndex, setEditingIndex] = useState<number>()
    const [previouslyDone, setPreviouslyDone] = useState<{[key: string]: TodoItem[]}>({})
    const [showDelete, setShowDelete] = useState<TodoItem | null>(null)
    const [todoLists, setTodoLists] = useState<string[]>([])

    const addNewList = async (name: string) => {
        await todoManager.addTodoList(name)
        setActiveList(name)
        setTodoLists(items => items.concat([name]))
        showNewListModal(false)
    }

    const [newListModal, showNewListModal] = useNewListModal({onCreate: addNewList})

    // load Todos and register keypress
    useEffect(() => {
        const loadLists = async () => {
            let todoLists = await todoManager.getListNames()
            setActiveList(todoLists.length > 0 ? todoLists[0] : 'Todo')
            setTodoLists(todoLists)
        }
        loadLists()

        document.addEventListener('keypress', onKeyPress)
        return () => {
            document.removeEventListener('keypress', onKeyPress)
        }
    }, [])

    // save Todos
    useEffect(() => {
        if (activeList) {
            let data: ITodoListData = {
                currentTodos: todos,
                previouslyDone: previouslyDone
            }
            todoManager.saveTodoData(activeList!, data)
        }
    }, [todos])

    // load active list
    useEffect(() => {
        const loadList = async () => {
            let data = await todoManager.getTodoData(activeList!)
            setTodos(data.currentTodos)
            setPreviouslyDone(data.previouslyDone ?? {})
        }
        if (activeList) {
            loadList()
        }
    }, [activeList])

    const onKeyPress = (event: KeyboardEvent) => {
        if (event.key == 't' && event.ctrlKey && !hasActiveInput && !editingIndex) {
            setHasActiveInput(true)
            event.preventDefault()
        }
    }

    const onDoneToggle = (todo: TodoItem, done: boolean) => {
        if (!todos) {
            return
        }

        const matchTodoIdx = todos.findIndex(t => t.description == todo.description)
        if (matchTodoIdx > -1) {
            let todosNew = todos.concat([])
            let matchTodo = Object.assign({}, todosNew[matchTodoIdx])
            matchTodo.done = done ? new Date() : undefined
            todosNew.splice(matchTodoIdx, 1, matchTodo)
            setTodos(todosNew)
        }
    }

    const onNewTodo = (todo: TodoItem, keys: Key[], index: number | null = null) => {
        if (todo.description.trim().length > 0) {
            let todosNew = todos
            if (keys.includes(Key.CommandControl)) {
                todosNew = [todo].concat(todosNew)
            }
            else if (index !== null) {
                todosNew = [...todos]
                todosNew.splice(index, 0, todo)
            }
            else {
                todosNew = todosNew.concat(todo)
            }
            setTodos(todosNew)
            setHasActiveInput(index == null && keys.includes(Key.Enter))
        }
    }

    const onCancelAddTodo = () => {
        setHasActiveInput(false)
    }

    const onOrderUpdated = (fromIndex: number, toIndex: number) => {
        let todosNew = todos.concat([])
        let moving = todosNew.splice(fromIndex, 1)[0]
        todosNew.splice(toIndex, 0, moving)
        setTodos(todosNew)
    }

    const clearDone = () => {
        let todosNew = todos.concat([])
        let doneTodos = todosNew.filter(t => t.done)
        if (doneTodos.length > 0) {
            doneTodos.forEach(t => todosNew.splice(todosNew.indexOf(t), 1))

            const cleared = new Date()
            const previouslyDoneNew: {[key: string]: TodoItem[]} = Object.assign({}, previouslyDone)
            previouslyDoneNew[cleared.toJSON()] = doneTodos

            setTodos(todosNew)
            setPreviouslyDone(previouslyDoneNew)
        }
    }

    const onTodoEdited = (prevTodo: TodoItem, updatedTodo: TodoItem) => {
        const matchTodoIdx = todos.findIndex(t => t.description == prevTodo.description)
        if (matchTodoIdx > -1) {
            let todosNew = todos.concat([])
            todosNew.splice(matchTodoIdx, 1, updatedTodo)
            setTodos(todosNew)
            setEditingIndex(undefined)
        }
    }

    const onTodoDelete = (todo: TodoItem) => {
        setShowDelete(todo)
    }

    const onTodoDeleteConfirmed = () => {
        const matchTodoIdx = todos.findIndex(t => t.description == showDelete!.description)
        if (matchTodoIdx > -1) {
            let todosNew = todos.concat([])
            todosNew.splice(matchTodoIdx, 1)
            setTodos(todosNew)
            setShowDelete(null)
        }
    }

    const onTodoEditCancel = () => {
        setEditingIndex(undefined)
    }

    const onTodoEditClick = (index: number) => {
        setEditingIndex(index)
    }

    const showPastTodos = () => {
        let keys = Object.keys(previouslyDone as any)
        let route = keys[keys.length - 1]
        navigate(`/${activeList}/${route}`)
    }

    return <div className="column is-full">
        <div className="row header">
            <div className="header-side">
            </div>
            <div className="column is-centered">
            <div className="app-header">Do it!</div>
                <DropDown element={<div className="todo-list-name">{activeList}</div>}>
                    {todoLists.map(list => <div className="dropdown-item" onClick={() => setActiveList(list)}>{list}</div>)}
                    <div className="dropdown-item" onClick={() => showNewListModal()}>New list...</div>
                </DropDown>
            </div>
            <div className="header-side">
                <button disabled={!(previouslyDone && Object.keys(previouslyDone).length > 0)} title="View previously completed tasks" onClick={showPastTodos}><i className="far fa-calendar-alt"></i></button>
                <button title="Clear all completed tasks" onClick={clearDone}><i className="fas fa-check"></i></button>
            </div>
        </div>
        <TodoList todos={todos}
            onTodoEditCancel={onTodoEditCancel}
            onTodoEditClicked={onTodoEditClick}
            editingTodoAt={editingIndex}
            onTodoEdited={onTodoEdited}
            onTodoDelete={onTodoDelete}
            onDoneToggle={onDoneToggle}
            onNewTodo={onNewTodo}
            onCancelAddTodo={onCancelAddTodo}
            hasActiveInput={hasActiveInput}
            onTodoAddStart={() => setHasActiveInput(true)}
            onOrderUpdated={onOrderUpdated} />
        {showDelete ? <Modal onCancel={() => setShowDelete(null)} onOk={onTodoDeleteConfirmed}>
            Delete '{showDelete.description}'?
        </Modal> : null}
        {newListModal}
    </div>
}