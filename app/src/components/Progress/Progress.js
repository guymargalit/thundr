import React, { Component } from 'react';
import './Progress.css';

export default class Progress extends Component {
	render() {
		return (
			<div className="Progress">
				<div className="Progress-container">
					<div className="Progress-fill" style={{ width: (this.props.time / this.props.max) * 100 + '%' }} />
				</div>
			</div>
		);
	}
}
