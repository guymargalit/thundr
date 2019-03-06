const Lifx = require('./node-lifx-lan');

let devices = [];
let i = 0;
let section = 0;
let effect = 0;

function discover(window) {
	Lifx.discover()
		.then(device_list => {
			if (device_list.length > 0) {
				return device_list.forEach(device => {
					devices.push(device);
					window.webContents.send('lifx-new', device);

					device.turnOn({
						color: {
							hue: 0,
							saturation: 0,
							brightness: 1.0,
							kelvin: 3500,
						},
						duration: 0.0,
					});
				});
			}
		})
		.catch(error => {
			console.error(error);
		});
}

function destroy() {
	Lifx.destroy()
		.then(() => {
			console.log('Bye!');
		})
		.catch(error => {
			console.error();
		});
}

function color(info) {
	if (devices.length > 0) {
		let device = devices[i];
		if (info.section !== section) {
			let new_effect = Math.floor(Math.random() * Math.floor(4));
			section = info.section;
			while (effect === new_effect) {
				new_effect = Math.floor(Math.random() * Math.floor(4));
			}
			effect = new_effect;
		}
		if (info.color) {
			switch (effect) {
				case 0:
					device.lightSetColor({
						color: info.color,
						duration: 0.0,
					});
					break;
				case 1:
					//FLASH SEQUENTIAL
					device.lightSetColor({
						color: {
							hue: 0.0,
							saturation: 0.0,
							brightness: 0.0,
							kelvin: 3500,
						},
						duration: 0.0,
					});
					device.lightSetWaveform({
						transient: 1,
						color: info.color,
						period: 100,
						skew_ratio: 0.5,
						cycles: 1,
						waveform: 4,
					});
					break;
				case 2:
					//ALL LIGHTS
					for (let j = 0; j < devices.length; j++) {
						devices[j].lightSetColor({
							color: info.color,
							duration: 0.0,
						});
					}
					break;
				case 3:
					device.lightSetColor({
						color: {
							hue: 0.0,
							saturation: 0.0,
							brightness: 0.0,
							kelvin: 3500,
						},
					});
					device.lightSetWaveform({
						transient: 1,
						color: info.color,
						period: info.duration,
						cycles: 1,
						waveform: 2,
					});
					break;
				default:
					device.lightSetColor({
						color: info.color,
						duration: 0.0,
					});
			}
		}

		if (i >= devices.length - 1) {
			i = 0;
		} else {
			i++;
		}
	}
}

module.exports = {
	discover,
	destroy,
	color,
};
