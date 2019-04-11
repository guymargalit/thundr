import React, { Component } from 'react';
import { Twemoji } from 'react-emoji-render';
import ReactTooltip from 'react-tooltip';
import './Effects.css';

const { ipcRenderer } = window.require('electron');

export default class Effects extends Component {
	constructor(props) {
		super(props);

		this.state = {
			solid: true,
			all: true,
			fade: true,
			flash: true,
			effects: [0, 1, 2, 3],
		};
	}

	componentDidMount() {
		ipcRenderer.send('lifx-effect', this.state.effects);
	}

	updateEffects = (effect, item) => {
		let effects = this.state.effects;
		let index = effects.indexOf(item);
		index === -1 ? effects.push(item) : effects.splice(index, 1);
		this.setState(effect);
		this.setState({ effects: effects });
		ipcRenderer.send('lifx-effect', effects);
	};

	render() {
		return (
			<div className="Effects">
				<ReactTooltip effect="solid" />
				<div
					data-tip="Toggle Solid"
					onClick={() => this.updateEffects({ solid: !this.state.solid }, 0)}
					className={this.state.solid ? 'Effects-box--active' : 'Effects-box'}
				>
					<Twemoji svg text="💡" />
				</div>
				<div
					data-tip="Toggle All"
					onClick={() => this.updateEffects({ all: !this.state.all }, 1)}
					className={this.state.all ? 'Effects-box--active' : 'Effects-box'}
				>
					<Twemoji svg text="☀️" />
				</div>
				<div
					data-tip="Toggle Fade"
					onClick={() => this.updateEffects({ fade: !this.state.fade }, 2)}
					className={this.state.fade ? 'Effects-box--active' : 'Effects-box'}
				>
					<Twemoji svg text="🕯️" />
				</div>
				<div
					data-tip="Toggle Flash"
					onClick={() => this.updateEffects({ flash: !this.state.flash }, 3)}
					className={this.state.flash ? 'Effects-box--active' : 'Effects-box'}
				>
					<Twemoji svg text="⚡" />
				</div>
			</div>
		);
	}
}
