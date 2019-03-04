import React, { Component } from 'react';
import { Query } from 'react-apollo';
import Player from '../Player';
import './Home.css';
import Header from '../Header';
import Lights from '../Lights';
import Keyboard from '../Keyboard';

import { GET_AUDIO_ANALYSIS, GET_CURRENT_TRACK, PLAY, SEEK } from './constants';

const { ipcRenderer } = window.require('electron');

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			current_track: {
				progress_ms: 0,
				is_playing: false,
				item: {
					id: null,
					name: null,
					artists: null,
					album: null,
					duration_ms: 0,
				},
			},
			data: null,
			audio_analysis: false,
			time_ms: 0,
			poll_interval: 3000,
			devices: [],
		};
	}

	componentDidMount() {
		ipcRenderer.send('lifx-discover', '');
		ipcRenderer.on('lifx-new', (event, device) => {
			this.setState({
				devices: [...this.state.devices, device],
			});
		});
	}

	clearHandler = current => {
		if (!current) current = 0;
		clearInterval(this.timer);
		this.setState({ time_ms: current });
	};

	watchHandler = time => {
		if (time !== 0) time = this.state.time_ms;
		clearInterval(this.timer);
		const startTime = Date.now() - time;
		this.timer = setInterval(() => this.startTimer(startTime));
	};

	startTimer = startTime => {
		this.setState({ time_ms: Date.now() - startTime });
	};

	seekTrack = current_track => {
		this.props.client
			.query({
				query: SEEK,
				variables: { position_ms: 0 },
				fetchPolicy: 'network-only',
			})
			.then(() => {
				if (current_track.is_playing) {
					this.clearHandler();
					this.props.client
						.query({
							query: PLAY,
							fetchPolicy: 'network-only',
						})
						.then(() => {
							this.watchHandler(0);
						});
				} else {
					this.clearHandler();
				}
			});
	};

	updateCurrentTrack = data => {
		let current_track = data.getCurrentTrack;
		if (current_track.item && this.state.current_track.item) {
			// Check if same track is playing
			if (this.state.time_ms > current_track.item.duration_ms) {
				this.seekTrack(current_track);
			}
			// Check if track is playing
			if (current_track.is_playing !== this.state.current_track.is_playing) {
				this.seekTrack(current_track);
				this.setState({
					current_track: current_track,
				});
			}
			// Check if new track is playing
			if (current_track.item.id !== this.state.current_track.item.id) {
				this.seekTrack(current_track);
				this.setState({
					audio_analysis: true,
					current_track: current_track,
					poll_interval: 1500,
				});
			}
			// Poll more around 7 seconds
			if (
				current_track.progress_ms + 7000 > current_track.item.duration_ms &&
				this.state.poll_interval === 1500
			) {
				this.setState({
					poll_interval: 1000,
				});
			}
			// Poll even more around 1 second
			if (
				current_track.progress_ms + 1000 > current_track.item.duration_ms &&
				this.state.poll_interval === 1000
			) {
				this.setState({
					poll_interval: 200,
				});
			}
		}
	};

	updateAudioAnalysis = data => {
		this.setState({
			data: data.getAudioAnalysis,
			audio_analysis: false,
		});
	};

	componentWillUnmount() {
		clearInterval(this.interval);
		clearInterval(this.timer);
	}

	render() {
		return (
			<div className="Home">
				<Header />
				<Query
					query={GET_CURRENT_TRACK}
					onCompleted={data => this.updateCurrentTrack(data)}
					pollInterval={this.state.poll_interval}
					fetchPolicy={'network-only'}
				>
					{({ loading, error, data }) => {
						if (loading) return <div />;
						if (error) return <div />;

						return (
							<div>
								{this.state.audio_analysis ? (
									<Query
										query={GET_AUDIO_ANALYSIS}
										variables={{ id: data.getCurrentTrack.item.id }}
										onCompleted={data => this.updateAudioAnalysis(data)}
									>
										{({ loading, error, data }) => {
											if (loading) return <div />;
											if (error) return <div />;
											return <div />;
										}}
									</Query>
								) : null}
								<div />
							</div>
						);
					}}
				</Query>
				<Lights devices={this.state.devices} />
				<Player
					is_playing={this.state.current_track.is_playing}
					duration_ms={this.state.current_track.item.duration_ms}
					progress_ms={this.state.current_track.progress_ms}
					time_ms={this.state.time_ms}
					current_track={this.state.current_track.item}
					data={this.state.data}
					devices={this.state.devices}
				/>
			</div>
		);
	}
}
