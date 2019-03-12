import React, { Component } from 'react';
import './Song.css';

export default class Song extends Component {
	render() {
		return (
			<div className="Song">
				<div className="Song-container">
					{this.props.current_track.album ? (
						<div
							className="Song-album"
							style={{
								backgroundImage: 'url(' + this.props.current_track.album.images[0].url + ')',
								backgroundSize: 'cover',
							}}
						/>
					) : null}
				</div>
				<div className="Song-info">
					<div className="Song-name">
						<span>{this.props.current_track.name}</span>
					</div>

					<div className="Song-artists">
						{this.props.current_track.artists ? (
							<span className="Song-artist">
								{this.props.current_track.artists
									.map(function(elem) {
										return elem.name;
									})
									.join(', ')}
							</span>
						) : null}
					</div>
				</div>
			</div>
		);
	}
}
