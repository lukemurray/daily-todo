import * as React from 'react'
import { TodoItem } from '../TodoManager';
import InlineEdit from './InlineEdit';

interface Props {
    data: TodoItem
    className?: string
    onDoneToggle: (todo: TodoItem, done: boolean) => void
    onEdited: (prevTodo: TodoItem, updatedTodo: TodoItem) => void
}

interface State {
    hover: boolean
    edit: boolean
}

export default class Todo extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            hover: false,
            edit: false,
        }

        this.onHover = this.onHover.bind(this)
        this.onHoverStop = this.onHoverStop.bind(this)
        this.editItem = this.editItem.bind(this)
        this.onEditComplete = this.onEditComplete.bind(this)
    }

    private onHover() {
        if (!this.state.hover) {
            this.setState({hover: true})
        }
    }

    private onHoverStop() {
        this.setState({hover: false})
    }

    private editItem(e: React.MouseEvent<HTMLAnchorElement>) {
        e.stopPropagation()
        this.setState({edit: true})
    }
    private onEditComplete(data: {value: string, wasEnter: boolean}) {
        this.props.onEdited(this.props.data, Object.assign({}, this.props.data, {description: data.value}))
    }

    render() {
        let todoData = <>
            {this.props.data.description}
            <a className="is-action" onClick={this.editItem} style={{display: this.state.hover && !this.props.data.done ? 'block' : 'none' }}>edit</a>
        </>

        if (this.state.edit) {
            todoData = <InlineEdit editing={true} onCancel={() => this.setState({edit: false})} className="row is-full" value={this.props.data.description} onComplete={this.onEditComplete} />
        }
        return <div className={`row todo ${this.props.className} ${this.props.data.done ? 'done' : ''}`} onMouseOver={this.onHover} onMouseOut={this.onHoverStop} onClick={() => this.props.onDoneToggle(this.props.data, !this.props.data.done)}>
            <div className="handle">{this.state.hover ? '||' : ''}</div>
            <div className="row is-full has-space-between todo-data">
                {todoData}
            </div>
        </div>
    }
}