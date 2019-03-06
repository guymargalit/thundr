/* ------------------------------------------------------------------
* node-lifx-lan - lifx-lan-device.js
*
* Copyright (c) 2017-2018, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2018-08-08
* ---------------------------------------------------------------- */
'use strict';
const mCrypto = require('crypto');
const mLifxLanColor = require('./lifx-lan-color');

/* ------------------------------------------------------------------
* Constructor: LifxLanDevice(params)
* - params:
*   - mac | String     | Required | MAC address (e.g., "D0:73:D5:13:96:7E")
*   - ip  | String     | Required | IP address (e.g., "192.168.10.25")
*   - udp | LifxLanUdp | Required | a LifxLanUdp object
* ---------------------------------------------------------------- */
const LifxLanDevice = function (params) {
	// Check the parameters
	if (!params || typeof (params) !== 'object') {
		throw new Error('The argument `params` is invalid.');
	}
	// Check the value of the parameter `mac`
	if (!('mac' in params)) {
		throw new Error('The parameter `mac` is required.');
	}
	let mac = params['mac'];
	if (typeof (mac) !== 'string') {
		throw new Error('The value of the parameter `mac` must be a string.');
	} else if (!/^[a-fA-F0-9]{2}\:[a-fA-F0-9]{2}\:[a-fA-F0-9]{2}\:[a-fA-F0-9]{2}\:[a-fA-F0-9]{2}\:[a-fA-F0-9]{2}$/.test(mac)) {
		throw new Error('The value of the parameter `mac` is invalid as a MAC address');
	}
	// Check the value of the parameter `ip`
	if (!('ip' in params)) {
		throw new Error('The parameter `ip` is required.');
	}
	let ip = params['ip'];
	if (typeof (ip) !== 'string') {
		throw new Error('The value of the parameter `ip` must be a string.');
	} else if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip)) {
		throw new Error('The value of the parameter `ip` is invalid as a IP address');
	}
	// Check the value of the parameter `udp'
	if (!('udp' in params)) {
		throw new Error('The parameter `udp` is required.');
	}
	let udp = params['udp'];
	if (typeof (udp) !== 'object') {
		throw new Error('The value of the parameter `udp` is invalid.');
	}

	// Public
	this.mac = mac;
	this.ip = ip;
	this.deviceInfo = null;
	// Private
	this._lifxLanUdp = udp;
};

LifxLanDevice.prototype._request = function (type, payload) {
	let promise = new Promise((resolve, reject) => {
		this._lifxLanUdp.request({
			address: this.ip,
			type: type,
			payload: payload || null,
			ack_required: false,
			res_required: true,
			target: this.mac
		}).then((res) => {
			let payload = res['payload'] || null;
			resolve(payload);
		}).catch((error) => {
			reject(error);
		});
	});
	return promise;
};

LifxLanDevice.prototype._wait = function (msec) {
	if (!msec) {
		msec = 50;
	}
	let promise = new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, msec);
	});
	return promise;
};

/* ==================================================================
* High level methods
* ================================================================ */

