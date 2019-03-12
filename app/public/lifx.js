var LifxClient = require('node-lifx').Client;
var client = new LifxClient();

let devices = [];
let i = 0;
let section = 0;
let effect = 0;

function discover(window) {
	client.init({
		resendPacketDelay: 0,
		resendMaxTimes: 0,
	});
	client.on('light-new', device => {
		devices.push(device);
		window.webContents.send('lifx-new', device);
		device.on();
		device.color(0, 0, 100);
		console.log(devices);
	});
}

function color(info) {
	if (devices.length > 0) {
		let device = client.light(devices[i].address);
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
					device.color(info.color.hue * 360, info.color.saturation * 100, info.color.brightness * 100);
					break;
				case 1:
					//FLASH SEQUENTIAL
					device.color(info.color.hue * 360, info.color.saturation * 100, info.color.brightness * 100);
					break;
				case 2:
					//ALL LIGHTS
					client.lights().forEach(light => {
						light.color(info.color.hue * 360, info.color.saturation * 100, info.color.brightness * 100);
					});
					break;
				case 3:
					client.lights().forEach(light => {
						light.color(info.color.hue * 360, info.color.saturation * 100, info.color.brightness * 100);
					});
					break;
				default:
					device.color(info.color.hue * 360, info.color.saturation * 100, info.color.brightness * 100);
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
	color,
};
