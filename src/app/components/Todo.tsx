import * as React from 'react'

export interface TodoItem {
    id: number
    done: boolean
    description: string
}

interface Props {
    data: TodoItem
    className?: string
    onDoneToggle: (todo: TodoItem, done: boolean) => void
}

export default class Todo extends React.Component<Props> {
    render() {
        return <div className={`row todo ${this.props.className} ${this.props.data.done ? 'done' : ''}`} onClick={() => this.props.onDoneToggle(this.props.data, !this.props.data.done)}>
            {this.props.data.description}
        </div>
    }
}