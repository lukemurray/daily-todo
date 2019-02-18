import * as fs from 'fs'

const FilePath = './todos.json';

export interface TodoItem {
    done?: Date
    description: string
}

export interface ITodoData {
    currentTodos: TodoItem[]
    previouslyDone?: {[key: string]: TodoItem[]}
}

class TodoData implements ITodoData {
    currentTodos: TodoItem[];
    previouslyDone?: { [key: string]: TodoItem[] };

    constructor() {
        this.currentTodos = []
        this.previouslyDone = {}
    }
}

export default class TodoManager {
    saveTodoData(data: ITodoData): void {
        fs.writeFileSync(FilePath, JSON.stringify(data))
    }
    getTodoData(): ITodoData {
        if (fs.existsSync(FilePath)) {
            let file = fs.readFileSync(FilePath, 'utf8')
            if (file) {
                let data: ITodoData = JSON.parse(file)
                return data
            }
        }
        return new TodoData()
    }
}
