import * as React from 'react'
import Todo from './Todo';
import InlineEdit, { Key } from './InlineEdit';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { TodoItem } from '../TodoManager';
import { TodoSeparator } from './TodoSeparator';

interface Props {
    todos: TodoItem[]
    onDoneToggle: (todo: TodoItem, done: boolean) => void
    onNewTodo: (todo: TodoItem, keys: Key[], index?: number) => void
    onCancelAddTodo: () => void
    onOrderUpdated: (fromIndex: number, toIndex: number) => void
    onTodoEdited: (prevTodo: TodoItem, updatedTodo: TodoItem) => void
    onTodoEditClicked: (index: number) => void
    onTodoEditCancel: () => void
    onTodoDelete: (todo: TodoItem) => void
    onTodoAddStart: () => void
    hasActiveInput: boolean
    editingTodoAt?: number
}

export default class TodoList extends React.Component<Props> {
    constructor(props: Props) {
        super(props)

        this.onDragEnd = this.onDragEnd.bind(this)
    }

    private onDragEnd(result: DropResult) {
        if (result.destination) {
            this.props.onOrderUpdated(result.source.index, result.destination.index)
        }
    }

    render() {
        return <div className="column is-full todos is-scrollable">
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided) =>
                        <div className="column is-scrollable" ref={provided.innerRef}>
                            {this.props.todos.map((todo, index) => {
                                return <Draggable key={todo.description} draggableId={todo.description} index={index}>
                                {(provided, snapshot) =>
                                    <div ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`column todo-container ${snapshot.isDragging ? 'dragging' : ''}`}>
                                        <TodoSeparator onNewTodo={(todo, keys) => this.props.onNewTodo(todo, keys, index)} />
                                        <Todo data={todo}
                                            onEditClicked={() => this.props.onTodoEditClicked(index)}
                                            onEditCancel={this.props.onTodoEditCancel}
                                            edit={this.props.editingTodoAt == index}
                                            onEdited={this.props.onTodoEdited}
                                            onDelete={this.props.onTodoDelete}
                                            onDoneToggle={this.props.onDoneToggle} />
                                    </div>
                                }</Draggable>
                            })}
                            {provided.placeholder}
                    </div>}
                </Droppable>
            </DragDropContext>
            <InlineEdit editing={this.props.hasActiveInput}
                onCancel={this.props.onCancelAddTodo}
                onEditStart={this.props.onTodoAddStart}
                className="todo todo-input"
                onComplete={e => this.props.onNewTodo({description: e.value, done: undefined}, e.keys)}>Click to add item...</InlineEdit>
        </div>
    }
}