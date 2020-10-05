var tcp = require('../../tcp');
var instance_skel = require('../../instance_skel');

var actions       = require('./actions');
var feedback      = require('./feedback');
var presets       = require('./presets');
var setup         = require('./setup');
var upgrades      = require('./upgrades');
var variables     = require('./variables');

var debug;
var log;

/**
 * Companion instance class for the Blackmagic SmartView/SmartScope Monitors.
 *
 * @extends instance_skel
 * @version 1.1.0
 * @since 1.0.0
 * @author Per Roine <per.roine@gmail.com>
 * @author Keith Rocheck <keith.rocheck@gmail.com>
 */
class instance extends instance_skel {

	/**
	 * Create an instance of a SmartView/SmartScope module.
	 *
	 * @param {EventEmitter} system - the brains of the operation
	 * @param {string} id - the instance ID
	 * @param {Object} config - saved user configuration parameters
	 * @since 1.0.0
	 */
	constructor(system, id, config) {
		super(system, id, config);

		this.stash        = [];
		this.command      = null;
		this.commandQueue = [];
		this.cts          = false;
		this.deviceName   = '';
		this.monitors     = {};

		Object.assign(this, {
			...setup,
			...actions,
			...feedback,
			...presets,
			...variables,
			...upgrades
		});;

		this.addUpgradeScripts();

		this.PRESETS_STATES = [
			{ action: 'bright',    group: 'Brightness',     label: 'Brightness\\n\\n@ ', choices: [{id: 0, label: '0'}, {id: 127, label: '127'}, {id: 255, label: '255'}] },
			{ action: 'cont',      group: 'Contrast',       label: 'Contrast\\n\\n@ ',   choices: [{id: 0, label: '0'}, {id: 127, label: '127'}, {id: 255, label: '255'}] },
			{ action: 'sat',       group: 'Saturation',     label: 'Saturation\\n\\n@ ', choices: [{id: 0, label: '0'}, {id: 127, label: '127'}, {id: 255, label: '255'}] },
			{ action: 'ident',     group: 'Identify',       label: 'Identify',           choices: null },
			{ action: 'border',    group: 'Border Color',   label: 'Border Color:\\n',   choices: this.CHOICES_COLORS },
			{ action: 'scopeFunc', group: 'Scope Function', label: 'Scope Fn:\\n',       choices: this.CHOICES_SCOPETYPE },
			{ action: 'audio',     group: 'Audio Channels', label: 'Audio Ch:\\n',       choices: this.CHOICES_AUDIOCHANNELS },
			{ action: 'lut',       group: 'LUT',            label: 'LUT: ',              choices: this.CHOICES_LUTS },
			{ action: 'input',     group: 'Input',          label: 'Input: ',            choices: this.CHOICES_INPUTS }
		];

		this.PRESETS_VALUES = [
			{ action: 'brightUp',   group: 'Brightness', label: 'BRIGHTNESS\\nUP\\n\\n$(smart:_brightness)'    },
			{ action: 'brightDown', group: 'Brightness', label: 'BRIGHTNESS\\nDOWN\\n\\n$(smart:_brightness)'  },
			{ action: 'contUp',     group: 'Contrast',   label: 'CONTRAST\\nUP\\n\\n$(smart:_contrast)',       },
			{ action: 'contDown',   group: 'Contrast',   label: 'CONTRAST\\nDOWN\\n\\n$(smart:_contrast)',     },
			{ action: 'satUp',      group: 'Saturation', label: 'SATURATION\\nUP\\n\\n$(smart:_saturation)',   },
			{ action: 'satDown',    group: 'Saturation', label: 'SATURATION\\nDOWN\\n\\n$(smart:_saturation)', }
		];

		this.actions(); // export actions
	}

	/**
	 * Setup the actions.
	 *
	 * @param {EventEmitter} system - the brains of the operation
	 * @access public
	 * @since 1.0.0
	 */
	actions(system) {

		this.setupChoices();
		this.setActions( this.getActions() );
	}

