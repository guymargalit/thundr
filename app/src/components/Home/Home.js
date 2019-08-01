import React, { Component } from 'react';
import { Query } from 'react-apollo';
import Player from '../Player';
import './Home.css';
import Layout from '../Layout';
import Menu from '../Menu';
import View from '../View';
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
			refresh: false,
			keyboard: false,
			view: '',
		};
	}

	componentDidMount() {
		ipcRenderer.send('lifx-discover', '');
		ipcRenderer.on('lifx-new', (event, device) => {
			this.setState({
				devices: [...this.state.devices, device],
			});
		});
		ipcRenderer.on('lifx-none', () => {
			this.setState({ refresh: true });
		});

		let effects = JSON.parse(localStorage.getItem('effects')) || [
			{
				id: 0,
				title: 'All the Single Lights',
				active: true,
			},
			{
				id: 1,
				title: 'Everybody (yeah)',
				active: true,
			},
			{
				id: 2,
				title: 'Life in the Fade Lane',
				active: true,
			},
			{
				id: 3,
				title: 'Come Fade With Me',
				active: true,
			},
			{
				id: 4,
				title: 'Gimme! Gimme! Gimme! (All lights after three fades)',
				active: true,
			},
			{
				id: 5,
				title: 'Good Cop Bad Cop',
				active: true,
			},
			{
				id: 6,
				title: 'Flashing lights lights lights',
				active: true,
			},
			{
				id: 7,
				title: 'Hasta la vista, baby',
				active: true,
			},
			{
				id: 8,
				title: 'Saturday Night Seizure',
				active: true,
			},
			{
				id: 9,
				title: "Let's turn it on",
				active: true,
			},
			{
				id: 10,
				title: 'The bend and snap',
				active: true,
			},
			{
				id: 11,
				title: "That's the Way (I Light It)",
				active: true,
			},
			{
				id: 12,
				title: 'You Strobe Me Round (Like a Record)',
				active: true,
			},
			{
				id: 13,
				title: 'Hollywood Strobing',
				active: true,
			},
		];
		ipcRenderer.send('lifx-effect', effects);
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

	refreshList = () => {
		ipcRenderer.send('lifx-discover', '');
		this.setState({ refresh: false });
	};

	componentWillUnmount() {
		clearInterval(this.interval);
		clearInterval(this.timer);
	}

	render() {
		return (
			<div className="Home">
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
				<Menu
					toKeyboard={() => this.setState({ view: 'keyboard' })}
					toHome={() => this.setState({ view: '' })}
					toEffects={() => this.setState({ view: 'effects' })}
					view={this.state.view}
				/>
				<Layout
					refreshList={() => this.refreshList()}
					refresh={this.state.refresh}
					view={this.state.view}
					devices={this.state.devices}
				/>
				<View view={this.state.view} />
				{/* {this.state.keyboard ? <Keyboard /> : null} */}
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
