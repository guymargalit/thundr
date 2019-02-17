const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const isDev = require('electron-is-dev');
const Lifx = require('./lifx');

const { ipcMain } = electron;

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		titleBarStyle: 'hidden',
		minWidth: 600,
		minHeight: 400,
		width: 801,
		height: 534,
	});
	mainWindow.webContents.session.clearStorageData();
	mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
	mainWindow.on('closed', () => (mainWindow = null));
}

ipcMain.on('lifx-discover', () => {
	Lifx.discover(mainWindow);
});

ipcMain.on('lifx-color', (event, info) => {
	Lifx.color(info);
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});