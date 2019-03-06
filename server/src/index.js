require('dotenv/config');
const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const passport = require('passport');
const refresh = require('passport-oauth2-refresh');
const Strategy = require('passport-spotify').Strategy;
const cookieParser = require('cookie-parser');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const { getUserId, getTimeExpires } = require('./utils');

const resolvers = {
	Query,
};

const strategy = new Strategy(
	{
		clientID: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		callbackURL: process.env.NODE_ENV === 'production' ? process.env.REDIRECT_URI : process.env.DEBUG_URI,
	},
	(accessToken, refreshToken, expires_in, profile, done) => {
		process.nextTick(async () => {
			done(null, Object.assign({}, profile, { accessToken, refreshToken, expires_in }));
		});
	}
);

const db = new Prisma({
	typeDefs:
		process.env.NODE_ENV === 'production'
			? '/home/deploy/thundr/src/generated/prisma.graphql'
			: 'src/generated/prisma.graphql',
	endpoint: process.env.ENDPOINT,
});

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser(async (id, done) => {
	const user = await db.query.user({ where: { id } });
	done(null, user);
});

passport.use(strategy);
refresh.use(strategy);

const server = new GraphQLServer({
	typeDefs: process.env.NODE_ENV === 'production' ? '/home/deploy/thundr/src/schema.graphql' : './src/schema.graphql',
	resolvers,
	resolverValidationOptions: {
		requireResolversForResolveType: false,
	},
	context: async req => {
		const userId = await getUserId(req);
		const user = await db.query.user({ where: { id: userId } });
		let currentDate = new Date();

		if (parseInt(user.timeExpires) <= parseInt(moment(currentDate).valueOf())) {
			refresh.requestNewAccessToken('spotify', user.refreshToken, async (err, accessToken, refreshToken) => {
				await db.mutation.updateUser({
					data: {
						accessToken: accessToken,
						refreshToken: refreshToken,
						timeExpires: getTimeExpires(3600).toString(),
					},
					where: {
						id: userId,
					},
				});
			});
		}

		return {
			...req,
			db,
		};
	},
});

server.use(cookieParser());
server.use(passport.initialize());

server.use(
	'/login',
	passport.authenticate('spotify', {
		scope: ['user-read-playback-state', 'user-modify-playback-state'],
		session: false,
	})
);
server.use(
	'/callback',
	passport.authenticate('spotify', { failureRedirect: '/login', session: false }),
	async (req, res) => {
		let user = await db.query.user({ where: { spotifyId: req.user.id } }, `{ id }`);
		if (!user) {
			user = await db.mutation.createUser(
				{
					data: {
						name: req.user.displayName,
						spotifyId: req.user.id,
						accessToken: req.user.accessToken,
						refreshToken: req.user.refreshToken,
						timeExpires: getTimeExpires(3600),
					},
				},
				`{ id }`
			);
		}

		const token = jwt.sign({ userId: user.id }, process.env.SERVER_SECRET);
		res.redirect('file:///callback/#access_token=' + token);
	}
);

server.express.use(cookieParser());
server.express.use(passport.initialize());

server.start({ endpoint: '/graphql', playground: '/playground' }, () =>
	console.log(`Server is running on http://localhost:4000`)
);
