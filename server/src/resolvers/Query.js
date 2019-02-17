const { getUserId } = require('../utils');

async function getAudioAnalysis(parent, args, context, info) {
	const userId = getUserId(context);
	const user = await context.db.query.user({ where: { id: userId } });
	const token = user.accessToken;
	const id = args.id;

	if (token) {
		let res = await fetch(`https://api.spotify.com/v1/audio-analysis/${id}`, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
		return await res.json();
	}
}

async function getCurrentTrack(parent, args, context, info) {
	const userId = getUserId(context);
	const user = await context.db.query.user({ where: { id: userId } });
	const token = user.accessToken;

	if (token) {
		let res = await fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
		if ((await res.status) === 204)
			return {
				is_playing: false,
				item: {
					duration_ms: 0,
				},
				progress_ms: 0,
				time_ms: 0,
			};
		return await res.json();
	}
}

async function seek(parent, args, context, info) {
	const userId = getUserId(context);
	const user = await context.db.query.user({ where: { id: userId } });
	const token = user.accessToken;
	const position_ms = args.position_ms.toString();

	if (token) {
		await fetch(`https://api.spotify.com/v1/me/player/pause`, {
			method: 'PUT',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		}).then(async () => {
			await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${position_ms}`, {
				method: 'PUT',
				headers: {
					Authorization: 'Bearer ' + token,
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
			});
		});
		return '200 OK';
	} else {
		return '204 NO CONTENT';
	}
}

async function play(parent, args, context, info) {
	const userId = getUserId(context);
	const user = await context.db.query.user({ where: { id: userId } });
	const token = user.accessToken;

	if (token) {
		await fetch(`https://api.spotify.com/v1/me/player/play`, {
			method: 'PUT',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
		return '200 OK';
	} else {
		return '204 NO CONTENT';
	}
}

module.exports = {
	getAudioAnalysis,
	getCurrentTrack,
	seek,
	play,
};
