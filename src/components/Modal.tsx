import React from "react";

interface Props {
    onCancel: () => void
    onOk: () => void
    children: React.ReactNode
    okText?: string
    noText?: string
}

export default class Modal extends React.Component<Props> {
    okRef: React.RefObject<HTMLButtonElement>;

    constructor(props: Props) {
        super(props)

        this.onKeyPress = this.onKeyPress.bind(this)

        this.okRef = React.createRef()
    }

    componentDidMount() {
        document.addEventListener('keyup', this.onKeyPress)
        this.okRef.current!.focus()
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.onKeyPress)
    }

    private onKeyPress(event: KeyboardEvent) {
        if (event.code == 'Escape') {
            this.props.onCancel()
        }
    }

    render() {
        return <div className="column modal">
            <div className="background"></div>
            <div className="content">
                {this.props.children}
                <div className="buttons">
                    <button ref={this.okRef} onClick={this.props.onOk}>{this.props.okText ?? 'Yes'}</button>
                    <button onClick={this.props.onCancel}>{this.props.noText ?? 'No'}</button>
                </div>
            </div>
        </div>
    }
}