import * as React from 'react'

interface Props {
    className: string
    children: string
    editing: boolean
    onComplete: (data: {value: string, wasEnter: boolean}) => void
    onCancel: () => void
}

interface State {
    editing: boolean
    value: string
}

export default class InlineEdit extends React.Component<Props, State> {
    inputRef: React.RefObject<HTMLInputElement>;
    constructor(props: Props) {
        super(props)

        this.state = {
            editing: props.editing,
            value: '',
        }

        this.onClick = this.onClick.bind(this)
        this.complete = this.complete.bind(this)
        this.keyDown = this.keyDown.bind(this)

        this.inputRef = React.createRef()
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        if (this.inputRef.current && this.isEditing()) {
            this.inputRef.current.focus()
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.keyDown)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.keyDown)
    }

    private keyDown(e: KeyboardEvent) {
        if (!this.isEditing())
            return

        if (e.keyCode == 13) {
            this.complete(true)
        }
        else if (e.keyCode == 27) {
            this.cancel()
        }
    }

    private onClick() {
        if (this.state.editing)
            return
        this.setState({
            editing: !this.state.editing
        })
    }

    private complete(wasEnter: boolean) {
        this.props.onComplete({value: this.state.value, wasEnter: wasEnter})
        this.setState({editing: false, value: ''})
    }

    private cancel() {
        this.setState({editing: false, value: ''})
        this.props.onCancel()
    }

    private isEditing() {
        return this.state.editing || this.props.editing
    }

    render() {
        const editing = this.isEditing();
        return <div className={this.props.className} onClick={this.onClick}>
            <div className="row is-full" style={{display: editing ? 'flex' : 'none'}}>
                <input ref={this.inputRef} className="row is-full" type="text" value={this.state.value} onChange={e => this.setState({value: e.target.value})} />
                <button onClick={e => this.complete(false)}>+</button>
                <button onClick={e => this.cancel()}>x</button>
            </div>
            <span style={{display: !editing ? 'block' : 'none'}}>{this.props.children}</span>
        </div>
    }
}