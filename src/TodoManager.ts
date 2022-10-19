import { exists, readTextFile, writeTextFile, BaseDirectory } from '@tauri-apps/api/fs';

export const FilePath = 'todos.json';

export enum TodoItemType {
    Todo,
    Section,
}

export interface TodoItem {
    done?: Date
    description: string
    type: TodoItemType
}

export interface ITodoListData {
    currentTodos: TodoItem[]
    previouslyDone?: {[key: string]: TodoItem[]}
}

export default class TodoManager {
    private filePath = './todos.json'

    constructor(filePath: string) {
        this.filePath = filePath
    }

    private async readFile(): Promise<string> {
        try {
            await exists(this.filePath, { dir: BaseDirectory.Home })
            const file = await readTextFile(this.filePath, { dir: BaseDirectory.Home })
            return file
        } catch (e) {
            await writeTextFile(this.filePath, '{}', { dir: BaseDirectory.Home })
            return '{}'
        }
    }

    public async saveTodoData(listName: string, data: ITodoListData): Promise<void> {
        var allData = null
        const file = await this.readFile()
        if (file) {
            allData = JSON.parse(file)
        }
        allData = Object.assign({}, allData)
        allData[listName] = data

        await writeTextFile(this.filePath, JSON.stringify(allData), { dir: BaseDirectory.Home })
    }

    public async getTodoData(listName:string): Promise<ITodoListData> {
        const file = await this.readFile()
        if (file) {
            let data: ITodoListData = JSON.parse(file)[listName]
            return data
        }
        throw new Error('No data file found')
    }

    public async getListNames(): Promise<string[]> {
        const file = await this.readFile()
        if (file) {
            let data = Object.keys(JSON.parse(file))
            return data
        }
        throw new Error('No data file found')
    }

    public async addTodoList(name: string) {
        const file = await this.readFile()
        if (file) {
            let data = JSON.parse(file)
            data[name] = {
                currentTodos: []
            } 
            await writeTextFile(this.filePath, JSON.stringify(data), { dir: BaseDirectory.Home })
        }
    }
}
