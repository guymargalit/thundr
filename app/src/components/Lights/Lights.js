import React, { Component } from 'react';
import { MdLightbulbOutline } from 'react-icons/md';
import { Dots } from 'react-activity';
import 'react-activity/dist/react-activity.css';
import './Lights.css';

export default class Lights extends Component {
	constructor(props) {
		super(props);
		this.state = {
			devices: [
				{
					ip: 1,
					deviceInfo: {
						label: 'test',
					},
				},
				{
					ip: 2,
					deviceInfo: {
						label: 'test 2',
					},
				},
				{
					ip: 3,
					deviceInfo: {
						label: 'test 3',
					},
				},
				{
					ip: 4,
					deviceInfo: {
						label: 'test 4',
					},
				},
			],
		};
	}
	render() {
		return (
			<div className="Lights">
				<div className="Lights-container">
					{this.props.devices.length > 0 ? (
						this.props.devices.map(device => (
							<div key={device.ip} className="Light">
								<div className="Light-icon" style={{ color: '#6472a0' }}>
									<MdLightbulbOutline size={25} />
								</div>
								<div className="Light-name no-select">
									{device.deviceInfo ? device.deviceInfo.label : null}
								</div>
							</div>
						))
					) : (
						<div className="Lights-title no-select">
							<Dots color="#ffffff" size={20} speed={1} animating={true} />
						</div>
					)}
				</div>
			</div>
		);
	}
}
