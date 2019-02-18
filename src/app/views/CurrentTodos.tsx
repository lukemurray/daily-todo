import * as React from 'react'
import TodoList from '../components/TodoList';
import TodoManager, { TodoItem, ITodoData } from '../TodoManager';
import Modal from '../components/Modal';

interface State {
    todos: TodoItem[]
    hasActiveInput: boolean
    previouslyDone?: {[key: string]: TodoItem[]}
    showDelete?: TodoItem | null
}

export default class CurrentTodos extends React.Component<{}, State> {
    todoManager: TodoManager;
    constructor(props: {}) {
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

        this.todoManager = new TodoManager()
    }

    componentDidMount() {
        let data = this.todoManager.getTodoData()
        this.setState({todos: data.currentTodos, previouslyDone: data.previouslyDone})
        document.addEventListener('keypress', this.onKeyPress)
    }

    componentWillUnmount() {
        document.removeEventListener('keypress', this.onKeyPress)
    }

    componentDidUpdate(prevProps: {}, prevState: State) {
        if (this.hasChanges(prevState.todos, this.state.todos)) {
            console.log('saving file...')
            let data: ITodoData = {
                currentTodos: this.state.todos,
                previouslyDone: this.state.previouslyDone
            }
            this.todoManager.saveTodoData(data)
        }
    }

    private onKeyPress(event: KeyboardEvent) {
        if (event.code == 'Space' && !this.state.hasActiveInput && document.activeElement!.tagName != 'INPUT') {
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

    private onNewTodo(todo: TodoItem, wasEnter: boolean) {
        if (todo.description.trim().length > 0) {
            this.setState({
                todos: this.state.todos.concat(todo),
                hasActiveInput: wasEnter
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
            this.setState({todos: todos})
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

    private showPastTodos() {

    }

    render() {
        return <div className="column is-full">
            <div className="row header">
                <div className="header-side">
                    {this.state.previouslyDone && Object.keys(this.state.previouslyDone).length > 0 ? <button onClick={this.showPastTodos}><i className="fas fa-chevron-left"></i></button> : null}
                </div>
                <div>Do it!</div>
                <div className="header-side">
                    <button onClick={this.clearDone}>Tick</button>
                </div>
            </div>
            <TodoList todos={this.state.todos}
                onTodoEdited={this.onTodoEdited}
                onTodoDelete={this.onTodoDelete}
                onDoneToggle={this.onDoneToggle}
                onNewTodo={this.onNewTodo}
                onCancelAddTodo={this.onCancelAddTodo}
                hasActiveInput={this.state.hasActiveInput}
                onOrderUpdated={this.onOrderUpdated} />
            {this.state.showDelete ? <Modal onCancel={() => this.setState({showDelete: null})} onOk={this.onTodoDeleteConfirmed}>
                Delete '{this.state.showDelete.description}'?
            </Modal> : null}
        </div>
    }
}