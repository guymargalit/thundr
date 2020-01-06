import React, { Component } from 'react';
import './Experimental.css';
import patreon from '../../assets/patreon.png';

const { shell } = window.require('electron');

export default class Experimental extends Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (
			<div className="Experimental">
				<div className="Experimental-title">Support</div>
				<div className="Info">What up! I hope you're enjoying Thundr. <br/>If you have any issues, you can email <a href="mailto:help@thundr.io" target="_top">help@thundr.io</a>. These are ways to support me if you're into that kind of stuff.</div>

				<div className="Info"></div>

				<div className="Info">You can contribute on Patreon so I can keep making cool features: </div>

				<div
						onClick={() => shell.openExternal('https://www.patreon.com/bePatron?u=16401129')}
						className="Patreon-button"
					>
						<img src={patreon} width={150} alt="patreon" />
					</div>

				<div className="Info">Also, I make music so here's that: </div>

				<iframe className="Spotify-info" title="music" src="https://open.spotify.com/embed/artist/0FpRFbnLsMz9MedG5tl0xE" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
				
				<div className="Info">I'll be adding more features and the next step is a mobile app but yeah that's it for now!</div>

				<div className="Info">Guy Margalit</div>
			</div>
		);
	}
}
