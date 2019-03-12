import React, { Component } from 'react';
import './Header.css';

export default class Header extends Component {
	render() {
		return (
			<div className="Header">
				<div className="Header-keyboard" />
				<div className="Header-lights" />
			</div>
		);
	}
}
