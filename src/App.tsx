import {CurrentTodos} from './views/CurrentTodos'
import '@fortawesome/fontawesome-free/scss/fontawesome.scss'
import '@fortawesome/fontawesome-free/scss/solid.scss'
import '@fortawesome/fontawesome-free/scss/regular.scss'
import './app.scss'
import {CompletedTodos} from './views/CompletedTodos';
import { MemoryRouter, Routes, Route } from 'react-router-dom'

export const App = () => {
    return <MemoryRouter>
        <Routes>
            <Route path="/" element={<CurrentTodos />} />
            <Route path="/:list/:completed" element={<CompletedTodos />} />
        </Routes>
    </MemoryRouter>
}
