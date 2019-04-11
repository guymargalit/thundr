import React, { Component } from 'react';
import { MdHome, MdStraighten } from 'react-icons/md';
import './Menu.css';

export default class Menu extends Component {
	render() {
		return (
			<div className="Menu">
				<div className="Menu-list">
					<div
						onClick={this.props.toHome}
						className={this.props.keyboard ? 'Menu-item' : 'Menu-item--active'}
					>
						<div className="Menu-icon">
							<MdHome size={25} />
						</div>
						<div className="Menu-title">Home</div>
					</div>
					<div
						onClick={this.props.toKeyboard}
						className={this.props.keyboard ? 'Menu-item--active' : 'Menu-item'}
					>
						<div className="Menu-icon">
							<MdStraighten size={25} />
						</div>
						<div className="Menu-title">Keyboard</div>
					</div>
				</div>
			</div>
		);
	}
}
