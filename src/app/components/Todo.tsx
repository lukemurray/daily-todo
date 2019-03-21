import * as React from 'react'
import { TodoItem } from '../TodoManager';
import InlineEdit, { Key } from './InlineEdit';

interface Props {
    data: TodoItem
    className?: string
    onDoneToggle?: (todo: TodoItem, done: boolean) => void
    onEditClicked?: () => void
    onEdited?: (prevTodo: TodoItem, updatedTodo: TodoItem) => void
    onEditCancel?: () => void
    onDelete?: (todo: TodoItem) => void
    edit?: boolean
    readonly?: boolean
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
        this.onToggleDone = this.onToggleDone.bind(this)
    }

    private onHover() {
        if (!this.state.hover && !this.props.readonly) {
            this.setState({hover: true})
        }
    }

    private onHoverStop() {
        this.setState({hover: false})
    }

    private editItem(e: React.MouseEvent<HTMLAnchorElement>) {
        e.stopPropagation()
        if (this.props.onEditClicked && !this.props.readonly) {
            this.props.onEditClicked()
        }
    }

    private onEditComplete(data: {value: string, keys: Key[]}) {
        if (this.props.onEdited && !this.props.readonly) {
            this.props.onEdited(this.props.data, Object.assign({}, this.props.data, {description: data.value}))
        }
    }

    private deleteItem(e: React.MouseEvent<HTMLAnchorElement>) {
        e.stopPropagation()
        if (this.props.onDelete && !this.props.readonly) {
            this.props.onDelete(this.props.data)
        }
    }

    private onToggleDone() {
        if (this.props.onDoneToggle && !this.props.readonly) {
            this.props.onDoneToggle(this.props.data, !this.props.data.done)
        }
    }

    render() {
        let todoData = <>{this.props.data.description}</>

        if (this.props.edit) {
            todoData = <InlineEdit editing={true} onCancel={this.props.onEditCancel!} className="row is-full" value={this.props.data.description} onComplete={this.onEditComplete} />
        }
        return <div className={`row todo ${this.props.className} ${this.props.data.done && !this.props.readonly ? 'done' : ''} ${this.props.readonly ? 'readonly' : ''}`} onMouseOver={this.onHover} onMouseOut={this.onHoverStop} onClick={this.onToggleDone}>
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