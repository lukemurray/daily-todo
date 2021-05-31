import * as React from 'react'
import TodoList from '../components/TodoList';
import TodoManager, { TodoItem, ITodoListData, FilePath } from '../TodoManager';
import Modal from '../components/Modal';
import { Key } from '../components/InlineEdit';

interface State {
    todos: TodoItem[]
    hasActiveInput: boolean
    previouslyDone?: {[key: string]: TodoItem[]}
    showDelete?: TodoItem | null
    editingIndex?: number
    activeList?: string
}

interface Props {
    history: { push: (route: string) => void}
}

export default class CurrentTodos extends React.Component<Props, State> {
    todoManager: TodoManager;
    constructor(props: Props) {
        super(props)

        this.state = {
            todos: [],
            hasActiveInput: false,
        }

        this.onDoneToggle = this.onDoneToggle.bind(this)
        this.onNewTodo = this.onNewTodo.bind(this)
        this.onCancelAddTodo = this.onCancelAddTodo.bind(this)
        this.onOrderUpdated = this.onOrderUpdated.bind(this)
        this.clearDone = this.clearDone.bind(this)
        this.onKeyPress = this.onKeyPress.bind(this)
        this.showPastTodos = this.showPastTodos.bind(this)
        this.onTodoEdited = this.onTodoEdited.bind(this)
        this.onTodoDelete = this.onTodoDelete.bind(this)
        this.onTodoDeleteConfirmed = this.onTodoDeleteConfirmed.bind(this)
        this.onTodoEditCancel = this.onTodoEditCancel.bind(this)
        this.onTodoEditClick = this.onTodoEditClick.bind(this)

        this.todoManager = new TodoManager(FilePath)
    }

    componentDidMount() {
        let todoLists = this.todoManager.getListNames()
        this.setState({activeList: todoLists.length > 0 ? todoLists[0] : 'Todo'})

        document.addEventListener('keypress', this.onKeyPress)
    }

    componentWillUnmount() {
        document.removeEventListener('keypress', this.onKeyPress)
    }

    componentDidUpdate(prevProps: {}, prevState: State) {
        if (this.hasChanges(prevState.todos, this.state.todos)) {
            let data: ITodoListData = {
                currentTodos: this.state.todos,
                previouslyDone: this.state.previouslyDone
            }
            this.todoManager.saveTodoData(this.state.activeList!, data)
        }
        else if (prevState.activeList != this.state.activeList) {
            let data = this.todoManager.getTodoData(this.state.activeList!)
            this.setState({todos: data.currentTodos, previouslyDone: data.previouslyDone})
        }
    }

    private onKeyPress(event: KeyboardEvent) {
        if (event.code == 'Space' && !this.state.hasActiveInput && !this.state.editingIndex) {
            this.setState({hasActiveInput: true})
            event.preventDefault()
        }
    }

    private hasChanges(prevTodos: TodoItem[], todos: TodoItem[]) {
        if (prevTodos != todos || prevTodos.length != todos.length) {
            return true
        }
        for (let i = 0; i < todos.length; i++) {
            const prev = prevTodos[i];
            const todo = todos[i];
            for (const key in prev) {
                if ((prev as any)[key] != (todo as any)[key]) {
                    return true
                }
            }
            if (prev != todo)
                return true
        }
        return false
    }

    private onDoneToggle(todo: TodoItem, done: boolean) {
        if (!this.state.todos) {
            return
        }

        const matchTodoIdx = this.state.todos.findIndex(t => t.description == todo.description)
        if (matchTodoIdx > -1) {
            let todos = this.state.todos.concat([])
            let matchTodo = Object.assign({}, todos[matchTodoIdx])
            matchTodo.done = done ? new Date() : undefined
            todos.splice(matchTodoIdx, 1, matchTodo)
            this.setState({todos: todos})
        }
    }

