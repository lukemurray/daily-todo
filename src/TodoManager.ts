import { exists, readTextFile, writeTextFile, BaseDirectory } from '@tauri-apps/api/fs';
import { v4 as uuidv4 } from 'uuid';

export const FilePath = 'todos.json';
export const CURRENT_FILE_VERSION = 2;

export enum TodoItemType {
    Todo,
    Section,
}

export interface TodoItem {
    id: string
    done?: Date
    description: string
    type: TodoItemType
}

export interface ITodoListData {
    __version: number
    currentTodos: TodoItem[]
    previouslyDone?: {[key: string]: TodoItem[]}
}

interface ITodoFileV2 {
    __version: number
    lists: { [key: string]: ITodoListData }
}

interface ITodoFileV1 {
    [key: string]: ITodoListData
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
        let allData: ITodoFileV2 | null = null
        const file = await this.readFile()
        if (file) {
            allData = JSON.parse(file)
        }
        allData = Object.assign({}, allData)
        allData.lists[listName] = data

        await writeTextFile(this.filePath, JSON.stringify(allData), { dir: BaseDirectory.Home })
    }

    public async getTodoData(listName:string): Promise<ITodoListData> {
        const file = await this.readFile()
        if (file) {
            let jsonv2 = JSON.parse(file) as ITodoFileV2
            if (!jsonv2.__version || jsonv2.__version < 2) {
                // Upgrade to version 2
                jsonv2 = await this.upgradeToFileV2(jsonv2);
            }

            let data: ITodoListData = jsonv2.lists[listName]
            return data
        }
        throw new Error('No data file found')
    }

    private async upgradeToFileV2(jsonv2: ITodoFileV2): Promise<ITodoFileV2> {
        console.log('Upgrading file to version 2...');
        const newJson: ITodoFileV2 = {
            __version: CURRENT_FILE_VERSION,
            lists: {}
        };

        const jsonv1 = jsonv2 as any as ITodoFileV1;

        for (const listName in jsonv1) {
            const list = jsonv1[listName];
            this.fillOldIdsForV2(list);
            newJson.lists[listName] = list;
        }
        await writeTextFile(this.filePath, JSON.stringify(newJson), { dir: BaseDirectory.Home });
        console.log('File upgraded to version 2');
        jsonv2 = newJson;
        return jsonv2;
    }

    private fillOldIdsForV2(data: ITodoListData) {
        for (const key in data.previouslyDone) {
            if (data.previouslyDone.hasOwnProperty(key)) {
                const element = data.previouslyDone[key];
                element.forEach(item => {
                    if (!item.id) {
                        item.id = uuidv4()
                    }
                })
            }
        }
        for (const item of data.currentTodos) {
            if (!item.id) {
                item.id = uuidv4()
            }
        }
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
