import React, { Component } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Item from './Item';
import './Layout.css';

const getBoxStyle = isDraggingOver => ({
	flex: '1 1 33%',
	background: isDraggingOver ? '#ee82c3' : '#191a21',
	borderRadius: '0.3em',
	margin: '1em 1em 1em 1em',
	padding: '0.5em 0.5em 0.5em 0em',
	minWidth: '10em',
	height: 'calc(50% - 3em)',
	overflowY: 'auto',
	overflowX: 'hidden',
});

export default class Grid extends Component {
	render() {
		return (
			<div className="Grid">
				<Droppable droppableId="dropOne">
					{(provided, snapshot) => (
						<div ref={provided.innerRef} style={getBoxStyle(snapshot.isDraggingOver)}>
							{this.props.one.map((item, index) => (
								<Item key={item.ip} item={item} index={index} />
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
				<Droppable droppableId="dropTwo">
					{(provided, snapshot) => (
						<div ref={provided.innerRef} style={getBoxStyle(snapshot.isDraggingOver)}>
							{this.props.two.map((item, index) => (
								<Item key={item.ip} item={item} index={index} />
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
				<Droppable droppableId="dropThree">
					{(provided, snapshot) => (
						<div ref={provided.innerRef} style={getBoxStyle(snapshot.isDraggingOver)}>
							{this.props.three.map((item, index) => (
								<Item key={item.ip} item={item} index={index} />
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
				<Droppable droppableId="dropFour">
					{(provided, snapshot) => (
						<div ref={provided.innerRef} style={getBoxStyle(snapshot.isDraggingOver)}>
							{this.props.four.map((item, index) => (
								<Item key={item.ip} item={item} index={index} />
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</div>
		);
	}
}