/* ------------------------------------------------------------------
* Method: turnOn([params])
* - params:
*   - color        | Color   | Optional |
*   - duration     | Integer | Optional | The default value is 0 msec
*
* The `Color` object must be:
*
*     - hue        | Float   | Optional | 0.0 - 1.0
*     - saturation | Float   | Optional | 0.0 - 1.0
*     - brightness | Float   | Optional | 0.0 - 1.0
*     - kelvin     | Integer | Optional | 1500 - 9000
*
* or
*
*     - red        | Float   | Optional | 0.0 - 1.0
*     - green      | Float   | Optional | 0.0 - 1.0
*     - blue       | Float   | Optional | 0.0 - 1.0
*     - kelvin     | Integer | Optional | 1500 - 9000
*
* or
*
*     - css        | String  | Optional | "#ff0000" or "rgb(255, 0, 0)" or "red" format 
*     - kelvin     | Integer | Optional | 1500 - 9000
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.turnOn = function (params) {
	if (!params) {
		params = {};
	}
	let promise = new Promise((resolve, reject) => {
		this._turnOnSetColor(params).then(() => {
			return this._wait();
		}).then(() => {
			let p = { level: 1 };
			if ('duration' in params) {
				p['duration'] = params['duration'];
			}
			return this.lightSetPower(p);
		}).then((res) => {
			resolve();
		}).catch((error) => {
			reject(error);
		});
	});
	return promise;
};

LifxLanDevice.prototype._turnOnSetColor = function (params) {
	let promise = new Promise((resolve, reject) => {
		if (params && typeof (params) === 'object' && 'color' in params) {
			this.setColor(params).then(() => {
				resolve();
			}).catch((error) => {
				reject(error);
			});
		} else {
			resolve();
		}
	});
	return promise;
};

/* ------------------------------------------------------------------
* Method: setColor(params)
* - params:
*   - color        | Color   | Optional |
*   - duration     | Integer | Optional | The default value is 0 msec
*
* The `Color` object must be:
*
*     - hue        | Float   | Optional | 0.0 - 1.0
*     - saturation | Float   | Optional | 0.0 - 1.0
*     - brightness | Float   | Optional | 0.0 - 1.0
*     - kelvin     | Integer | Optional | 1500 - 9000
*
* or
*
*     - red        | Float   | Optional | 0.0 - 1.0
*     - green      | Float   | Optional | 0.0 - 1.0
*     - blue       | Float   | Optional | 0.0 - 1.0
*     - brightness | Float   | Optional | 0.0 - 1.0
*     - kelvin     | Integer | Optional | 1500 - 9000
*
* or
*
*     - css        | String  | Optional | "#ff0000" or "rgb(255, 0, 0)" or "red" format 
*     - brightness | Float   | Optional | 0.0 - 1.0
*     - kelvin     | Integer | Optional | 1500 - 9000
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.setColor = function (params) {
	let promise = new Promise((resolve, reject) => {
		this.lightGet().then((res) => {
			let color = res['color'];
			if ('color' in params) {
				let c = params['color'];
				if (typeof (c) === 'object') {
					if ('hue' in c || 'saturation' in c) {
						if ('hue' in c) {
							color['hue'] = c['hue'];
						}
						if ('saturation' in c) {
							color['saturation'] = c['saturation'];
						}
						if ('brightness' in c) {
							color['brightness'] = c['brightness'];
						}
					} else if ('x' in c || 'y' in c) {
						let converted = mLifxLanColor.hsbToXyb({
							hue: color['hue'],
							saturation: color['saturation'],
							brightness: color['brightness']
						});
						if (converted['error']) {
							throw converted['error'];
						}
						let xyb = converted['xyb'];
						if ('x' in c) {
							xyb['x'] = c['x'];
						}
						if ('y' in c) {
							xyb['y'] = c['y'];
						}
						if ('brightness' in c) {
							xyb['brightness'] = c['brightness'];
						}
						let converted2 = mLifxLanColor.xybToHsb(xyb);
						if (converted2['error']) {
							throw converted2['error'];
						}
						let hsb = converted2['hsb'];
						color['hue'] = hsb['hue'];
						color['saturation'] = hsb['saturation'];
						color['brightness'] = hsb['brightness'];
					} else if ('red' in c || 'green' in c || 'blue' in c) {
						let converted = mLifxLanColor.hsbToRgb({
							hue: color['hue'],
							saturation: color['saturation'],
							brightness: color['brightness']
						});
						if (converted['error']) {
							throw converted['error'];
						}
						let rgb = converted['rgb'];
						if ('red' in c) {
							rgb['red'] = c['red'];
						}
						if ('green' in c) {
							rgb['green'] = c['green'];
						}
						if ('blue' in c) {
							rgb['blue'] = c['blue'];
						}
						if ('brightness' in c) {
							rgb['brightness'] = c['brightness'];
						}
						let converted2 = mLifxLanColor.rgbToHsb(rgb);
						if (converted2['error']) {
							throw converted2['error'];
						}
						let hsb = converted2['hsb'];
						color['hue'] = hsb['hue'];
						color['saturation'] = hsb['saturation'];
						color['brightness'] = hsb['brightness'];
					} else if ('css' in c) {
						let converted = mLifxLanColor.cssToHsb(c);
						if (converted['hsb']) {
							let hsb = converted['hsb'];
							color['hue'] = hsb['hue'];
							color['saturation'] = hsb['saturation'];
							color['brightness'] = hsb['brightness'];
						} else {
							throw converted['error'];
						}
					}
					if ('kelvin' in c) {
						color['kelvin'] = c['kelvin'];
					}
				} else {
					throw new Error('The `color` is invalid.');
				}
			}
			let reqp = {
				color: color
			};
			if (res['power']) {
				if ('duration' in params) {
					reqp['duration'] = params['duration'];
				}
			}
			return this.lightSetColor(reqp);
		}).then(() => {
			resolve();
		}).catch((error) => {
			reject(error);
		});
	});
	return promise;
};

/* ------------------------------------------------------------------
* Method: turnOff([params])
* - params:
*   - duration | Integer | Optional | The default value is 0 msec
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.turnOff = function (params) {
	if (!params) {
		params = {};
	}
	let promise = new Promise((resolve, reject) => {
		let p = { level: 0 };
		if ('duration' in params) {
			p['duration'] = params['duration'];
		}
		this.lightSetPower(p).then(() => {
			resolve();
		}).catch((error) => {
			reject(error);
		});
	});
	return promise;
};

/* ------------------------------------------------------------------
* Method: getDeviceInfo()
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.getDeviceInfo = function () {
	let promise = new Promise((resolve, reject) => {
		let info = {};
		this.deviceGetLabel().then((res) => {
			info = Object.assign(info, res);
			return this._wait();
		}).then(() => {
			return this.deviceGetVersion();
		}).then((res) => {
			info = Object.assign(info, res);
			return this._wait();
		}).then(() => {
			return this.deviceGetLocation();
		}).then((res) => {
			info['location'] = res;
			return this._wait();
		}).then(() => {
			return this.deviceGetGroup();
		}).then((res) => {
			info['group'] = res;
			return this._wait();
		}).then(() => {
			return this._getDeviceMultiZone(info);
		}).then((multizone) => {
			info['multizone'] = multizone;
			this.deviceInfo = info;
			resolve(JSON.parse(JSON.stringify(info)));
		}).catch((error) => {
			reject(error);
		});
	});
	return promise;
};

LifxLanDevice.prototype._getDeviceMultiZone = function (info) {
	let promise = new Promise((resolve, reject) => {
		if (info['features']['multizone']) {
			this.multiZoneGetColorZones({
				start: 0,
				end: 0
			}).then((res) => {
				resolve({
					count: res['count']
				});
			}).catch((error) => {
				reject(error);
			});
		} else {
			resolve(null);
		}
	});
	return promise;
};

/* ------------------------------------------------------------------
* Method: getLightState()
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.getLightState = function () {
	let promise = new Promise((resolve, reject) => {
		let state = {};
		let info = null;
		this.getDeviceInfo().then((dev_info) => {
			info = dev_info;
			return this.lightGet();
		}).then((res) => {
			state = Object.assign(state, res);
			return this._wait();
		}).then(() => {
			return this._getLightInfraredState(info);
		}).then((infrared) => {
			state['infrared'] = infrared;
			return this._wait();
		}).then(() => {
			return this._getLightMultiZoneState(info);
		}).then((multizone) => {
			state['multizone'] = multizone;
			resolve(state);
		}).catch((error) => {
			reject(error);
		});
	});
	return promise;
};

LifxLanDevice.prototype._getLightInfraredState = function (info) {
	let promise = new Promise((resolve, reject) => {
		if (info['features']['infrared']) {
			this.lightGetInfrared().then((res) => {
				resolve(res);
			}).catch((error) => {
				reject(error);
			});
		} else {
			resolve(null);
		}
	});
	return promise;
};

LifxLanDevice.prototype._getLightMultiZoneState = function (info) {
	let promise = new Promise((resolve, reject) => {
		if (info['features']['multizone']) {
			let count = info['multizone']['count'];
			let i = 0;
			let colors = [];
			let getColor = (callback) => {
				if (i >= count) {
					callback();
					return;
				}
				this.multiZoneGetColorZones({
					start: i,
					end: i
				}).then((res) => {
					colors.push(res['color']);
					i++;
					getColor(callback);
				}).catch((error) => {
					callback(error);
				})
			};
			getColor((error) => {
				if (error) {
					reject(error);
				} else {
					resolve({
						count: count,
						colors: colors
					});
				}
			});
		} else {
			resolve(null);
		}
	});
	return promise;
};

/* ==================================================================
* Low level methods
* ================================================================ */

