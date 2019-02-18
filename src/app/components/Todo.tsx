import * as React from 'react'
import { TodoItem } from '../TodoManager';
import InlineEdit from './InlineEdit';

interface Props {
    data: TodoItem
    className?: string
    onDoneToggle: (todo: TodoItem, done: boolean) => void
    onEditClicked: () => void
    onEdited: (prevTodo: TodoItem, updatedTodo: TodoItem) => void
    onEditCancel: () => void
    onDelete: (todo: TodoItem) => void
    edit: boolean
}

interface State {
    hover: boolean
}

export default class Todo extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            hover: false,
        }

        this.onHover = this.onHover.bind(this)
        this.onHoverStop = this.onHoverStop.bind(this)
        this.editItem = this.editItem.bind(this)
        this.onEditComplete = this.onEditComplete.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
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
        this.props.onEditClicked()
    }
    private onEditComplete(data: {value: string, wasEnter: boolean}) {
        this.props.onEdited(this.props.data, Object.assign({}, this.props.data, {description: data.value}))
    }

    private deleteItem(e: React.MouseEvent<HTMLAnchorElement>) {
        e.stopPropagation()
        this.props.onDelete(this.props.data)
    }

    render() {
        let todoData = <>{this.props.data.description}</>

        if (this.props.edit) {
            todoData = <InlineEdit editing={true} onCancel={this.props.onEditCancel} className="row is-full" value={this.props.data.description} onComplete={this.onEditComplete} />
        }
        return <div className={`row todo ${this.props.className} ${this.props.data.done ? 'done' : ''}`} onMouseOver={this.onHover} onMouseOut={this.onHoverStop} onClick={() => this.props.onDoneToggle(this.props.data, !this.props.data.done)}>
            <div className="handle">{this.state.hover ? '||' : ''}</div>
            <div className="row is-full todo-description">
                {todoData}
            </div>
            <div className="todo-end">
                <a className="is-action" onClick={this.editItem} style={{display: !this.props.edit && this.state.hover && !this.props.data.done ? 'block' : 'none' }}><i className="fas fa-pen"></i></a>
                <a className="is-action" onClick={this.deleteItem} style={{display: !this.props.edit && this.state.hover && !this.props.data.done ? 'block' : 'none' }}><i className="fas fa-trash-alt"></i></a>
            </div>
        </div>
    }
}