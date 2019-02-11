import { BrowserWindow } from "electron";

export default class MainWindow extends BrowserWindow {
    constructor() {
        super({ width: 330, height: 500 })

        this.loadURL(process.env.APP_URL || `file://${__dirname}/../index.html`)
        this.setTitle('Daily Todo')
    }
}