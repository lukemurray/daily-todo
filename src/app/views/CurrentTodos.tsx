import * as React from 'react'
import TodoList from '../components/TodoList';
import { TodoItem } from '../components/Todo';

interface State {
    todos: TodoItem[]
}

export default class CurrentTodos extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props)

        this.state = {
            todos: [
                {id: 1, done: false, description: 'No that!!!'},
                {id: 2, done: false, description: 'Finsih something'},
                {id: 3, done: false, description: 'aybe this?'},
                {id: 4, done: false, description: 'do that'},
                {id: 5, done: false, description: 'poop'},
            ]
        }

        this.onDoneToggle = this.onDoneToggle.bind(this)
    }

    onDoneToggle(todo: TodoItem, done: boolean) {
        if (!this.state.todos) {
            return
        }

        const matchTodo = this.state.todos.find(t => t.description == todo.description)
        if (matchTodo) {
            matchTodo.done = done
        }
        this.setState({todos: this.state.todos})
    }

    render() {
        return <div className="column is-full">
            <div className="row header">
                Todos
            </div>
            <TodoList todos={this.state.todos} onDoneToggle={this.onDoneToggle} />
        </div>
    }
}