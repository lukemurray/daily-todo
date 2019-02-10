import * as React from 'react'
import Todo, { TodoItem } from './Todo';
import InlineEdit from './InlineEdit';

interface Props {
    todos: TodoItem[]
    onDoneToggle: (todo: TodoItem, done: boolean) => void
    onNewTodo: (todo: TodoItem, wasEnter: boolean) => void
    onCancelAddTodo: () => void
    hasActiveInput: boolean
}

export default class TodoList extends React.Component<Props> {
    constructor(props: Props) {
        super(props)

    }

    render() {
        return <div className="column is-full is-scrollable todos">
            {this.props.todos.map(todo => {
                return <div key={todo.description} className="column todo-container">
                    <div className="seperator"></div>
                    <Todo data={todo} onDoneToggle={this.props.onDoneToggle} />
                </div>
            })}
            <InlineEdit editing={this.props.hasActiveInput} onCancel={this.props.onCancelAddTodo} className="todo todo-input" onComplete={e => this.props.onNewTodo({description: e.value, done: false}, e.wasEnter)}>Click to add item...</InlineEdit>
        </div>
    }
}