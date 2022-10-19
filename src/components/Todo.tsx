import React from 'react'
import { TodoItem, TodoItemType } from '../TodoManager';
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

export const Todo = (props: Props) => {
    const [hover, setHover] = React.useState(false)

    const onHover = () => {
        if (!hover && !props.readonly) {
            setHover(true)
        }
    }

    const onHoverStop = () => {
        if (hover) {
            setHover(false)
        }
    }

    const editItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.stopPropagation()
        if (props.onEditClicked && !props.readonly) {
            props.onEditClicked()
        }
    }

    const onEditComplete = (data: {value: string, keys: Key[]}) => {
        if (props.onEdited && !props.readonly) {
            props.onEdited(props.data, Object.assign({}, props.data, {description: data.value}))
        }
    }

    const deleteItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.stopPropagation()
        if (props.onDelete && !props.readonly) {
            props.onDelete(props.data)
        }
    }

    const onToggleDone = () => {
        if (props.onDoneToggle && !props.readonly) {
            props.onDoneToggle(props.data, !props.data.done)
        }
    }

    let todoData = <>{props.data.description}</>
    if (props.edit) {
        todoData = <InlineEdit editing={true} onCancel={props.onEditCancel!} className="row is-full" value={props.data.description} onComplete={onEditComplete} />
    }

    const isSection = props.data.type == TodoItemType.Section

    return <div className={`row todo ${isSection ? 'section' : ''} ${props.className} ${props.data.done && !props.readonly ? 'done' : ''} ${props.readonly ? 'readonly' : ''}`} onMouseOver={onHover} onMouseLeave={onHoverStop} onClick={isSection ? undefined : onToggleDone}>
        {isSection ? null : <div className="handle">{hover ? '||' : ''}</div>}
        <div className="row is-full todo-description">
            {todoData}
        </div>
        <div className="todo-end">
            <a className="is-action" onClick={editItem} style={{display: !props.edit && hover && !props.data.done ? 'block' : 'none' }}><i className="fas fa-pen"></i></a>
            <a className="is-action" onClick={deleteItem} style={{display: !props.edit && hover && !props.data.done ? 'block' : 'none' }}><i className="fas fa-trash-alt"></i></a>
        </div>
    </div>
}