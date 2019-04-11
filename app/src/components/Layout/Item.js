import React, { Component } from 'react';
import { MdLightbulbOutline } from 'react-icons/md';
import { Draggable } from 'react-beautiful-dnd';
import './Layout.css';

const getItemStyle = (isDragging, draggableStyle) => ({
	userSelect: 'none',
	margin: '1em',
	padding: '1em 1em 1em 0.5em',
	maxWidth: '20em',
	borderRadius: '0.3em',
	background: isDragging ? '#fea909' : 'inherit',
	...draggableStyle,
});

export default class Item extends Component {
	render() {
		return (
			<Draggable key={this.props.item.ip} draggableId={this.props.item.ip} index={this.props.index}>
				{(provided, snapshot) => (
					<div
						className="Item"
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
					>
						<MdLightbulbOutline size={26} className="icon" />
						<div className="Item-info">
							<div className="Item-title">
								{this.props.item.deviceInfo ? this.props.item.deviceInfo.label : null}
							</div>
							<div className="Item-desc">
								{this.props.item.deviceInfo ? this.props.item.deviceInfo.group.label : null}
							</div>
						</div>
					</div>
				)}
			</Draggable>
		);
	}
}
