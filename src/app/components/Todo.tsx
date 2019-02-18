import * as React from 'react'
import { TodoItem } from '../TodoManager';

interface Props {
    data: TodoItem
    className?: string
    onDoneToggle: (todo: TodoItem, done: boolean) => void
}

interface State {
    hover: boolean
}

export default class Todo extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            hover: false
        }
    }

    private onHover() {
        if (!this.state.hover) {
            this.setState({hover: true})
        }
    }

    private onHoverStop() {
        this.setState({hover: false})
    }

    render() {
        return <div className={`row todo ${this.props.className} ${this.props.data.done ? 'done' : ''}`} onMouseOver={() => this.onHover()} onMouseOutCapture={() => this.onHoverStop()} onClick={() => this.props.onDoneToggle(this.props.data, !this.props.data.done)}>
            <div className="handle">{this.state.hover ? '||' : ''}</div>
            <div className="row">
                {this.props.data.description}
            </div>
        </div>
    }
}