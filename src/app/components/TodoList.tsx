import * as React from 'react'
import Todo, { TodoItem } from './Todo';
import InlineEdit from './InlineEdit';

interface Props {
    todos: TodoItem[]
    onDoneToggle: (todo: TodoItem, done: boolean) => void
}

export default class TodoList extends React.Component<Props> {
    constructor(props: Props) {
        super(props)

    }

    render() {
        return <div className="column is-full is-scrollable todos">
            {this.props.todos.map(todo => {
                return <div key={todo.id} className="column">
                    <div className="seperator"></div>
                    <Todo data={todo} onDoneToggle={this.props.onDoneToggle} />
                </div>
            })}
            <InlineEdit className="todo todo-input">Click to add item...</InlineEdit>
        </div>
    }
}