import React, { Component } from 'react';
import { MdExitToApp } from 'react-icons/md';
import { withRouter } from 'react-router';
import './Header.css';

class Header extends Component {
	render() {
		const authToken = localStorage.getItem('AUTH_TOKEN');
		return (
			<div className={authToken ? 'Header' : 'Header-login'}>
				<div />
				<div className="Header-block">
					{authToken ? (
						<div
							className="Header-signout"
							onClick={() => {
								localStorage.removeItem('AUTH_TOKEN');
								this.props.history.push(`/login`);
							}}
						>
							<MdExitToApp size={25} />
						</div>
					) : null}
				</div>
			</div>
		);
	}
}

export default withRouter(Header);
