import * as React from 'react'
import { useState } from 'react';
import { TodoItem } from '../TodoManager';
import InlineEdit, { Key } from './InlineEdit';

interface Props {
    onNewTodo: (todo: TodoItem, keys: Key[]) => void
}

export const TodoSeparator: React.FC<Props> = (props) => {
    const [isAdding, setIsAdding] = useState(false);

    if (isAdding)
        return <InlineEdit editing={true}
            onCancel={() => setIsAdding(false)}
            className="todo todo-input"
            onComplete={e => {
                props.onNewTodo({description: e.value, done: undefined}, e.keys)
                setIsAdding(false)
            }}></InlineEdit>

    return <div className="separator can-insert"
        onDoubleClick={() => setIsAdding(true)}
        title="Double click to insert new item"></div>
}