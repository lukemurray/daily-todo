import { BrowserWindow } from "electron";

export default class MainWindow extends BrowserWindow {
    constructor() {
        super({ width: 370, height: 530 })
        console.log('loding', process.env.APP_URL)

        this.loadURL(process.env.APP_URL || `file://${__dirname}/../index.html`)
        this.setTitle('Daily Todo')
    }
}