import React, { Component } from 'react';
import './Login.css';

const { ipcRenderer } = window.require('electron');

export default class Login extends Component {
	componentDidMount() {
		ipcRenderer.on('token', (event, token) => {
			localStorage.setItem('AUTH_TOKEN', token);
			this.props.history.push(`/home`);
		});
	}

	login = () => {
		ipcRenderer.send('login', '');
	};

	render() {
		return (
			<div className="Login">
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
