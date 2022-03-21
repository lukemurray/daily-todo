import * as React from 'react'
import TodoManager, { TodoItem, ITodoListData, FilePath } from '../TodoManager';
import Todo from '../components/Todo';

interface State {
    todos: {[key: string]: TodoItem[]}
    completedDates: string[]
    selectedKey: string
}

interface Props {
    history: { push: (route: string) => void}
    match: {
        params: {
            completed: string
            list: string
        }
    }
}

export default class CompletedTodos extends React.Component<Props, State> {
    todoManager: TodoManager;
    constructor(props: Props) {
        super(props)

        this.state = {
            todos: {},
            completedDates: [],
            selectedKey: ''
        }

        this.todoManager = new TodoManager(FilePath)

        this.gotoActive = this.gotoActive.bind(this)
        this.step = this.step.bind(this)
    }

    componentDidMount() {
        let data = this.todoManager.getTodoData(this.props.match.params.list)
        let keys = Object.keys(data.previouslyDone!)
        this.setState({
            completedDates: keys,
            selectedKey: this.props.match.params.completed,
            todos: data.previouslyDone!
        })
    }

    componentWillUnmount() {
    }

    componentDidUpdate(prevProps: {}, prevState: State) {
    }

    private gotoActive() {
        this.props.history.push('/')
    }

    private step(index: number) {
        this.setState({selectedKey: this.state.completedDates[index]})
    }

    render() {
        if (this.state.selectedKey == '') {
            return <>Loading...</>
        }

        let index = this.state.completedDates.indexOf(this.state.selectedKey)
        let hasNext = index < this.state.completedDates.length - 1
        let hasPrev = index > 0

        let todos = this.state.todos[this.state.selectedKey]
        return <div className="column is-full">
            <div className="row header">
                <div className="header-side">
                </div>
                <div className="row is-centered">
                    <button className="link" disabled={!hasPrev} title="Previous completed tasks" onClick={() => this.step(index - 1)}><i className="fas fa-chevron-left"></i></button>
                    <div className="column is-centered">
                        <div>Did it!</div>
                        <div className="todo-list-name">{this.props.match.params.list}</div>
                    </div>
                    <button className="link" disabled={!hasNext} title="Next completed tasks" onClick={() => this.step(index + 1)}><i className="fas fa-chevron-right"></i></button>
                </div>
                <div className="header-side">
                    <button title="View current tasks" onClick={this.gotoActive}><i className="fas fa-times"></i></button>
                </div>
            </div>
            <div className="column is-full todos is-scrollable">
                <div className="column">
                    {todos.map((todo, i) => {
                        return <div key={i} className='column todo-container'>
                            <div className="separator"></div>
                            <Todo data={todo} readonly={true} />
                        </div>
                    })}
                </div>
            </div>
        </div>
    }
}