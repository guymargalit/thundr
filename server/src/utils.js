const jwt = require('jsonwebtoken');
const moment = require('moment');

function getUserId(context) {
	const Authorization = context.request.get('Authorization');
	if (Authorization) {
		const token = Authorization.replace('Bearer ', '');
		const { userId } = jwt.verify(token, process.env.SERVER_SECRET);
		return userId;
	}

	throw new Error('Not authenticated');
}

function getTimeExpires(expires_in) {
	let currentDate = new Date();
	return moment(currentDate)
		.add(expires_in * 0.9, 's')
		.valueOf();
}

module.exports = {
	getUserId,
	getTimeExpires,
};
