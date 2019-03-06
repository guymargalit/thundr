require('dotenv/config');
var plan = require('flightplan');

var appName = 'thundr';
var username = 'deploy';
var startFile = 'src';

var tmpDir = appName + '-' + new Date().getTime();

// configuration

plan.target('production', [
	{
		host: process.env.FLIGHTPLAN_HOST,
		username: username,
		privateKey: process.env.FLIGHTPLAN_KEY,
		agent: process.env.SSH_AUTH_SOCK,
	},
]);

// run commands on localhost
plan.local(function(local) {
	local.log('Copy files to remote hosts');
	var filesToCopy = local.exec('git ls-files -o --exclude="node_modules" && git ls-files', { silent: true });
	// // rsync files to all the destination's hosts
	local.transfer(filesToCopy, '/tmp/' + tmpDir);
});

// run commands on remote hosts (destinations)
plan.remote(function(remote) {
	remote.log('Move folder to root');
	remote.sudo('cp -R /tmp/' + tmpDir + ' ~', { user: username });
	remote.rm('-rf /tmp/' + tmpDir);

	remote.log('Install dependencies');
	remote.sudo('npm --production --prefix ~/' + tmpDir + ' install ~/' + tmpDir, { user: username });

	remote.log('Reload application');
	remote.sudo('ln -snf ~/' + tmpDir + ' ~/' + appName, { user: username });
	remote.exec('forever stop ~/' + appName + '/' + startFile, { failsafe: true });
	remote.exec(
		'NODE_ENV=production CLIENT_ID=' +
			process.env.CLIENT_ID +
			' CLIENT_SECRET=' +
			process.env.CLIENT_SECRET +
			' REDIRECT_URI=' +
			process.env.REDIRECT_URI +
			' SERVER_SECRET=' +
			process.env.SERVER_SECRET +
			' ENDPOINT=' +
			process.env.ENDPOINT +
			' forever start ~/' +
			appName +
			'/' +
			startFile
	);
});
