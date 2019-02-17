import React, { Component } from 'react';
import { MdLightbulbOutline } from 'react-icons/md';
import { Dots } from 'react-activity';
import 'react-activity/dist/react-activity.css';
import './Lights.css';

export default class Lights extends Component {
	render() {
		return (
			<div className="Lights">
				<div className="Lights-container">
					{this.props.devices.length > 0 ? (
						this.props.devices.map(device => (
							<div key={device.ip} className="Light">
								<div className="Light-icon" style={{ backgroundColor: '#fff' }}>
									<MdLightbulbOutline size={30} />
									<div className="Light-name no-select">{device.deviceInfo.label}</div>
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
