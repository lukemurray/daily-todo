import * as React from 'react'

export enum Key {
    Enter,
    CommandControl
}

interface Props {
    className: string
    children?: string
    editing: boolean
    onComplete: (data: {value: string, keys: Key[]}) => void
    onCancel: () => void
    value?: string
    onEditStart?: () => void
}

interface State {
    editing: boolean
    value: string
    hasMouse: boolean
    hasMeta: boolean
}

export default class InlineEdit extends React.Component<Props, State> {
    inputRef: React.RefObject<HTMLInputElement>;
    element: React.RefObject<HTMLDivElement>;
    constructor(props: Props) {
        super(props)

        this.state = {
            editing: props.editing,
            value: this.props.value ? this.props.value : '',
            hasMouse: false,
            hasMeta: false,
        }

        this.onClick = this.onClick.bind(this)
        this.complete = this.complete.bind(this)
        this.keyDown = this.keyDown.bind(this)
        this.keyUp = this.keyUp.bind(this)
        this.onMouseOver = this.onMouseOver.bind(this)
        this.onMouseDownDocument = this.onMouseDownDocument.bind(this)
        this.onMouseLeave = this.onMouseLeave.bind(this)

        this.inputRef = React.createRef()
        this.element = React.createRef()
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        if (this.inputRef.current && this.isEditing()) {
            this.inputRef.current.focus()
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.keyDown)
        document.addEventListener('keyup', this.keyUp)
        document.addEventListener('mousedown', this.onMouseDownDocument)
        if (this.element.current) {
            this.element.current.addEventListener('mouseover', this.onMouseOver)
            this.element.current.addEventListener('mouseleave', this.onMouseLeave)
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.keyDown)
        document.removeEventListener('keyup', this.keyUp)
        document.removeEventListener('mousedown', this.onMouseDownDocument)
        if (this.element.current) {
            this.element.current.removeEventListener('mouseover', this.onMouseOver)
            this.element.current.removeEventListener('mouseleave', this.onMouseLeave)
        }
    }

    private onMouseDownDocument() {
        if (!this.state.hasMouse) {
            this.cancel()
        }
    }

    private onMouseLeave() {
        this.setState({hasMouse: false})
    }

    private onMouseOver() {
        this.setState({hasMouse: true})
    }

    private keyDown(e: KeyboardEvent) {
        if (!this.isEditing())
            return
        if (e.key == "Meta") {
            this.setState({hasMeta: true})
        }
        if (e.keyCode == 13) {
            let keys = [Key.Enter]
            if (this.state.hasMeta) {
                keys.push(Key.CommandControl)
            }
            this.complete(keys)
        }
        else if (e.keyCode == 27) {
            this.cancel()
        }
    }
    private keyUp(e: KeyboardEvent) {
        if (!this.isEditing())
            return
        if (e.key == "Meta") {
            this.setState({hasMeta: false})
        }
    }

    private onClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation()
        if (this.state.editing)
            return
        this.setState({
            editing: !this.state.editing
        })
        if (this.props.onEditStart) {
            this.props.onEditStart()
        }
    }

    private complete(keys: Key[]) {
        const val = this.state.value
        this.setState({editing: false, value: ''})
        this.props.onComplete({value: val, keys: keys})
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
        return <div ref={this.element} className={this.props.className} onClick={this.onClick}>
            <div className="row is-full" style={{display: editing ? 'flex' : 'none'}}>
                <input ref={this.inputRef} className="row is-full" type="text" value={this.state.value} onChange={e => this.setState({value: e.target.value})} />
                <button onClick={e => this.complete([])}><i className="fas fa-plus"></i></button>
                <button onClick={e => this.cancel()}><i className="fas fa-times"></i></button>
            </div>
            <span style={{display: !editing ? 'block' : 'none'}}>{this.props.children}</span>
        </div>
    }
}