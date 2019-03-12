import gql from 'graphql-tag';

export const GET_AUDIO_ANALYSIS = gql`
	query getAudioAnalysis($id: String) {
		getAudioAnalysis(id: $id) {
			bars {
				start
				duration
			}
			beats {
				start
				duration
			}
			sections {
				start
				duration
				loudness
				key
				mode
				tempo
				time_signature
			}
			segments {
				start
				duration
				loudness_start
				loudness_max
				loudness_max_time
				loudness_end
				pitches
				timbre
			}
		}
	}
`;

export const GET_CURRENT_TRACK = gql`
	{
		getCurrentTrack {
			progress_ms
			is_playing
			item {
				id
				name
				artists {
					id
					name
				}
				album {
					images {
						width
						height
						url
					}
				}
				duration_ms
			}
		}
	}
`;

export const SEEK = gql`
	query seek($position_ms: Int) {
		seek(position_ms: $position_ms)
	}
`;

export const PLAY = gql`
	query play {
		play
	}
`;
