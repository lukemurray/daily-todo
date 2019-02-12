import {app} from 'electron'
import MainWindow from './MainWindow';

function createWindow() {
    let win: MainWindow | null = new MainWindow()

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    app.quit()
})
