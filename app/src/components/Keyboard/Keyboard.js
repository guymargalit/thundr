import React, { Component } from 'react';
import WebMidi from 'webmidi';
import './Keyboard.css';

const { ipcRenderer } = window.require('electron');

export default class Keyboard extends Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			keyboard: false,
			notes: [],
			background: '#292b35',
		};
	}

	componentDidMount() {
		this._isMounted = true;
		this.connectMIDI();
	}

	componentWillUnmount() {
		this._isMounted = false;
		this.setState({ keyboard: false });
		WebMidi.disable();
	}

	connectMIDI() {
		WebMidi.enable(err => {
			if (!err) {
				if (WebMidi.inputs.length > 0) {
					let controller = WebMidi.inputs[0];
					this.setState({ keyboard: true });
					controller.addListener('controlchange', 'all', e => {});
					controller.addListener('noteon', 'all', e => {
						this.addNote(e.note.name);
						this.setBackground(e.note.name);
					});
					controller.addListener('noteoff', 'all', e => {
						this.removeNote(e.note.name);
					});
				}
			}
		});
	}

	setBackground = value => {
		let background = '#292b35';
		let color = 0;
		switch (value) {
			case 'C':
				background = '#eb4d4b';
				color = 0;
				break;
			case 'C#':
				background = '#fa8231';
				color = 35;
				break;
			case 'D':
				background = '#fed330';
				color = 60;
				break;
			case 'D#':
				background = '#20bf6b';
				color = 90;
				break;
			case 'E':
				background = '#26de81';
				color = 120;
				break;
			case 'F':
				background = '#0fb9b1';
				color = 150;
				break;
			case 'F#':
				background = '#2d98da';
				color = 180;
				break;
			case 'G':
				background = '#4b7bec';
				color = 210;
				break;
			case 'G#':
				background = '#3867d6';
				color = 240;
				break;
			case 'A':
				background = '#8854d0';
				color = 270;
				break;
			case 'A#':
				background = '#a55eea';
				color = 300;
				break;
			case 'B':
				background = '#ff7979';
				color = 330;
				break;
			default:
				break;
		}
		if (this._isMounted) {
			ipcRenderer.send('lifx-note', color);
			this.setState({ background: background });
		}
	};

	addNote = note => {
		let notes = this.state.notes;
		let index = notes.indexOf(note);
		if (index === -1) {
			notes.push(note);
		}
		if (this._isMounted) {
			this.setState(notes);
		}
	};

	removeNote = note => {
		let notes = this.state.notes;
		let index = notes.indexOf(note);
		if (index !== -1) {
			notes.splice(index, 1);
		}
		if (this._isMounted) {
			this.setState(notes);
		}
	};

	render() {
		return (
			<div style={{ background: this.state.background }} className="Keyboard">
				{/* {this.state.keyboard ? null : <div className="Keyboard-title">Connect MIDI</div>} */}
				<div className="Keyboard-image">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 113 60"
						preserveAspectRatio="xMidYMid"
						width="546"
						height="143"
						id="piano"
					>
						{/* <g filter={this.state.keyboard ? '' : 'url(#grayscale)'}> */}
						<g>
							<rect rx="1" className="white c" data-note="c4" width="18" height="60" x="0" y="0" />
							<rect className="white d" data-note="d4" width="15" height="60" x="15" y="0" />
							<rect className="white e" data-note="e4" width="15" height="60" x="30" y="0" />
							<rect className="white f" data-note="f4" width="15" height="60" x="45" y="0" />
							<rect className="white g" data-note="g4" width="15" height="60" x="60" y="0" />
							<rect className="white a" data-note="a4" width="15" height="60" x="75" y="0" />
							<rect rx="1" className="white b" data-note="b4" width="15" height="60" x="90" y="0" />
							<rect className="black cs" data-note="cs4" width="8" height="40" x="11" y="0" />
							<rect className="black ds" data-note="ds4" width="8" height="40" x="26" y="0" />
							<rect className="black fs" data-note="fs4" width="8" height="40" x="56" y="0" />
							<rect className="black gs" data-note="gs4" width="8" height="40" x="71" y="0" />
							<rect className="black as" data-note="as4" width="8" height="40" x="86" y="0" />
						</g>
						<filter id="grayscale">
							<feColorMatrix type="saturate" values="0" />
						</filter>
					</svg>
				</div>
			</div>
		);
	}
}