    private onNewTodo(todo: TodoItem, keys: Key[], index: number | null = null) {
        if (todo.description.trim().length > 0) {
            let todos = this.state.todos
            if (keys.includes(Key.CommandControl)) {
                todos.splice(0, 0, todo)
            }
            else if (index !== null) {
                todos.splice(index, 0, todo)
            }
            else {
                todos = todos.concat(todo)
            }
            this.setState({
                todos: todos,
                hasActiveInput: index == null && keys.includes(Key.Enter)
            })
        }
    }

    private onCancelAddTodo() {
        this.setState({hasActiveInput: false})
    }

    private onOrderUpdated(fromIndex: number, toIndex: number) {
        let todos = this.state.todos.concat([])
        let moving = todos.splice(fromIndex, 1)[0]
        todos.splice(toIndex, 0, moving)
        this.setState({todos: todos})
    }

    private clearDone() {
        let todos = this.state.todos.concat([])
        let doneTodos = todos.filter(t => t.done)
        if (doneTodos.length > 0) {
            doneTodos.forEach(t => todos.splice(todos.indexOf(t), 1))

            let cleared = new Date()
            let previouslyDone = Object.assign({}, this.state.previouslyDone)
            previouslyDone[cleared.toJSON()] = doneTodos

            this.setState({previouslyDone: previouslyDone, todos: todos})
        }
    }

    private onTodoEdited(prevTodo: TodoItem, updatedTodo: TodoItem) {
        const matchTodoIdx = this.state.todos.findIndex(t => t.description == prevTodo.description)
        if (matchTodoIdx > -1) {
            let todos = this.state.todos.concat([])
            todos.splice(matchTodoIdx, 1, updatedTodo)
            this.setState({todos: todos, editingIndex: undefined})
        }
    }

    private onTodoDelete(todo: TodoItem) {
        this.setState({showDelete: todo})
    }

    private onTodoDeleteConfirmed() {
        const matchTodoIdx = this.state.todos.findIndex(t => t.description == this.state.showDelete!.description)
        if (matchTodoIdx > -1) {
            let todos = this.state.todos.concat([])
            todos.splice(matchTodoIdx, 1)
            this.setState({todos: todos, showDelete: null})
        }
    }

    private onTodoEditCancel() {
        this.setState({editingIndex: undefined})
    }

    private onTodoEditClick(index: number) {
        this.setState({editingIndex: index})
    }

    private showPastTodos() {
        let keys = Object.keys(this.state.previouslyDone as any)
        let route = keys[keys.length - 1]
        this.props.history.push(`/${this.state.activeList}/${route}`)
    }

    render() {
        return <div className="column is-full">
            <div className="row header">
                <div className="header-side">
                </div>
                <div className="column is-centered">
                <div className="app-header">Do it!</div>
                    <div className="todo-list-name">{this.state.activeList}</div>
                </div>
                <div className="header-side">
                    <button disabled={!(this.state.previouslyDone && Object.keys(this.state.previouslyDone).length > 0)} title="View previously completed tasks" onClick={this.showPastTodos}><i className="far fa-calendar-alt"></i></button>
                    <button title="Clear all completed tasks" onClick={this.clearDone}><i className="fas fa-check"></i></button>
                </div>
            </div>
            <TodoList todos={this.state.todos}
                onTodoEditCancel={this.onTodoEditCancel}
                onTodoEditClicked={this.onTodoEditClick}
                editingTodoAt={this.state.editingIndex}
                onTodoEdited={this.onTodoEdited}
                onTodoDelete={this.onTodoDelete}
                onDoneToggle={this.onDoneToggle}
                onNewTodo={this.onNewTodo}
                onCancelAddTodo={this.onCancelAddTodo}
                hasActiveInput={this.state.hasActiveInput}
                onTodoAddStart={() => this.setState({hasActiveInput: true})}
                onOrderUpdated={this.onOrderUpdated} />
            {this.state.showDelete ? <Modal onCancel={() => this.setState({showDelete: null})} onOk={this.onTodoDeleteConfirmed}>
                Delete '{this.state.showDelete.description}'?
            </Modal> : null}
        </div>
    }
}