	/**
	 * Executes the provided action.
	 *
	 * @param {Object} action - the action to be executed
	 * @access public
	 * @since 1.0.0
	 */
	action(action) {
		let cmd;
		let opt = action.options;
		let mon = this.getMonitor(opt.mon);

		switch (action.action) {

			case 'bright':
				cmd = `${opt.mon}\nBrightness: ${opt.val}`;
				break;
			case 'brightUp':
				cmd = `${opt.mon}\nBrightness: ${this.getValue(mon.brightness, opt.val)}`;
				break;
			case 'brightDown':
				cmd = `${opt.mon}\nBrightness: ${this.getValue(mon.brightness, 0-opt.val)}`;
				break;
			case 'cont':
				cmd = `${opt.mon}\nContrast: ${opt.val}`;
				break;
			case 'contUp':
				cmd = `${opt.mon}\nContrast: ${this.getValue(mon.contrast, opt.val)}`;
				break;
			case 'contDown':
				cmd = `${opt.mon}\nContrast: ${this.getValue(mon.contrast, 0-opt.val)}`;
				break;
			case 'sat':
				cmd = `${opt.mon}\nSaturation: ${opt.val}`;
				break;
			case 'satUp':
				cmd = `${opt.mon}\nSaturation: ${this.getValue(mon.saturation, opt.val)}`;
				break;
			case 'satDown':
				cmd = `${opt.mon}\nSaturation: ${this.getValue(mon.saturation, 0-opt.val)}`;
				break;
			case 'ident':
				cmd = `${opt.mon}\nIdentify: true`;
				break;
			case 'border':
				cmd = `${opt.mon}\nBorder: ${opt.col}`;
				break;
			case 'scopeFunc':
				cmd = `${opt.mon}\nScopeMode: ${opt.val}`;
				break;
			case 'audio':
				cmd = `${opt.mon}\nAudioChannel: ${opt.val}`;
				break;
			case 'lut':
				cmd = `${opt.mon}\nLUT: ${opt.val}`;
				break;
			case 'input':
				cmd = `${opt.mon}\nMonitorInput: ${opt.val}`;
				break;
		}

		if (cmd !== undefined) {

			if (this.socket !== undefined && this.socket.connected) {
				this.queueCommand(`${cmd}\n\n`);
			}
			else {
				this.debug('Socket not connected :(');
			}
		}
	}

