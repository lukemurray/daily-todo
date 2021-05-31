import * as fs from 'fs'

export const FilePath = './todos.json';

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
    private filePath = './todos.json'

    constructor(filePath: string) {
        this.filePath = filePath
    }

    public saveTodoData(listName: string, data: ITodoListData): void {
        var allData = null
        if (fs.existsSync(this.filePath)) {
            let file = fs.readFileSync(this.filePath, 'utf8')
            if (file) {
                allData = JSON.parse(file)
            }
        }
        allData = Object.assign({}, allData)
        allData[listName] = data

        fs.writeFileSync(this.filePath, JSON.stringify(allData))
    }

    public getTodoData(listName:string): ITodoListData {
        if (fs.existsSync(this.filePath)) {
            let file = fs.readFileSync(this.filePath, 'utf8')
            if (file) {
                let data: ITodoListData = JSON.parse(file)[listName]
                return data
            }
        }
        return new TodoListData()
    }

    public getListNames(): string[] {
        if (fs.existsSync(this.filePath)) {
            let file = fs.readFileSync(this.filePath, 'utf8')
            if (file) {
                let data = Object.keys(JSON.parse(file))
                return data
            }
        }
        return []
    }
}
