import React, { Component } from 'react';
import { MdHome, MdStraighten, MdSettings, MdTune } from 'react-icons/md';
import patreon from '../../assets/patreon.png';
import './Menu.css';

const { shell } = window.require('electron');

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
					</div>
					<div
						onClick={() => shell.openExternal('https://www.patreon.com/bePatron?u=16401129')}
						className="Menu-item-bottom"
					>
						<img src={patreon} width={150} alt="patreon" />
					</div>
				</div>
			</div>
		);
	}
}
