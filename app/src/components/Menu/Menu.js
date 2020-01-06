import React, { Component } from 'react';
import { MdHome, MdStraighten, MdTune, MdAccessibility } from 'react-icons/md';
import './Menu.css';

export default class Menu extends Component {
	render() {
		return (
			<div className="Menu">
				<div className="Menu-list">
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<div
							onClick={this.props.toHome}
							className={this.props.view === '' ? 'Menu-item--active' : 'Menu-item'}
						>
							<div className="Menu-icon">
								<MdHome size={25} />
							</div>
							<div className="Menu-title">Home</div>
						</div>

						<div
							onClick={this.props.toEffects}
							className={this.props.view === 'effects' ? 'Menu-item--active' : 'Menu-item'}
						>
							<div className="Menu-icon">
								<MdTune size={25} />
							</div>
							<div className="Menu-title">Effects</div>
						</div>
						<div
							onClick={this.props.toKeyboard}
							className={this.props.view === 'keyboard' ? 'Menu-item--active' : 'Menu-item'}
						>
							<div className="Menu-icon">
								<MdStraighten size={25} />
							</div>
							<div className="Menu-title">Keyboard</div>
						</div>
						<div
							onClick={this.props.toExperimental}
							className={this.props.view === 'experimental' ? 'Menu-item--active' : 'Menu-item'}
						>
							<div className="Menu-icon">
								<MdAccessibility size={25} />
							</div>
							<div className="Menu-title">Support</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
