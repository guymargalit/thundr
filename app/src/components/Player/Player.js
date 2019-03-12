import React, { Component } from 'react';
import './Player.css';
import moment from 'moment';
import Song from '../Song';
import Progress from '../Progress';

const { ipcRenderer } = window.require('electron');
let golden_ratio_conjugate = 0.618033988749895;
let h = Math.random();

export default class Player extends Component {
	constructor(props) {
		super(props);

		this.state = {
			bar: 0,
			beat: 0,
			sec: 0,
		};
	}

	updateLights(time_ms) {
		//Check if data exists
		if (this.props.data) {
			//Check if end of song
			this.updateIndex(time_ms);
		}
	}

	updateIndex(time_ms) {
		//Get index params
		let { beat, bar, sec } = this.state;

		//Update section index
		if (this.props.data.sections) {
			//If current time greater than section start
			if (time_ms <= this.props.duration_ms && sec <= this.props.data.sections.length - 1) {
				if (time_ms >= this.props.data.sections[sec].start * 1000 - 100) {
					sec++;
				}
			}
			if (time_ms === 0) {
				sec = 0;
			}
		}
		if (sec !== this.state.sec) {
			this.setState({ sec });
		}

		//Update bar index
		if (this.props.data.bars) {
			//If current time greater than section start
			if (time_ms <= this.props.duration_ms && bar <= this.props.data.bars.length - 1) {
				if (time_ms >= this.props.data.bars[bar].start * 1000 - 100) {
					bar++;
				}
			}
			if (time_ms === 0) {
				bar = 0;
			}
		}
		if (bar !== this.state.bar) {
			this.setState({ bar });
		}

		//Update beat index
		if (this.props.data.beats) {
			//If current time greater than beat start
			if (time_ms <= this.props.duration_ms && beat <= this.props.data.beats.length - 1) {
				if (time_ms >= this.props.data.beats[beat].start * 1000 - 100) {
					if (this.props.devices) {
						h += golden_ratio_conjugate;
						h %= 1;
						ipcRenderer.send('lifx-color', {
							section: sec,
							color: {
								hue: h,
								saturation: 1.0,
								brightness: 1.0,
								kelvin: 3500,
							},
							duration: Math.floor(this.props.data.beats[beat].duration * 1000),
						});
					}
					if (Math.floor(this.props.data.beats[beat].duration * 1000) < 400) {
						beat += 2;
					} else {
						beat++;
					}
				}
			}
			if (time_ms === 0) {
				beat = 0;
			}
		}
		if (beat !== this.state.beat) {
			this.setState({ beat });
		}
	}

	componentDidUpdate() {
		this.updateLights(this.props.time_ms);
	}

	render() {
		return (
			<div className="Player no-select">
				<div className="Player-info">
					<Song current_track={this.props.current_track} />
				</div>
				<div className="Player-controls">
					<div className="Player-slider-container">
						<div className="Player-slider-label">{moment(this.props.time_ms).format('m:ss')}</div>
						<Progress max={this.props.duration_ms} time={this.props.time_ms} />
						<div className="Player-slider-label">{moment(this.props.duration_ms).format('m:ss')}</div>
					</div>
				</div>
				<div className="Player-settings" />
			</div>
		);
	}
}
