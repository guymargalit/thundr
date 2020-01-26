import React, { Component } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Dots } from 'react-activity';
import { MdRefresh } from 'react-icons/md';
import 'react-activity/dist/react-activity.css';
import './Layout.css';
import Item from './Item';

const getListStyle = isDraggingOver => ({
	background: isDraggingOver ? 'lightblue' : 'inherit',
	height: '100%',
	width: '100%',
	overflowY: 'auto',
	overflowX: 'hidden',
});

export default class List extends Component {
	constructor(props) {
		super(props);

		this.state = {
			key: {
				devices: [],
			},
		};
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.devices !== this.state.key.devices) {
			this.setState({ key: nextProps }, () => {});
		}
	}

	render() {
		return (
			<div className="List">
				{this.state.key.devices.length > 0 && !this.props.refresh ? (
					<>
						<div className="List-refresh no-select">
							<MdRefresh onClick={this.props.refreshList} size={26} />
						</div>
						<Droppable droppableId="dropAll">
							{(provided, snapshot) => (
								<div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
									{this.props.all.map((item, index) => (
										<Item key={item.ip} item={item} index={index} />
									))}
									<div style={{ width: '10em' }}> </div>
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</>
				) : this.props.refresh ? (
					<div className="List-refresh no-select">
						<MdRefresh onClick={this.props.refreshList} size={26} />
					</div>
				) : (
					<div className="List-loading no-select">
						<Dots color="#ffffff" size={20} speed={1} animating={true} />
					</div>
				)}
			</div>
		);
	}
}
