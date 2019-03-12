require('dotenv/config');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const isDev = require('electron-is-dev');
const Lifx = require('./lifxlan');

const { ipcMain } = electron;

let mainWindow, loginWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		titleBarStyle: 'hidden',
		minWidth: 600,
		minHeight: 400,
		width: 600,
		height: 400,
	});
	// mainWindow.webContents.session.clearStorageData();
	mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
	mainWindow.on('closed', () => {
		Lifx.destroy();
		mainWindow = null;
	});
}

ipcMain.on('login', () => {
	loginWindow = new BrowserWindow({
		width: 400,
		height: 800,
		webPreferences: {
			nodeIntegration: false,
		},
	});
	loginWindow.loadURL(isDev ? 'http://localhost:4000/login' : process.env.SERVER);

	const {
		session: { webRequest },
	} = loginWindow.webContents;

	const filter = {
		urls: ['file:///callback*'],
	};

	webRequest.onBeforeRequest(filter, async ({ url }) => {
		let result = url.split('=');
		if (result.length > 1) {
			mainWindow.webContents.send('token', result[1]);
		}
		if (!loginWindow) return;
		loginWindow.close();
		loginWindow = null;
	});

	loginWindow.on('closed', () => (loginWindow = null));
});

ipcMain.on('lifx-discover', () => {
	Lifx.discover(mainWindow);
});

ipcMain.on('lifx-destroy', () => {
	Lifx.destroy();
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
