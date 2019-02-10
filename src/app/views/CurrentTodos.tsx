import * as React from 'react'
import TodoList from '../components/TodoList';
import { TodoItem } from '../components/Todo';

interface State {
    todos: TodoItem[]
    hasActiveInput: boolean
}

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

    private onDoneToggle(todo: TodoItem, done: boolean) {
        if (!this.state.todos) {
            return
        }

        const matchTodo = this.state.todos.find(t => t.description == todo.description)
        if (matchTodo) {
            matchTodo.done = done
        }
        this.setState({todos: this.state.todos})
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