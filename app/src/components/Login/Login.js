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
				<div className="Login-logo">
					<svg width="55" height="55" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 988.16 988.16">
						<defs />
						<title>thundr_4</title>
						<g id="Layer_8" class="cls-3" data-name="Layer 8">
							<circle cx="494.08" cy="494.08" r="494.08" />
						</g>
						<g id="Layer_6" data-name="Layer 6">
							<path
								class="cls-1"
								d="M669.35,592.14,675.82,441a5.64,5.64,0,0,0-10.46-2.94l-156,234.74a5.64,5.64,0,0,0,4.81,8.58h49.61a5.65,5.65,0,0,1,5.65,5.65L568.74,859a5.65,5.65,0,0,0,10.75,2.41L687.1,659.91a5.65,5.65,0,0,0-5.11-8l-34.3-1.78a5.65,5.65,0,0,0-4.78,2.66l-30,51.94a5.64,5.64,0,0,1-10.43-3V649a5.64,5.64,0,0,0-5.64-5.64H581.32a5.65,5.65,0,0,1-4.91-8.43l51.78-91.23a5.65,5.65,0,0,1,10.56,2.65l.91,68.15c.07,3,8-6.15,11.06-6.08l18.63-16.24h0"
								transform="translate(-138.17 -17.92)"
							/>
							<path
								class="cls-2"
								d="M510.49,604.25c-9.25,4.51-206.18,31.66-203.33-89.74,3.08-131.42,131.17-130.69,131.17-130.69s31.4-135,164.89-148.21c152.08-15,179.29,77.7,179.29,77.7s194.41-8.11,190.3,167.39c-3.65,155.49-263.08,137.2-295.29,134.91-7-.51-28.89-.19-27.88-7.18L655,501.36s-7.51,85,1.45,85.4c58.47,2.66,273.53-4.88,284.47-96.63,18.19-152.67-177.65-141-177.65-141s-21.31-86.29-145.65-72.79C480.69,291.16,459,422.26,459,422.26S339.5,410.7,343.89,514.58c3.76,89.11,173.71,55.19,176.67,63.16S519.73,599.74,510.49,604.25Z"
								transform="translate(-138.17 -17.92)"
							/>
						</g>
					</svg>
					<div className="Login-title">
						<h1 className="no-select">Thundr</h1>
					</div>
				</div>
				<div className="Login-section">
					<div onClick={() => this.login()} className="Login-button no-select">
						Get Started
					</div>
				</div>
			</div>
		);
	}
}
