const Lifx = require('node-lifx-lan');
var convert = require('color-convert');

let devices = [];
let lights = []; //indexes in device list
let effects = []; //effect values to use
let i = 0;
let section = 0;
let eff = null;

function discover(window) {
	devices = [];
	Lifx.discover()
		.then(device_list => {
			if (device_list.length > 0) {
				return device_list.forEach(device => {
					devices.push(device);
					window.webContents.send('lifx-new', device);
				});
			} else {
				window.webContents.send('lifx-none', '');
			}
		})
		.catch(error => {
			console.error(error);
		});
}

function update(info) {
	lights = [];
	if (info.one.length > 0) {
		let arr = [];
		info.one.forEach(light => {
			let k = devices.findIndex(obj => obj.ip === light.ip);
			devices[k].turnOn({
				color: {
					hue: 0,
					saturation: 0,
					brightness: 1.0,
					kelvin: 3500,
				},
				duration: 0.0,
			});
			arr.push(k);
		});
		lights.push(arr);
	}
	if (info.two.length > 0) {
		let arr = [];
		info.two.forEach(light => {
			let k = devices.findIndex(obj => obj.ip === light.ip);
			devices[k].turnOn({
				color: {
					hue: 0,
					saturation: 0,
					brightness: 1.0,
					kelvin: 3500,
				},
				duration: 0.0,
			});
			arr.push(k);
		});
		lights.push(arr);
	}
	if (info.three.length > 0) {
		let arr = [];
		info.three.forEach(light => {
			let k = devices.findIndex(obj => obj.ip === light.ip);
			devices[k].turnOn({
				color: {
					hue: 0,
					saturation: 0,
					brightness: 1.0,
					kelvin: 3500,
				},
				duration: 0.0,
			});
			arr.push(k);
		});
		lights.push(arr);
	}
	if (info.four.length > 0) {
		let arr = [];
		info.four.forEach(light => {
			let k = devices.findIndex(obj => obj.ip === light.ip);
			devices[k].turnOn({
				color: {
					hue: 0,
					saturation: 0,
					brightness: 1.0,
					kelvin: 3500,
				},
				duration: 0.0,
			});
			arr.push(k);
		});
		lights.push(arr);
	}
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

function effect(info) {
	effects = info;
}

function note(info) {
	for (let j = 0; j < lights.length; j++) {
		lights[j].forEach(k => {
			devices[k].lightSetColor({
				color: {
					hue: info / 360,
					saturation: 1.0,
					brightness: 1.0,
					kelvin: 3500,
				},
				duration: 0.0,
			});
		});
	}
}

function color(info) {
	if (lights.length > 0) {
		let devs = lights[i];
		if (devs !== undefined) {
			if (info.section !== section) {
				section = info.section;
				if (effects.length > 1) {
					let new_eff = effects[Math.floor(Math.random() * Math.floor(effects.length))];
					while (eff === new_eff) {
						new_eff = effects[Math.floor(Math.random() * Math.floor(effects.length))];
					}
					eff = new_eff;
				}
			}
			if (info.color) {
				// check if any effects being used
				if (effects.length > 0) {
					if (eff === null) {
						eff = effects[0];
					}
					switch (eff) {
						//INDIVIDUAL LIGHTS
						case 0:
							devs.forEach(k => {
								devices[k].lightSetColor({
									color: info.color,
									duration: 0.0,
								});
							});
							break;
						case 1:
							//ALL LIGHTS
							for (let j = 0; j < lights.length; j++) {
								lights[j].forEach(k => {
									devices[k].lightSetColor({
										color: info.color,
										duration: 0.0,
									});
								});
							}

							break;
						case 2:
							//FADE LIGHTS
							devs.forEach(k => {
								devices[k].lightSetColor({
									color: {
										hue: 0.0,
										saturation: 0.0,
										brightness: 0.0,
										kelvin: 3500,
									},
								});
								devices[k].lightSetWaveform({
									transient: 1,
									color: info.color,
									period: info.duration,
									cycles: 1,
									waveform: 2,
								});
							});
							break;
						case 3:
							//FLASH SEQUENTIAL
							devs.forEach(k => {
								devices[k].lightSetColor({
									color: {
										hue: 0.0,
										saturation: 0.0,
										brightness: 0.0,
										kelvin: 3500,
									},
									duration: 0.0,
								});
								devices[k].lightSetWaveform({
									transient: 1,
									color: info.color,
									period: 100,
									skew_ratio: 0.5,
									cycles: 1,
									waveform: 4,
								});
							});
							break;
						default:
							break;
					}
				}
			}

			if (i >= lights.length - 1) {
				i = 0;
			} else {
				i++;
			}
		} else {
			i = 0; // when removing light while playing, reset so no undefined length
		}
	}
}

module.exports = {
	discover,
	update,
	destroy,
	effect,
	note,
	color,
};