/* ------------------------------------------------------------------
* Method: deviceGetService()
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.deviceGetService = function () {
	return this._request(2);
};

/* ------------------------------------------------------------------
* Method: deviceGetHostInfo()
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.deviceGetHostInfo = function () {
	return this._request(12);
};

/* ------------------------------------------------------------------
* Method: deviceGetHostFirmware()
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.deviceGetHostFirmware = function () {
	return this._request(14);
};

/* ------------------------------------------------------------------
* Method: deviceGetWifiInfo()
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.deviceGetWifiInfo = function () {
	return this._request(16);
};

/* ------------------------------------------------------------------
* Method: deviceGetWifiFirmware()
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.deviceGetWifiFirmware = function () {
	return this._request(18);
};

/* ------------------------------------------------------------------
* Method: deviceGetPower()
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.deviceGetPower = function () {
	return this._request(20);
};

/* ------------------------------------------------------------------
* Method: deviceSetPower(params)
* - params:
*   - level | Integer | Required | 0 or 1
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.deviceSetPower = function (params) {
	return this._request(21, params);
};

/* ------------------------------------------------------------------
* Method: deviceGetLabel()
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.deviceGetLabel = function () {
	return this._request(23);
};

/* ------------------------------------------------------------------
* Method: deviceSetLabel(params)
* - params:
*   - label | String | Required | up to 32 bytes in UTF-8 encoding
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.deviceSetLabel = function (params) {
	let promise = new Promise((resolve, reject) => {
		let data = null;
		this._request(24, params).then((res) => {
			data = res;
			return this.getDeviceInfo();
		}).then(() => {
			resolve(data);
		}).catch((error) => {
			reject(error);
		})
	});
	return promise;
};

/* ------------------------------------------------------------------
* Method: deviceGetVersion()
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.deviceGetVersion = function () {
	return this._request(32);
};

/* ------------------------------------------------------------------
* Method: deviceGetInfo()
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.deviceGetInfo = function () {
	return this._request(34);
};

/* ------------------------------------------------------------------
* Method: deviceGetLocation()
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.deviceGetLocation = function () {
	return this._request(48);
};

/* ------------------------------------------------------------------
* Method: deviceSetLocation(params)
* - params:
*   - location | String | Optional | 16 bytes hex representation
*   - label    | String | Required | up to 32 bytes in UTF-8 encoding
*   - updated  | Date   | Optional | a JavaScript `Date` object
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.deviceSetLocation = function (params) {
	let promise = new Promise((resolve, reject) => {
		let data = null;
		this._request(49, params).then((res) => {
			data = res;
			return this.getDeviceInfo();
		}).then(() => {
			resolve(data);
		}).catch((error) => {
			reject(error);
		})
	});
	return promise;
};

/* ------------------------------------------------------------------
* Method: deviceGetGroup()
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.deviceGetGroup = function () {
	return this._request(51);
};

/* ------------------------------------------------------------------
* Method: deviceSetGroup(params)
* - params:
*   - group   | String | Optional | 16 bytes hex representation
*   - label   | String | Required | up to 32 bytes in UTF-8 encoding
*   - updated | Date   | Optional | a JavaScript `Date` object
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.deviceSetGroup = function (params) {
	let promise = new Promise((resolve, reject) => {
		let data = null;
		this._request(52, params).then((res) => {
			data = res;
			return this.getDeviceInfo();
		}).then(() => {
			resolve(data);
		}).catch((error) => {
			reject(error);
		})
	});
	return promise;
};

/* ------------------------------------------------------------------
* Method: deviceEchoRequest(params)
* - params:
*   - text | String | Required | up to 64 bytes in UTF-8 encoding
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.deviceEchoRequest = function (params) {
	return this._request(58, params);
};

/* ------------------------------------------------------------------
* Method: lightGet()
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.lightGet = function () {
	return this._request(101);
};

/* ------------------------------------------------------------------
* Method: lightSetColor(params)
* - params:
*   - color        | Object  | Required |
*     - hue        | Float   | Required | 0.0 - 1.0
*     - saturation | Float   | Required | 0.0 - 1.0
*     - brightness | Float   | Required | 0.0 - 1.0
*     - kelvin     | Integer | Required | 1500 - 9000
*   - duration     | Integer | Optional | The default value is 0 msec
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.lightSetColor = function (params) {
	return this._request(102, params);
};

/* ------------------------------------------------------------------
* Method: lightSetWaveform(params)
* - params:
*   - transient    | Integer | Required    | 0 or 1.
*   - color        | Object  | Required    |
*     - hue        | Float   | Required    | 0.0 - 1.0
*     - saturation | Float   | Required    | 0.0 - 1.0
*     - brightness | Float   | Required    | 0.0 - 1.0
*     - kelvin     | Integer | Required    | 1500 - 9000
*   - period       | Integer | Required    | milliseconds
*   - cycles       | Float   | Required    | Number of cycles
*   - skew_ratio   | Float   | Conditional | 0.0 - 1.0.
*                                            Required only when the `waveform` is 4 (PLUSE).
*   - waveform     | Integer | Required    | 0: SAW
*                                            1: SINE
*                                            2: HALF_SINE
*                                            3: TRIANGLE
*                                            4: PLUSE
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.lightSetWaveform = function (params) {
	return this._request(103, params);
};

/* ------------------------------------------------------------------
* Method: lightGetPower()
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.lightGetPower = function () {
	return this._request(116);
};

/* ------------------------------------------------------------------
* Method: lightSetPower(params)
* - params:
*   - level    | Integer | Required | 0 or 1
*   - duration | Integer | Optional | The default value is 0 msec.
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.lightSetPower = function (params) {
	return this._request(117, params);
};

/* ------------------------------------------------------------------
* Method: lightGetInfrared()
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.lightGetInfrared = function () {
	return this._request(120);
};

/* ------------------------------------------------------------------
* Method: lightSetInfrared(params)
* - params:
*   - brightness | Float | Required | 0.0 - 1.0
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.lightSetInfrared = function (params) {
	return this._request(122, params);
};

/* ------------------------------------------------------------------
* Method: multiZoneSetColorZones(params)
* - params:
*   - start        | Integer | Required | 0 - 255
*   - end          | Integer | Required | 0 - 255
*   - color        | Object  | Required | `Color` object
*   - duration     | Integer | Optional | The default value is 0 msec
*   - apply        | Integer | Optional | The default value is 1.
*                                         0: NO_APPLY, 1: APPLY, 2: APPLY_ONLY
*
* The `Color` object must be:
*
*     - hue        | Float   | Optional | 0.0 - 1.0
*     - saturation | Float   | Optional | 0.0 - 1.0
*     - brightness | Float   | Optional | 0.0 - 1.0
*     - kelvin     | Integer | Optional | 1500 - 9000
*
* or
*
*     - red        | Float   | Optional | 0.0 - 1.0
*     - green      | Float   | Optional | 0.0 - 1.0
*     - blue       | Float   | Optional | 0.0 - 1.0
*     - brightness | Float   | Optional | 0.0 - 1.0
*     - kelvin     | Integer | Optional | 1500 - 9000
*
* or
*
*     - css        | String  | Optional | "#ff0000" or "rgb(255, 0, 0)" or "red" format 
*     - brightness | Float   | Optional | 0.0 - 1.0
*     - kelvin     | Integer | Optional | 1500 - 9000
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.multiZoneSetColorZones = function (params) {
	let promise = new Promise((resolve, reject) => {
		if(!params) {
			throw new Error('The `params` is required.');
		} else if(typeof(params) !== 'object') {
			throw new Error('The `params` is invalid.');
		}
		let c = params['color'];
		if (!c) {
			throw new Error('The `color` is required.');
		} else if (typeof (c) !== 'object') {
			throw new Error('The `color` is invalid.');
		}
		this.multiZoneGetColorZones({
			start: params['start'],
			end: params['start']
		}).then((res) => {
			let color = res['color'];
			if ('hue' in c || 'saturation' in c) {
				if ('hue' in c) {
					color['hue'] = c['hue'];
				}
				if ('saturation' in c) {
					color['saturation'] = c['saturation'];
				}
				if ('brightness' in c) {
					color['brightness'] = c['brightness'];
				}
			} else if ('x' in c || 'y' in c) {
				let converted = mLifxLanColor.hsbToXyb({
					hue: color['hue'],
					saturation: color['saturation'],
					brightness: color['brightness']
				});
				if (converted['error']) {
					throw converted['error'];
				}
				let xyb = converted['xyb'];
				if ('x' in c) {
					xyb['x'] = c['x'];
				}
				if ('y' in c) {
					xyb['y'] = c['y'];
				}
				if ('brightness' in c) {
					xyb['brightness'] = c['brightness'];
				}
				let converted2 = mLifxLanColor.xybToHsb(xyb);
				if (converted2['error']) {
					throw converted2['error'];
				}
				let hsb = converted2['hsb'];
				color['hue'] = hsb['hue'];
				color['saturation'] = hsb['saturation'];
				color['brightness'] = hsb['brightness'];
			} else if ('red' in c || 'green' in c || 'blue' in c) {
				let converted = mLifxLanColor.hsbToRgb({
					hue: color['hue'],
					saturation: color['saturation'],
					brightness: color['brightness']
				});
				if (converted['error']) {
					throw converted['error'];
				}
				let rgb = converted['rgb'];
				if ('red' in c) {
					rgb['red'] = c['red'];
				}
				if ('green' in c) {
					rgb['green'] = c['green'];
				}
				if ('blue' in c) {
					rgb['blue'] = c['blue'];
				}
				if ('brightness' in c) {
					rgb['brightness'] = c['brightness'];
				}
				let converted2 = mLifxLanColor.rgbToHsb(rgb);
				if (converted2['error']) {
					throw converted2['error'];
				}
				let hsb = converted2['hsb'];
				color['hue'] = hsb['hue'];
				color['saturation'] = hsb['saturation'];
				color['brightness'] = hsb['brightness'];
			} else if ('css' in c) {
				let converted = mLifxLanColor.cssToHsb(c);
				if (converted['hsb']) {
					let hsb = converted['hsb'];
					color['hue'] = hsb['hue'];
					color['saturation'] = hsb['saturation'];
					color['brightness'] = hsb['brightness'];
				} else {
					throw converted['error'];
				}
			}
			if ('kelvin' in c) {
				color['kelvin'] = c['kelvin'];
			}
			let p = JSON.parse(JSON.stringify(params));
			p['color'] = color;
			return this._request(501, p);
		}).then((res) => {
			resolve(res);
		}).catch((error) => {
			reject(error);
		});
	});
	return promise;
};

/* ------------------------------------------------------------------
* Method: multiZoneGetColorZones(params)
* - params:
*   - start | Integer | Required | 0 - 255
*   - end   | Integer | Required | 0 - 255
* ---------------------------------------------------------------- */
LifxLanDevice.prototype.multiZoneGetColorZones = function (params) {
	return this._request(502, params);
};

module.exports = LifxLanDevice;
