import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { rpc, setActivity } from './rpc-client'

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1040,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    minWidth: 1040,
    maxWidth: 1040,
    minHeight: 670,
    icon: join(__dirname, '../../resources/icon.png'),
    /* frame: false, For Frameless Window*/
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  interface iActivity {
    title: string,
    vid: string,
    index: string,
    channel: string,
    thumbnail: string
  }

  // IPC test
  ipcMain.on('ping', (e, { title, channel, vid, thumbnail }: iActivity) => {
    if (e) {
      setActivity({
        details: title,
        state: channel,
        startTimestamp: new Date(),
        largeImageKey: thumbnail,
        largeImageText: 'Musix',
        smallImageKey: 'main-logo',
        smallImageText: 'Playing...',
        buttons: [
          {
            label: 'Listen',
            url: `https://www.youtube.com/watch?v=${ vid }`
          }
        ],
        instance: false,
      })
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  /* Rich Presence */
  rpc.on('ready', () => {
    setActivity({
      details: 'Browsing',
      state: 'Idling...',
      startTimestamp: new Date(),
      largeImageKey: 'main-logo',
      largeImageText: 'Musix',
      smallImageKey: 'music-disc',
      smallImageText: 'Playing...',
      instance: false,
    })
  });
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
// Set this to your Client ID.
