const Lifx = require('node-lifx-lan');

let devices = [];
let lights = []; //indexes in device list
let effects = []; //effect values to use
let i = 0;
let section = 0;
let eff = null;

let settings = {
	brightness: 1.0,
	changeBrightness: false,
};

function discover(window) {
	devices = [];
	Lifx.discover()
		.then(device_list => {
			if (device_list.length > 0) {
				return device_list.forEach(device => {
					let index = devices.findIndex(x => x.ip===device.ip)
					if(index === -1) {
						devices.push(device);
						window.webContents.send('lifx-new', device);
					}
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
	let activeEffects = info.filter(effect => effect.active === true);
	effects = activeEffects.map(array => array.id);
}

function setSettings(info) {
	let newSettings = info;
	newSettings.brightness = parseFloat(parseInt(info.brightness) / 100);
	settings = newSettings;
}

function preview(info) {
	let colors = [0, 55, 120, 230];

	if (lights.length > 0) {
		let k = 0;
		let previewTimer = setInterval(() => {
			let devs = lights[k];
			if (devs !== undefined) {
				let devs = lights[k];
				info.duration = 500;
				info.time_signature = 4;
				info.color = {
					hue: colors[k] / 360,
					saturation: 1.0,
					brightness: settings.brightness,
					kelvin: 3500,
				};
				info.beat = k + 1;
				info.bar = 2;
				switchEffect(info.effect, devs, info, true);
			}
			k++;
		}, 500);
		if (k >= lights.length - 1) {
			clearInterval(previewTimer);
		}
	}
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
				// change to brightness settings
				info.color.brightness = settings.brightness;
				// check if any effects being used
				if (effects.length > 0) {
					if (eff === null) {
						eff = effects[0];
					}
					eff = switchEffect(eff, devs, info, false);
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

function switchEffect(eff, devs, info, preview) {
	if (effects.includes(eff) || preview === true) {
		switch (eff) {
			// all the single lights
			case 0:
				devs.forEach(k => {
					devices[k].lightSetColor({
						color: info.color,
						duration: 0.0,
					});
				});
				break;
			case 1:
				// everybody (yeah)
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
				// life in the fade lane
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
				// come fade with me
				if (info.beat === 1) {
					for (let j = 0; j < lights.length; j++) {
						lights[j].forEach(k => {
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
								period: info.duration * info.time_signature - 100,
								cycles: 1,
								waveform: 1,
							});
						});
					}
				}
				break;

			case 4:
				// gimme gimme gimme
				if (info.beat < info.time_signature) {
					devs.forEach(k => {
						devices[k].lightSetColor({
							color: info.color,
						});
					});
				} else {
					for (let j = 0; j < lights.length; j++) {
						lights[j].forEach(k => {
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
					}
				}
				break;

			case 5:
				// good cop bad cop
				for (let j = 0; j < lights.length; j++) {
					lights[j].forEach(k => {
						devices[k].lightSetColor({
							color: {
								hue: (j + parseInt(info.beat)) % 2 === 0 ? 0.0 : 0.7,
								saturation: 1.0,
								brightness: info.color.brightness,
								kelvin: 3500,
							},
						});
					});
				}

				break;

			case 6:
				// flashing lights lights lights
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

			case 7:
				// hasta la vista baby
				if (info.beat === 1 && info.bar % 2 === 0) {
					for (let j = 0; j < lights.length; j++) {
						lights[j].forEach(k => {
							devices[k].lightSetColor({
								color: {
									hue: 0.0,
									saturation: 1.0,
									brightness: 0.0,
									kelvin: 3500,
								},
							});
							devices[k].lightSetWaveform({
								transient: 0,
								color: {
									hue: 0.0,
									saturation: 1.0,
									brightness: info.color.brightness,
									kelvin: 3500,
								},
								period: info.duration * info.time_signature,
								cycles: 1,
								waveform: 0,
							});
						});
					}
				} else if (info.beat === 1 && info.bar % 2 === 1) {
					for (let j = 0; j < lights.length; j++) {
						lights[j].forEach(k => {
							devices[k].lightSetWaveform({
								transient: 0,
								color: {
									hue: 0.0,
									saturation: 1.0,
									brightness: 0.0,
									kelvin: 3500,
								},
								period: info.duration * info.time_signature,
								cycles: 1,
								waveform: 0,
							});
						});
					}
				}
				break;

			case 8:
				// saturday night seizure
				for (let j = 0; j < lights.length; j++) {
					lights[j].forEach(k => {
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
				}
				break;

			case 9:
				// lets turn it on
				if ((info.bar + info.beat) % Math.floor(info.time_signature / 2) === 1) {
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
							period: info.duration * 8,
							skew_ratio: 0.5,
							cycles: 1,
							waveform: 3,
						});
					});
				}
				break;

			case 10:
				// the bend and snap
				let ind = i;
				if (info.beat % 2 === 1) {
					ind = (info.bar % 2 === 1 ? ind + 1 : ind + 2) % info.time_signature;

					if (ind > lights.length) {
						ind = 0;
					}
					if (lights[ind] !== undefined) {
						lights[ind].forEach(k => {
							devices[k].lightSetColor({
								color: info.color,
								duration: 0.0,
							});
							devices[k].lightSetWaveform({
								transient: 0,
								color: {
									hue: 0.0,
									saturation: 0.0,
									brightness: 0.0,
									kelvin: 3500,
								},
								period: info.duration,
								skew_ratio: 0.5,
								cycles: 0.5,
								waveform: 1,
							});
						});
					}
				} else {
					ind = (info.bar % 2 === 1 ? ind : ind + 1) % info.time_signature;

					if (ind > lights.length) {
						ind = 0;
					}
					if (lights[ind] !== undefined) {
						lights[ind].forEach(k => {
							devices[k].lightSetWaveform({
								transient: 0,
								color: info.color,
								period: Math.floor(info.duration / info.time_signature),
								skew_ratio: 0.5,
								cycles: 1,
								waveform: 4,
							});
						});
					}
				}

				break;

			case 11:
				// that's the way i light it
				devs.forEach(k => {
					devices[k].lightSetColor({
						color: {
							hue: 1.0 - info.color.hue,
							saturation: 0.0,
							brightness: 0.0,
							kelvin: 3500,
						},
						duration: 0.0,
					});
					devices[k].lightSetWaveform({
						transient: 1,
						color: info.color,
						period: info.duration * 4,
						skew_ratio: 0.5,
						cycles: 1,
						waveform: 1,
					});
				});
				break;

			case 12:
				// you strobe me round like a record
				if (info.beat === 1) {
					for (let j = 0; j < lights.length; j++) {
						setTimeout(function timer() {
							lights[j].forEach(k => {
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
									period: Math.floor(info.duration / 4),
									skew_ratio: 0.5,
									cycles: 1,
									waveform: 4,
								});
							});
						}, j * Math.floor(info.duration / 4));
					}
				}

				break;

			case 13:
				// hollywood strobing
				if (info.beat === 1 && info.bar % 2 === 0) {
					for (let j = 0; j < lights.length; j++) {
						lights[j].forEach(k => {
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
								color: {
									hue: 0.0,
									saturation: 0.0,
									brightness: info.color.brightness,
									kelvin: 3500,
								},
								period: Math.floor(info.duration / 8),
								skew_ratio: 0.5,
								cycles: 32,
								waveform: 4,
							});
						});
					}
				}
				break;

			default:
				break;
		}
		return eff;
	} else {
		let new_eff = effects[Math.floor(Math.random() * Math.floor(effects.length))];
		eff = new_eff;
		return eff;
	}
}

module.exports = {
	discover,
	update,
	destroy,
	effect,
	note,
	color,
	setSettings,
	preview,
};
