import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {MemoryRouter as Router, Switch, Route} from 'react-router-dom'
import CurrentTodos from './views/CurrentTodos'

import './app.scss'


export default class App extends React.Component {
    render() {
        return <Router>
            <Switch>
                <Route path="/" exact component={CurrentTodos} />
            </Switch>
        </Router>
    }
}

ReactDOM.render(<App />, document.getElementById('appContent'))