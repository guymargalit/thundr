import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Item from './Item';
import './Effects.css';
import Select from 'react-select';
import chroma from 'chroma-js';
const { ipcRenderer } = window.require('electron');

export default class Effects extends Component {
	constructor(props) {
		super(props);

		this.state = {
			effects: [],
			settings: {
				brightness: 100,
				changeBrightness: false,
			},
		};
	}

	componentDidMount() {
		let settings = JSON.parse(localStorage.getItem('settings')) || {
			brightness: 100,
			changeBrightness: false,
		};
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
		this.setState({ effects: effects, settings: settings });
		ipcRenderer.send('lifx-effect', effects);
		ipcRenderer.send('lifx-settings', settings);
	}

	onUpdateItem = i => {
		this.setState(state => {
			const effects = state.effects.map((item, j) => {
				if (j === i) {
					item.active = !item.active;
					return item;
				} else {
					return item;
				}
			});

			localStorage.setItem('effects', JSON.stringify(effects));
			ipcRenderer.send('lifx-effect', effects);

			return {
				effects,
			};
		});
	};

	onPreviewItem = i => {
		ipcRenderer.send('lifx-preview', { effect: i });
	};

	handleChange = e => {
		let settings = this.state.settings;
		settings.brightness = e.target.value;
		this.setState({ settings: settings });
		localStorage.setItem('settings', JSON.stringify(settings));
		ipcRenderer.send('lifx-settings', settings);
	};

	render() {
		const colourOptions = [
			{ value: 'blue', label: 'Blue', color: '#0052CC' },
			{ value: 'purple', label: 'Purple', color: '#5243AA' },
			{ value: 'red', label: 'Red', color: '#FF3630' },
			{ value: 'orange', label: 'Orange', color: '#FF8B00' },
			{ value: 'yellow', label: 'Yellow', color: '#FFC400' },
			{ value: 'green', label: 'Green', color: '#36B37E' },
		];

		const colourStyles = {
			control: styles => ({ ...styles, backgroundColor: 'white' }),
			option: (styles, { data, isDisabled, isFocused, isSelected }) => {
				const color = chroma(data.color);
				return {
					...styles,
					backgroundColor: isDisabled
						? null
						: isSelected
						? data.color
						: isFocused
						? color.alpha(0.1).css()
						: null,
					color: isDisabled
						? '#ccc'
						: isSelected
						? chroma.contrast(color, 'white') > 2
							? 'white'
							: 'black'
						: data.color,
					cursor: isDisabled ? 'not-allowed' : 'default',

					':active': {
						...styles[':active'],
						backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
					},
				};
			},
			multiValue: (styles, { data }) => {
				const color = chroma(data.color);
				return {
					...styles,
					backgroundColor: color.alpha(0.1).css(),
				};
			},
			multiValueLabel: (styles, { data }) => ({
				...styles,
				color: data.color,
			}),
			multiValueRemove: (styles, { data }) => ({
				...styles,
				color: data.color,
				':hover': {
					backgroundColor: data.color,
					color: 'white',
				},
			}),
		};

		return (
			<div className="Effects">
				<div className="Effects-title">Effects</div>
				<div className="Effects-settings">
					<div className="Effects-settings-container">
						Max Brightness: {this.state.settings.brightness}
						<input
							id="typeinp"
							type="range"
							name="brightness"
							className="Effects-settings-slider"
							min={0}
							max={100}
							value={this.state.settings.brightness}
							onChange={this.handleChange}
							step={1}
						/>
					</div>
					<div className="Effects-settings-container">
						<Select
							closeMenuOnSelect={false}
							defaultValue={colourOptions}
							isMulti
							options={colourOptions}
							styles={colourStyles}
						/>
					</div>
				</div>
				<div className="Effects-list">
					<Scrollbars>
						{this.state.effects.map(effect => (
							<Item
								key={effect.id}
								pressItem={() => this.onUpdateItem(effect.id)}
								previewItem={() => this.onPreviewItem(effect.id)}
								title={effect.title}
								active={effect.active}
							/>
						))}
					</Scrollbars>
				</div>
			</div>
		);
	}
}
