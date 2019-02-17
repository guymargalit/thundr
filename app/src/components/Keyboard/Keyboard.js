import React, { Component } from 'react';
import WebMidi from 'webmidi';
import './Keyboard.css';

const { ipcRenderer } = window.require('electron');

export default class Keyboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			packets: [],
			notes: [],
			sustain: false,
		};
	}

	connectMIDI() {
		WebMidi.enable(err => {
			if (!err) {
				if (WebMidi.inputs.length > 0) {
					let controller = WebMidi.inputs[0];
					controller.addListener('controlchange', 'all', e => {
						if (!this.props.is_playing) {
							if (e.value > 0) {
								this.setState({ sustain: true });
								this.sustainOn();
							} else {
								this.setState({ sustain: false });
								this.sustainOff();
							}
						}
					});
					controller.addListener('noteon', 'all', e => {
						if (!this.props.is_playing) {
							this.addNote({
								id: e.note.number,
								color: {
									hue: e.note.number % 12,
									saturation: 1 - 0.1 * (e.note.octave + 1),
									brightness: Math.min(Math.max(e.velocity, 0.3), 1),
									kelvin: 3500,
								},
								duration: e.timestamp,
								sustain: this.state.sustain,
							});
						}
					});

					controller.addListener('noteoff', 'all', e => {
						if (!this.props.is_playing) {
							this.removeNote(e.note.number);
						}
					});
				}
			}
		});
	}

	addNote = note => {
		let packets = this.state.packets;
		for (let i = 0; i < packets.length; i++) {
			if (packets[i].note_id === null) {
				packets[i].note_id = note.id;
				packets[i].color = note.color;
				packets[i].sustain = note.sustain;
				ipcRenderer.send('lifx-note', {
					id: packets[i].light_id,
					color: note.color,
				});
				break;
			}
		}
		this.setState({
			notes: [...this.state.notes, note],
			packets,
		});
	};

	removeNote = note => {
		let packets = this.state.packets;
		for (let i = 0; i < packets.length; i++) {
			if (packets[i].note_id === note) {
				packets[i].note_id = null;
				if (packets[i].sustain === false) {
					packets[i].color = {
						hue: 0,
						saturation: 0,
						brightness: 0,
						kelvin: 3500,
					};
					ipcRenderer.send('lifx-note', {
						id: packets[i].light_id,
						color: {
							hue: 0,
							saturation: 0,
							brightness: 0,
							kelvin: 3500,
						},
					});
				}
				break;
			}
		}
		this.setState({ notes: this.state.notes.filter(item => item.id !== note), packets });
	};

	sustainOn = () => {
		let packets = this.state.packets;
		for (let i = 0; i < packets.length; i++) {
			packets[i].sustain = true;
		}
		this.setState({ packets });
	};

	sustainOff = () => {
		let packets = this.state.packets;
		for (let i = 0; i < packets.length; i++) {
			packets[i].note_id = null;
			packets[i].color = {
				hue: 0,
				saturation: 0,
				brightness: 0,
				kelvin: 3500,
			};
			ipcRenderer.send('lifx-note', {
				id: packets[i].light_id,
				color: {
					hue: 0,
					saturation: 0,
					brightness: 0,
					kelvin: 3500,
				},
			});
		}
		this.setState({ packets });
	};

	render() {
		return (
			<div className="Keyboard">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 226 60"
					preserveAspectRatio="xMidYMid meet"
					width="455"
					height="119"
					id="piano"
				>
					<g>
						<rect rx="1" className="white c" data-note="c4" width="18" height="60" x="0" y="0" />
						<rect className="white d" data-note="d4" width="15" height="60" x="15" y="0" />
						<rect className="white e" data-note="e4" width="15" height="60" x="30" y="0" />
						<rect className="white f" data-note="f4" width="15" height="60" x="45" y="0" />
						<rect className="white g" data-note="g4" width="15" height="60" x="60" y="0" />
						<rect className="white a" data-note="a4" width="15" height="60" x="75" y="0" />
						<rect className="white b" data-note="b4" width="15" height="60" x="90" y="0" />
						<rect className="white c" data-note="c5" width="15" height="60" x="105" y="0" />
						<rect className="white d" data-note="d5" width="15" height="60" x="120" y="0" />
						<rect className="white e" data-note="e5" width="15" height="60" x="135" y="0" />
						<rect className="white f" data-note="f5" width="15" height="60" x="150" y="0" />
						<rect className="white g" data-note="g5" width="15" height="60" x="165" y="0" />
						<rect className="white a" data-note="a5" width="15" height="60" x="180" y="0" />
						<rect rx="1" className="white c" data-note="c6" width="16" height="60" x="210" y="0" />
						<rect className="white b" data-note="b5" width="16" height="60" x="195" y="0" />
						<rect className="black cs" data-note="cs4" width="8" height="40" x="11" y="0" />
						<rect className="black ds" data-note="ds4" width="8" height="40" x="26" y="0" />
						<rect className="black fs" data-note="fs4" width="8" height="40" x="56" y="0" />
						<rect className="black gs" data-note="gs4" width="8" height="40" x="71" y="0" />
						<rect className="black as" data-note="as4" width="8" height="40" x="86" y="0" />
						<rect className="black cs" data-note="cs5" width="8" height="40" x="116" y="0" />
						<rect className="black ds" data-note="ds5" width="8" height="40" x="131" y="0" />
						<rect className="black fs" data-note="fs5" width="8" height="40" x="161" y="0" />
						<rect className="black gs" data-note="gs5" width="8" height="40" x="176" y="0" />
						<rect className="black as" data-note="as5" width="8" height="40" x="191" y="0" />
					</g>
				</svg>
			</div>
		);
	}
}
