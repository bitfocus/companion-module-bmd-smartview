// BlackMagic Design SmartView / SmartScope

var tcp = require('../../tcp');
var instance_skel = require('../../instance_skel');
var debug;
var log;


function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);
	self.MONITOR = [
		{id: 'MONITOR A:', label: 'Monitor A'},
		{id: 'MONITOR B:', label: 'Monitor B'}
	];

	self.SCOPETYPE = [
		{id: 'AudioDbfs',     label: 'AudioDbfs'},
		{id: 'AudioDbvu',     label: 'AudioDbvu'},
		{id: 'Histogram',     label: 'Histogram'},
		{id: 'ParadeRGB',     label: 'ParadeRGB'},
		{id: 'ParadeYUV',     label: 'ParadeYUV'},
		{id: 'Picture',       label: 'Picture'},
		{id: 'Vector100',     label: 'Vector100'},
		{id: 'Vector75',      label: 'Vector75'},
		{id: 'Vector75',      label: 'Vector75'},
		{id: 'WaveformLuma',  label: 'WaveformLuma'}
	];
	self.AUDIOCHANNELS = [
		{ id: '0', label: 'Channels 1 and 2'},
		{ id: '1', label: 'Channels 3 and 4'},
		{ id: '2', label: 'Channels 5 and 6'},
		{ id: '3', label: 'Channels 7 and 8'},
		{ id: '4', label: 'Channels 9 and 10'},
		{ id: '5', label: 'Channels 11 and 12'},
		{ id: '6', label: 'Channels 13 and 14'},
		{ id: '7', label: 'Channels 15 and 16'}
	];
	self.COLORS = [
		{ id: 'none',   label:'None'},
		{ id: 'red',    label:'Red'},
		{ id: 'green',  label:'Green'},
		{ id: 'blue',   label:'Blue'},
		{ id: 'white',  label:'White'}
	];
	self.LUTS = [
	 { id: '0',    label: 'LUT 1'},
	 { id: '1',    label: 'LUT 2'},
	 { id: 'NONE', label: 'DISABLE'},
 ];

	self.SMARTSCOPE = {
		'bright':     {
			label: 'Brightness',
			options: [
				{
					type:    'dropdown',
					label:   'Select Monitor',
					id:      'mon',
					choices: self.MONITOR
				},
				{
					type:    'textinput',
					label:   'Set the level 0-255',
					id:      'val',
					default: '127'
				}
			]
		},
		'cont':     {
			label:       'Contrast',
			options: [
				{
					type:    'dropdown',
					label:   'Select Monitor',
					id:      'mon',
					choices: self.MONITOR

				},
				{
					type:    'textinput',
					label:   'Set the level 0-255',
					id:      'val',
					default: '127'
				}
			]
		},
		'sat':   {
			label:       'Saturation',
			options: [
				{
					type:    'dropdown',
					label:   'Select Monitor',
					id:      'mon',
					choices: self.MONITOR
				},
				{
					type:    'textinput',
					label:   'Set the level 0-255',
					id:      'val',
					default: '127'
				}
			]
		},
		'ident':   {
			label:       'Identify 15 Sec',
			options: [
				{
					type:    'dropdown',
					label:   'Select Monitor',
					id:      'mon',
					choices: self.MONITOR
				}
			]
		},
		'border':   {
			label:       'Border',
			options: [
				{
					type:    'dropdown',
					label:   'Select Monitor',
					id:      'mon',
					choices: self.MONITOR
				},
				{
					type:    'dropdown',
					label:   'Color',
					id:      'col',
					choices: self.COLORS
				}
			]
		},
		'scopeFunc':   {
			label:       'Scope Function',
			options: [
				{
					type:    'dropdown',
					label:   'Select Monitor',
					id:      'mon',
					choices: self.MONITOR
				},
				{
					type:    'dropdown',
					label:   'Function',
					id:      'val',
					choices: self.SCOPETYPE
				}
			]
		},
		'audio':   {
			label:       'Audio Channels',
			options: [
				{
					type:    'dropdown',
					label:   'Select Monitor',
					id:      'mon',
					choices: self.MONITOR
				},
				{
					type:    'dropdown',
					label:   'Channels',
					id:      'val',
					choices: self.AUDIOCHANNELS
				}
			]
		},
		'lut':   {
			label:       'Set LUT',
			options: [
				{
					type:    'dropdown',
					label:   'Select Monitor',
					id:      'mon',
					choices: self.MONITOR
				},
				{
					type:    'dropdown',
					label:   'LUT',
					 id:      'val',
					 choices: self.LUTS
				}
			]
		},
	};


	self.SMARTVIEW = Object.assign({}, self.SMARTSCOPE);
	delete self.SMARTVIEW.lut;
	delete self.SMARTVIEW.audio;
	delete self.SMARTVIEW.scopeFunc;

	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;
	self.config = config;

	self.init_tcp();
	self.actions(); // export actions
};



