import React, { Component } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import './Layout.css';
import List from './List';
import Grid from './Grid';
import Effects from '../Effects/Effects';

const { ipcRenderer } = window.require('electron');

const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
	return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
	const sourceClone = Array.from(source);
	const destClone = Array.from(destination);
	const [removed] = sourceClone.splice(droppableSource.index, 1);

	destClone.splice(droppableDestination.index, 0, removed);

	const result = {};
	result[droppableSource.droppableId] = sourceClone;
	result[droppableDestination.droppableId] = destClone;

	return result;
};

export default class Layout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			all: [],
			one: [],
			two: [],
			three: [],
			four: [],
			key: {
				devices: [],
			},
		};
	}

	id2List = {
		dropAll: 'all',
		dropOne: 'one',
		dropTwo: 'two',
		dropThree: 'three',
		dropFour: 'four',
	};

	getList = id => this.state[this.id2List[id]];

	componentWillReceiveProps(nextProps) {
		if (nextProps.devices !== this.state.key.devices) {
			this.setState({ key: nextProps }, () => {
				let all = this.state.key.devices;
				let one = JSON.parse(localStorage.getItem('one')) || [];
				let two = JSON.parse(localStorage.getItem('two')) || [];
				let three = JSON.parse(localStorage.getItem('three')) || [];
				let four = JSON.parse(localStorage.getItem('four')) || [];
				let ones = [];
				let twos = [];
				let threes = [];
				let fours = [];
				if (one) {
					one.forEach(item => {
						ones = ones.concat(all.filter(e => e.ip === item.ip));
						all = all.filter(e => e.ip !== item.ip);
					});
				}
				if (two) {
					two.forEach(item => {
						twos = twos.concat(all.filter(e => e.ip === item.ip));
						all = all.filter(e => e.ip !== item.ip);
					});
				}
				if (three) {
					three.forEach(item => {
						threes = threes.concat(all.filter(e => e.ip === item.ip));
						all = all.filter(e => e.ip !== item.ip);
					});
				}
				if (four) {
					four.forEach(item => {
						fours = fours.concat(all.filter(e => e.ip === item.ip));
						all = all.filter(e => e.ip !== item.ip);
					});
				}
				this.setState(
					{
						all: all,
						one: ones,
						two: twos,
						three: threes,
						four: fours,
					},
					() => {
						ipcRenderer.send('lifx-update', {
							one: this.state.one,
							two: this.state.two,
							three: this.state.three,
							four: this.state.four,
						});
					}
				);
			});
		}
	}

	onDragEnd = result => {
		const { source, destination } = result;
		if (!destination) {
			return;
		}
		if (source.droppableId === destination.droppableId) {
			const items = reorder(this.getList(source.droppableId), source.index, destination.index);
			let state = { items };

			if (source.droppableId === 'dropAll') {
				state = { all: items };
			}
			if (source.droppableId === 'dropOne') {
				state = { one: items };
			}
			if (source.droppableId === 'dropTwo') {
				state = { two: items };
			}
			if (source.droppableId === 'dropThree') {
				state = { three: items };
			}
			if (source.droppableId === 'dropFour') {
				state = { four: items };
			}
			this.setState(state);
		} else {
			const result = move(
				this.getList(source.droppableId),
				this.getList(destination.droppableId),
				source,
				destination
			);

			this.setState(
				{
					all: result.dropAll || this.state.all,
					one: result.dropOne || this.state.one,
					two: result.dropTwo || this.state.two,
					three: result.dropThree || this.state.three,
					four: result.dropFour || this.state.four,
				},
				() => {
					localStorage.setItem('all', JSON.stringify(this.state.all));
					localStorage.setItem('one', JSON.stringify(this.state.one));
					localStorage.setItem('two', JSON.stringify(this.state.two));
					localStorage.setItem('three', JSON.stringify(this.state.three));
					localStorage.setItem('four', JSON.stringify(this.state.four));
					ipcRenderer.send('lifx-update', {
						one: this.state.one,
						two: this.state.two,
						three: this.state.three,
						four: this.state.four,
					});
				}
			);
		}
	};

	render() {
		return (
			<div style={{ display: this.props.view === '' ? '' : 'none' }} className="Layout">
				<DragDropContext onDragEnd={this.onDragEnd}>
					<div className="Layout-grid">
						<Grid
							one={this.state.one}
							two={this.state.two}
							three={this.state.three}
							four={this.state.four}
						/>
						<Effects />
					</div>
					<List
						refresh={this.props.refresh}
						refreshList={this.props.refreshList}
						devices={this.state.key ? this.state.key.devices : []}
						all={this.state.all}
					/>
				</DragDropContext>
			</div>
		);
	}
}
