import * as fs from 'fs'

const FilePath = './todos.json';

export interface TodoItem {
    done?: Date
    description: string
}

export interface ITodoListData {
    currentTodos: TodoItem[]
    previouslyDone?: {[key: string]: TodoItem[]}
}

class TodoListData implements ITodoListData {
    currentTodos: TodoItem[];
    previouslyDone?: { [key: string]: TodoItem[] };

    constructor() {
        this.currentTodos = []
        this.previouslyDone = {}
    }
}

export default class TodoManager {
    public saveTodoData(listName:string, data: ITodoListData): void {
        var allData = null
        if (fs.existsSync(FilePath)) {
            let file = fs.readFileSync(FilePath, 'utf8')
            if (file) {
                allData = JSON.parse(file)
            }
        }
        allData = Object.assign({}, allData)
        allData[listName] = data

        fs.writeFileSync(FilePath, JSON.stringify(allData))
    }

    public getTodoData(listName:string): ITodoListData {
        if (fs.existsSync(FilePath)) {
            let file = fs.readFileSync(FilePath, 'utf8')
            if (file) {
                let data: ITodoListData = JSON.parse(file)[listName]
                return data
            }
        }
        return new TodoListData()
    }

    public getListNames(): string[] {
        if (fs.existsSync(FilePath)) {
            let file = fs.readFileSync(FilePath, 'utf8')
            if (file) {
                let data = Object.keys(JSON.parse(file))
                return data
            }
        }
        return []
    }
}
