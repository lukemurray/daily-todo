import {app, Tray} from 'electron'
import MainWindow from './MainWindow';

let window: MainWindow | null = null
let tray: Tray | null = null

function createWindow(tray: Tray) {
    let win: MainWindow | null = new MainWindow()

    win.on('closed', () => {
        win = null
    })
    return win
}

app.on('ready', () => {
    tray = new Tray(process.env.APP_URL ? `${__dirname}/../src/icons/trayTemplate.png` : `${__dirname}/icons/trayTemplate.png`)
    window = createWindow(tray)
    tray.on('click', (e) => {
        window!.show()
    })
    tray.setToolTip('Show your todo list.')
})

app.on('window-all-closed', () => {
    app.quit()
})
