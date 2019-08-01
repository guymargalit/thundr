require('dotenv/config');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const isDev = require('electron-is-dev');
const Lifx = require('./lifx');

const { ipcMain } = electron;

let mainWindow, loginWindow;

app.commandLine.appendSwitch('disable-renderer-backgrounding');

function createWindow() {
	mainWindow = new BrowserWindow({
		titleBarStyle: 'hiddenInset',
		minWidth: 850,
		minHeight: 550,
		width: 850,
		height: 550,
		show: false,
	});
	mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
	mainWindow.on('closed', () => {
		Lifx.destroy();
		mainWindow = null;
	});
	mainWindow.webContents.on('did-finish-load', function() {
		mainWindow.show();
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
	loginWindow.webContents.session.clearStorageData();
	loginWindow.loadURL(isDev ? 'http://localhost:4000/login' : 'https://api.thundr.io/login');

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

ipcMain.on('lifx-update', (event, info) => {
	Lifx.update(info);
});

ipcMain.on('lifx-destroy', () => {
	Lifx.destroy();
});

ipcMain.on('lifx-effect', (event, info) => {
	Lifx.effect(info);
});

ipcMain.on('lifx-settings', (event, info) => {
	Lifx.setSettings(info);
});

ipcMain.on('lifx-color', (event, info) => {
	Lifx.color(info);
});

ipcMain.on('lifx-note', (event, info) => {
	Lifx.note(info);
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	app.quit();
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});
