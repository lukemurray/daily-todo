import React, { useEffect } from 'react'
import TodoManager, { TodoItem, FilePath } from '../TodoManager';
import {Todo} from '../components/Todo';
import { useNavigate, useParams } from 'react-router-dom';

const todoManager: TodoManager = new TodoManager(FilePath)

export const CompletedTodos = () => {
    const [todos, setTodos] = React.useState<{[key: string]: TodoItem[]}>({})
    const [completedDates, setCompletedDates] = React.useState<string[]>([])
    const [selectedKey, setSelectedKey] = React.useState<string>('')
    const { list, completed } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        const loadList = async () => {
            let data = await todoManager.getTodoData(list!)
            let keys = Object.keys(data.previouslyDone!)
            setCompletedDates(keys)
            setSelectedKey(completed ?? '')
            setTodos(data.previouslyDone ?? {})
        }
        loadList()
    }, [])

    const gotoActive = () => {
        navigate('/')
    }

    const step = (index: number) => {
        setSelectedKey(completedDates[index])
    }

    let loading = false
    if (selectedKey == '') {
        loading = true
    }

    let index = completedDates.indexOf(selectedKey)
    let hasNext = !loading && index < completedDates.length - 1
    let hasPrev = !loading && index > 0

    let todoList = todos[selectedKey]
    return <div className="column is-full">
        <div className="row header">
            <div className="header-side">
            </div>
            <div className="row is-centered">
                <button className="link" disabled={!hasPrev} title="Previous completed tasks" onClick={() => step(index - 1)}><i className="fas fa-chevron-left"></i></button>
                <div className="column is-centered">
                    <div>Did it!</div>
                    <div className="todo-list-name">{list}</div>
                </div>
                <button className="link" disabled={!hasNext} title="Next completed tasks" onClick={() => step(index + 1)}><i className="fas fa-chevron-right"></i></button>
            </div>
            <div className="header-side">
                <button title="View current tasks" onClick={gotoActive}><i className="fas fa-times"></i></button>
            </div>
        </div>
        <div className="column is-full todos is-scrollable">
            <div className="column">
                {loading ? 'Loading...' : todoList.map((todo, i) => {
                    return <div key={i} className='column todo-container'>
                        <div className="separator"></div>
                        <Todo data={todo} readonly={true} />
                    </div>
                })}
            </div>
        </div>
    </div>
}