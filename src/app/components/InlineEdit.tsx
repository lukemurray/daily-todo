import * as React from 'react'

interface Props {
    className: string
    children: string
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
            editing: false,
            value: ''
        }

        this.onClick = this.onClick.bind(this)
        this.inputRef = React.createRef()
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        if (this.inputRef.current && !prevState.editing && this.state.editing) {
            this.inputRef.current.focus()
        }
    }

    onClick() {
        if (this.state.editing)
            return

        this.setState({
            editing: !this.state.editing
        })
    }

    render() {
        return <div className={this.props.className} onClick={this.onClick}>
            <div className="row is-full" style={{display: this.state.editing ? 'flex' : 'none'}}>
                <input ref={this.inputRef} className="row is-full" type="text" value={this.state.value} onChange={e => this.setState({value: e.target.value})} />
                <button>+</button>
                <button>x</button>
            </div>
            <span style={{display: !this.state.editing ? 'block' : 'none'}}>{this.props.children}</span>
        </div>
    }
}