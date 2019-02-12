import * as React from 'react'
import TodoList from '../components/TodoList';
import { TodoItem } from '../components/Todo';
import * as fs from 'fs'

interface TodoData {
    currentTodos: TodoItem[]
    previouslyDone?: {[key: string]: TodoItem[]}
}

interface State {
    todos: TodoItem[]
    hasActiveInput: boolean
    previouslyDone?: {[key: string]: TodoItem[]}
}

const FilePath = './todos.json';

export default class CurrentTodos extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props)

        this.state = {
            todos: [],
            hasActiveInput: false
        }

        this.onDoneToggle = this.onDoneToggle.bind(this)
        this.onNewTodo = this.onNewTodo.bind(this)
        this.onCancelAddTodo = this.onCancelAddTodo.bind(this)
        this.onOrderUpdated = this.onOrderUpdated.bind(this)
        this.clearDone = this.clearDone.bind(this)
    }

    componentDidMount() {
        if (fs.existsSync(FilePath)) {
            let file = fs.readFileSync(FilePath, 'utf8')
            if (file) {
                let data: TodoData = JSON.parse(file)
                this.setState({todos: data.currentTodos, previouslyDone: data.previouslyDone})
            }
        }
    }

    componentDidUpdate(prevProps: {}, prevState: State) {
        if (this.hasChanges(prevState.todos, this.state.todos)) {
            console.log('saving file...')
            this.updateData()
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
                if (prev.description == 'Email')
                    console.log(key, (prev as any)[key], (todo as any)[key], (prev as any)[key] != (todo as any)[key])
                if ((prev as any)[key] != (todo as any)[key]) {
                    return true
                }
            }
            if (prev != todo)
                return true
        }
        return false
    }

    private updateData() {
        let data: TodoData = {
            currentTodos: this.state.todos,
            previouslyDone: this.state.previouslyDone
        }
        fs.writeFileSync(FilePath, JSON.stringify(data))
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
        doneTodos.forEach(t => todos.splice(todos.indexOf(t), 1))

        let cleared = new Date()
        let previouslyDone = Object.assign({}, this.state.previouslyDone)
        previouslyDone[cleared.toJSON()] = doneTodos

        this.setState({previouslyDone: previouslyDone, todos: todos})
    }

    render() {
        return <div className="column is-full">
            <div className="row header">
                <div className="header-side">
                    {this.state.previouslyDone && Object.keys(this.state.previouslyDone).length > 0 ? <button>&lt;</button> : null}
                </div>
                <div>Do it!</div>
                <div className="header-side">
                    <button onClick={this.clearDone}>Tick</button>
                </div>
            </div>
            <TodoList todos={this.state.todos}
                onDoneToggle={this.onDoneToggle}
                onNewTodo={this.onNewTodo}
                onCancelAddTodo={this.onCancelAddTodo}
                hasActiveInput={this.state.hasActiveInput}
                onOrderUpdated={this.onOrderUpdated} />
        </div>
    }
}