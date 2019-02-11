import * as React from 'react'
import TodoList from '../components/TodoList';
import { TodoItem } from '../components/Todo';
import * as fs from 'fs'

interface State {
    todos: TodoItem[]
    hasActiveInput: boolean
}

const FilePath = './todos.json';

export default class CurrentTodos extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props)

        this.state = {
            todos: [
            ],
            hasActiveInput: false
        }

        this.onDoneToggle = this.onDoneToggle.bind(this)
        this.onNewTodo = this.onNewTodo.bind(this)
        this.onCancelAddTodo = this.onCancelAddTodo.bind(this)
    }

    componentDidMount() {
        if (fs.existsSync(FilePath)) {
            let file = fs.readFileSync(FilePath, 'utf8')
            if (file) {
                this.setState({todos: JSON.parse(file)})
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
        fs.writeFileSync(FilePath, JSON.stringify(this.state.todos))
    }

    private onDoneToggle(todo: TodoItem, done: boolean) {
        if (!this.state.todos) {
            return
        }

        const matchTodoIdx = this.state.todos.findIndex(t => t.description == todo.description)
        if (matchTodoIdx > -1) {
            let todos = this.state.todos.concat([])
            let matchTodo = Object.assign({}, todos[matchTodoIdx])
            matchTodo.done = done
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

    render() {
        return <div className="column is-full">
            <div className="row header">
                Do it!
            </div>
            <TodoList todos={this.state.todos}
                onDoneToggle={this.onDoneToggle}
                onNewTodo={this.onNewTodo}
                onCancelAddTodo={this.onCancelAddTodo}
                hasActiveInput={this.state.hasActiveInput} />
        </div>
    }
}