instance.prototype.init = function() {
	var self = this;
	debug = self.debug;
	log = self.log;


	self.status(1,'Connecting'); // status ok!
	self.init_tcp();
	self.actions(); // export actions
};

instance.prototype.init_tcp = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
		delete self.socket;
	};

	if (self.config.host) {
		self.socket = new tcp(self.config.host, 9992);

		self.socket.on('status_change', function (status, message) {
			self.status(status, message);
		});

		self.socket.on('error', function (err) {
			debug("Network error", err);
			self.status(self.STATE_ERROR, err);
			self.log('error',"Network error: " + err.message);
		});

		self.socket.on('connect', function () {
			self.status(self.STATE_OK);
			debug("Connected");
		})

		self.socket.on('data', function (data) {});
	}
};


// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 6,
			regex: self.REGEX_IP
		},
		{
			type: 'dropdown',
			id: 'ver',
			label: 'SmartView / Smart Scope Version',
			width: 6,
			choices: [
				{ id: 'smViewDuo', label: 'SmartView Duo' },
				{ id: 'smView',    label: 'SmartView' },
				{ id: 'smScope',   label: 'SmartScope Duo' },
			]
		}
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
	}

	debug("destroy", self.id);;
};




instance.prototype.actions = function(system) {
	var self = this;

	if (self.config.ver == 'smViewDuo' || 'smView') {
		self.system.emit('instance_actions', self.id, self.SMARTVIEW );
	}
	if (self.config.ver == 'smScope') {
		self.system.emit('instance_actions', self.id, self.SMARTSCOPE );
	}

};

	instance.prototype.action = function(action) {
		var self = this;
		var opt = action.options

		switch (action.action) {

			case 'bright':
				cmd = opt.mon+'\nBrightness: '+ opt.val+'\n';
				break;

			case 'cont':
				cmd = opt.mon+'\nContrast: '+ opt.val+'\n';
				break;

			case 'sat':
				cmd = opt.mon+'\nSaturation: '+ opt.val+'\n';
				break;

			case 'ident':
				cmd = opt.mon+'\nIdentify: true\n';
				break;

			case 'border':
				cmd = opt.mon+'\nBorder: '+ opt.col+'\n';
				break;

			case 'scopeFunc':
				cmd = opt.mon+'\nScopeMode: '+ opt.val+'\n';
				break;

			case 'audio':
				cmd = opt.mon+'\nAudioChannel: '+ opt.val+'\n';
				break;

			case 'lut':
				cmd = opt.mon+'\nLUT: '+ opt.val+'\n'
				break;

	};
	if (cmd !== undefined) {

		debug('sending ',cmd);

		if (self.socket !== undefined && self.socket.connected) {
			self.socket.send(cmd + "\n");
			debug('to',self.config.host)
		} else {
			debug('Socket not connected :(');
			}
		};
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
