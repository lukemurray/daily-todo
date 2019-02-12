import {app, Tray} from 'electron'
import MainWindow from './MainWindow';

function createWindow(tray: Tray) {
    let win: MainWindow | null = new MainWindow()

    win.on('closed', () => {
        win = null
    })
    return win
}

app.on('ready', () => {
    const tray = new Tray(process.env.APP_URL ? `${__dirname}/../src/icons/tray.png` : `${__dirname}/icons/tray.png`)
    const win = createWindow(tray)
    tray.on('click', (e) => {
        win.show()
    })
    tray.setToolTip('Show your todo list.')
})

app.on('window-all-closed', () => {
    app.quit()
})