	/**
	 * Creates the configuration fields for web config.
	 *
	 * @returns {Array} the config fields
	 * @access public
	 * @since 1.0.0
	 */
	config_fields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 6,
				regex: this.REGEX_IP
			},
			{
				type: 'text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This information below will automatically populate from the device upon connection, however, can be set manually for offline programming.'
			},
			{
				type: 'dropdown',
				id: 'ver',
				label: 'Product',
				width: 6,
				choices: this.CHOICES_MODEL,
				default: 'smView'
			}
		]
	}

	/**
	 * Clean up the instance before it is destroyed.
	 *
	 * @access public
	 * @since 1.0.0
	 */
	destroy() {
		if (this.socket !== undefined) {
			this.socket.destroy();
		}

		this.debug("destroy", this.id);;
	}

	/**
	 * INTERNAL: returns the desired monitor object.
	 *
	 * @param {String} id - the monitor to fetch
	 * @returns {Object} the desired monitor object
	 * @access protected
	 * @since 1.1.0
	 */
	getMonitor(id) {

		if (id.length > 1) {
			if (id.match(/ A/)) {
				id = 'A';
			}
			else if (id.match(/ B/)) {
				id = 'B';
			}
		}

		id = id.toLowerCase();

		if (this.monitors[id] === undefined) {
			this.monitors[id] = {
				id:              id,
				brightness:      255,
				contrast:        128,
				saturation:      128,
				identify:        false,
				border:          'none',
				scopeMode:       'Picture',
				audioChannel:    '0',
				lut:             'NONE',
				monitorInput:    'SDI A'
			};
		}

		return this.monitors[id];
	}

	/**
	 * INTERNAL: returns a value between 0 and 255 based on change.
	 *
	 * @param {number} base - the base value to modify
	 * @param {number} offset - the +/- value
	 * @returns {number} 0-255
	 * @access protected
	 * @since 1.1.0
	 */
	getValue(base, offset) {

		var out = base + offset;

		if (out > 255) {
			out = 255;
		}
		else if (out < 0) {
			out = 0;
		}

		return out;
	}

	/**
	 * Main initialization function called once the module
	 * is OK to start doing things.
	 *
	 * @access public
	 * @since 1.0.0
	 */
	init() {
		debug = this.debug;
		log = this.log;

		this.initVariables();
		this.initFeedbacks();
		this.initPresets();

		this.initTCP();
	}

	/**
	 * INTERNAL: use setup data to initalize the tcp socket object.
	 *
	 * @access protected
	 * @since 1.0.0
	 */
	initTCP() {
		var receivebuffer = '';

		if (this.socket !== undefined) {
			this.socket.destroy();
			delete this.socket;
		}

		if (this.config.port === undefined) {
			this.config.port = 9992;
		}

		if (this.config.host) {
			this.socket = new tcp(this.config.host, this.config.port);

			this.socket.on('status_change', (status, message) => {
				this.status(status, message);
			});

			this.socket.on('error', (err) => {
				this.debug("Network error", err);
				this.log('error',"Network error: " + err.message);
			});

			this.socket.on('connect', () => {
				this.debug("Connected");
			});

			// separate buffered stream into lines with responses
			this.socket.on('data', (chunk) => {
				var i = 0, line = '', offset = 0;
				receivebuffer += chunk;

				while ( (i = receivebuffer.indexOf('\n', offset)) !== -1) {
					line = receivebuffer.substr(offset, i - offset);
					offset = i + 1;

					if (line.match(/Error/)) {
						this.commandQueue.shift();
						this.sendNextCommand();
					}
					else if (line.match(/ACK/)) {
						if (this.commandQueue.length > 0) {
							var echo = this.commandQueue.shift();
							echo = echo.split('\n');

							if (echo.length > 1) {
								var cmd = echo.shift().trim().split(/:/)[0];
								this.processSmartviewInformation(cmd, echo);
							}

							this.sendNextCommand();
						}
					}
					else {
						this.socket.emit('receiveline', line.toString());
					}
				}

				receivebuffer = receivebuffer.substr(offset);
			});

			this.socket.on('receiveline', (line) => {

				if (this.command === null && line.match(/:/) ) {
					this.command = line;
				}
				else if (this.command !== null && line.length > 0) {
					this.stash.push(line.trim());
				}
				else if (line.length === 0 && this.command !== null) {
					var cmd = this.command.trim().split(/:/)[0];

					this.processSmartviewInformation(cmd, this.stash);

					this.stash = [];
					this.command = null;
					this.sendNextCommand();
				}
				else if (line.length > 0) {
					this.debug("weird response from smartview", line, line.length);
				}
			});
		}
	}

	/**
	 * INTERNAL: Routes incoming data to the appropriate function for processing.
	 *
	 * @param {string} key - the command/data type being passed
	 * @param {Object} data - the collected data
	 * @access protected
	 * @since 1.1.0
	 */
	processSmartviewInformation(key,data) {

		if (key.match(/MONITOR (A|B)/)) {
			this.updateMonitor(key,data);
			//this.initPresets();
		}
		else if (key == 'SMARTVIEW DEVICE') {
			this.updateDevice(key,data);
			this.actions();
			this.initVariables();
			this.initFeedbacks();
			this.initPresets();
		}
		else {
			// TODO: find out more about the smart view from stuff that comes in here
		}
	}

	/**
	 * INTERNAL: Will add a command to the queue to send and send it if cleared to.
	 *
	 * @param {string} cmd - the command
	 * @access protected
	 * @since 1.1.0
	 */
	queueCommand(cmd) {
		this.commandQueue.push(cmd);

		if (this.cts === true) {
			this.sendNextCommand();
		}
	}

	/**
	 * INTERNAL: Send the next command in the queue OR clears to send if none.
	 *
	 * @access protected
	 * @since 1.1.0
	 */
	sendNextCommand() {
		if (this.commandQueue.length > 0) {
			this.socket.send(this.commandQueue[0]);
			this.cts = false;
		}
		else {
			this.cts = true;
		}
	}

	/**
	 * INTERNAL: use model data to define the choices for the dropdowns.
	 *
	 * @access protected
	 * @since 1.1.0
	 */
	setupChoices() {

		this.CHOICES_MONITOR = [];

		if ( this.config.ver == 'smViewDuo' || this.config.ver == 'smScope' ) {
			this.CHOICES_MONITOR = [
				{ id: 'MONITOR A:', label: 'Monitor A', preset: 'MONITOR: A\\n', variable: 'mon_a_' },
				{ id: 'MONITOR B:', label: 'Monitor B', preset: 'MONITOR: B\\n', variable: 'mon_b_' }
			];
		}
		else {
			this.CHOICES_MONITOR = [{ id: 'MONITOR A:', label: 'Monitor A', preset: '', variable: 'mon_a_' }];
		}

		this.AUDIOCHANNEL_FIELD.choices = this.CHOICES_AUDIOCHANNELS;
		this.COLOR_FIELD.choices        = this.CHOICES_COLORS;
		this.INPUT_FIELD.choices        = this.CHOICES_INPUTS;
		this.LUT_FIELD.choices          = this.CHOICES_LUTS;
		this.MONITOR_FIELD.choices      = this.CHOICES_MONITOR;
		this.SCOPETYPE_FIELD.choices    = this.CHOICES_SCOPETYPE;
	}

	/**
	 * Process an updated configuration array.
	 *
	 * @param {Object} config - the new configuration
	 * @access public
	 * @since 1.0.0
	 */
	updateConfig(config) {
		var resetConnection = false;

		if (this.config.host != config.host)
		{
			resetConnection = true;
		}

		this.config = config;

		this.actions();
		this.initVariables();
		this.initFeedbacks();
		this.initPresets();

		if (resetConnection === true || this.socket === undefined) {
			this.initTCP();
		}
	}

	/**
	 * INTERNAL: Updates device data from the SmartView
	 *
	 * @param {string} labeltype - the command/data type being passed
	 * @param {Object} object - the collected data
	 * @access protected
	 * @since 1.1.0
	 */
	updateDevice(labeltype, object) {

		for (var key in object) {
			var parsethis = object[key];
			var a = parsethis.split(/: /);
			var attribute = a.shift();
			var value = a.join(" ");

			switch (attribute) {
				case 'Model':
					if (value.match(/SmartView 4K/)) {
						this.config.ver = 'smView4K';
					}
					else if (value.match(/SmartView HD/)) {
						this.config.ver = 'smView';
					}
					else if (value.match(/SmartView Duo/)) {
						this.config.ver = 'smViewDuo';
					}
					else if (value.match(/SmartScope Duo 4K/)) {
						this.config.ver = 'smScope';
					}
					this.deviceName = value;
					this.log('info', 'Connected to a ' + this.deviceName);
					break;
			}
		}

		this.saveConfig();
	}

	/**
	 * INTERNAL: Updates monitor config based on data from the SmartView
	 *
	 * @param {string} labeltype - the command/data type being passed
	 * @param {Object} object - the collected data
	 * @access protected
	 * @since 1.1.0
	 */
	updateMonitor(labeltype, object) {

		var monitor = this.getMonitor(labeltype);

		for (var key in object) {
			var parsethis = object[key];
			var a = parsethis.split(/: /);
			var attribute = a.shift();
			var value = a.join(" ");

			switch (attribute) {
				case 'Brightness':
					monitor.brightness = parseInt(value);
					this.setVariable('mon_' + monitor.id + '_brightness', monitor.brightness);
					this.checkFeedbacks('bright');
					break;
				case 'Contrast':
					monitor.contrast = parseInt(value);
					this.setVariable('mon_' + monitor.id + '_contrast', monitor.contrast);
					this.checkFeedbacks('cont');
					break;
				case 'Saturation':
					monitor.saturation = parseInt(value);
					this.setVariable('mon_' + monitor.id + '_saturation', monitor.saturation);
					this.checkFeedbacks('sat');
					break;
				case 'Border':
					monitor.border = value;
					this.checkFeedbacks('border');
					break;
				case 'ScopeMode':
					monitor.scopeMode = value;
					this.checkFeedbacks('scopeFunc');
					break;
				case 'AudioChannel':
					monitor.audioChannel = value;
					this.checkFeedbacks('audio');
					break;
				case 'LUT':
					monitor.lut = value;
					this.checkFeedbacks('lut');
					break;
				case 'MonitorInput':
					monitor.monitorInput = value;
					this.checkFeedbacks('input');
					break;
				case 'Identify':
					monitor.identify = (value == 'true');
					this.checkFeedbacks('ident');
					break;
			}
		}
	}
}

exports = module.exports = instance;
