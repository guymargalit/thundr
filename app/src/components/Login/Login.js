import React, { Component } from 'react';
import logo from '../../assets/thundr.svg';
import './Login.css';
let win = null;

export default class Login extends Component {
	componentDidMount() {
		let hashParams = {};
		let e,
			r = /([^&;=]+)=?([^&;]*)/g,
			q = window.location.hash.substring(1);
		while ((e = r.exec(q))) {
			hashParams[e[1]] = decodeURIComponent(e[2]);
		}
		if (!hashParams.access_token) {
			window.location.href = 'http://localhost:4000/login';
		} else {
			localStorage.setItem('AUTH_TOKEN', hashParams.access_token);
			this.props.history.push(`/home`);
		}
	}

	// IN PROGRESS
	login = () => {
		const { BrowserWindow } = window.require('electron');

		win = new BrowserWindow({
			width: 600,
			height: 1000,
			webPreferences: {
				nodeIntegration: false,
			},
		});
		win.loadURL('http://localhost:4000/login');

		const {
			session: { webRequest },
		} = win.webContents;

		const filter = {
			urls: ['http://localhost:3000/callback'],
		};

		webRequest.onBeforeRequest(filter, async ({ url }) => {
			console.log(url);
			win = null;
		});
	};

	render() {
		return (
			<div className="Login">
				<img src={logo} alt="logo" className="Login-logo no-select" />
				<div className="Login-title">
					<h1 className="no-select">Thundr</h1>
				</div>
				<div onClick={() => this.login()} className="Login-button no-select">
					Get Started
				</div>
			</div>
		);
	}
}
