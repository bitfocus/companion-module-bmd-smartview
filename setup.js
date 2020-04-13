module.exports = {

	CHOICES_MODEL: [
		{ id: 'smView',    label: 'SmartView HD'      },
		{ id: 'smView4K',  label: 'SmartView 4K'      },
		{ id: 'smViewDuo', label: 'SmartView Duo'     },
		{ id: 'smScope',   label: 'SmartScope Duo 4K' }
	],
	CHOICES_AUDIOCHANNELS: [
		{ id: '0', label: 'Channels 1 and 2'   },
		{ id: '1', label: 'Channels 3 and 4'   },
		{ id: '2', label: 'Channels 5 and 6'   },
		{ id: '3', label: 'Channels 7 and 8'   },
		{ id: '4', label: 'Channels 9 and 10'  },
		{ id: '5', label: 'Channels 11 and 12' },
		{ id: '6', label: 'Channels 13 and 14' },
		{ id: '7', label: 'Channels 15 and 16' }
	],
	CHOICES_COLORS: [
		{ id: 'none',   label:'None'  },
		{ id: 'red',    label:'Red'   },
		{ id: 'green',  label:'Green' },
		{ id: 'blue',   label:'Blue'  },
		{ id: 'white',  label:'White' }
	],
	CHOICES_INPUTS: [
		{ id: 'SDI A',   label: 'SDI A'   },
		{ id: 'SDI B',   label: 'SDI B'   },
		{ id: 'OPTICAL', label: 'OPTICAL' }
	],
	CHOICES_LUTS: [
		{ id: '0',    label: 'LUT 1'   },
		{ id: '1',    label: 'LUT 2'   },
		{ id: 'NONE', label: 'DISABLE' }
	],
	CHOICES_MONITOR: [
		{ id: 'MONITOR A:', label: 'Monitor A', preset: 'MONITOR: A\\n', variable: 'mon_a_' },
		{ id: 'MONITOR B:', label: 'Monitor B', preset: 'MONITOR: B\\n', variable: 'mon_b_' }
	],
	CHOICES_SCOPETYPE: [
		{ id: 'Picture',       label: 'Picture'       },
		{ id: 'WaveformLuma',  label: 'Waveform'      },
		{ id: 'Vector100',     label: 'Vector - 100%' },
		{ id: 'Vector75',      label: 'Vector - 75%'  },
		{ id: 'ParadeRGB',     label: 'RGB Parade'    },
		{ id: 'ParadeYUV',     label: 'YVU Parade'    },
		{ id: 'Histogram',     label: 'Histogram'     },
		{ id: 'AudioDbfs',     label: 'Audio dBFS'    },
		{ id: 'AudioDbvu',     label: 'Audio dBVU'    }
	],
	BG_COLOR_FIELD: function(defaultColor) {
		return {
			type: 'colorpicker',
			label: 'Background color',
			id: 'bg',
			default: defaultColor
		};
	},
	FG_COLOR_FIELD: function(defaultColor) {
		return {
			type: 'colorpicker',
			label: 'Foreground color',
			id: 'fg',
			default: defaultColor
		};
	},
	AUDIOCHANNEL_FIELD: {
		type:    'dropdown',
		label:   'Channels',
		id:      'val',
		choices: this.CHOICES_AUDIOCHANNELS,
		default: '0'
	},
	COLOR_FIELD: {
		type:    'dropdown',
		label:   'Color',
		id:      'val',
		choices: this.CHOICES_COLORS
	},
	DECREMENT_FIELD: {
		type:    'number',
		label:   'Decrement Amount (1-255)',
		id:      'val',
		min:      1,
		max:      255,
		default:  5,
		required: true,
		range:    false
	},
	INCREMENT_FIELD: {
		type:    'number',
		label:   'Increment Amount (1-255)',
		id:      'val',
		min:      1,
		max:      255,
		default:  5,
		required: true,
		range:    false
	},
	INPUT_FIELD: {
		type:    'dropdown',
		label:   'Input',
		id:      'val',
		choices: this.CHOICES_INPUTS,
		default: 'SDI A'
	},
	LEVEL_FIELD: function(defaultLevel) {
		return {
			type:     'number',
			label:    'Set the level 0-255',
			id:       'val',
			min:      0,
			max:      255,
			default:  defaultLevel,
			required: true,
			range:    true
		};
	},
	LUT_FIELD: {
		type:    'dropdown',
		label:   'LUT',
		id:      'val',
		choices: this.CHOICES_LUTS,
		default: 'NONE'
	},
	MONITOR_FIELD: {
		type:    'dropdown',
		label:   'Select Monitor',
		id:      'mon',
		choices: this.CHOICES_MONITOR,
		default: 'MONITOR A:'
	},
	SCOPETYPE_FIELD: {
		type:    'dropdown',
		label:   'Function',
		id:      'val',
		choices: this.CHOICES_SCOPETYPE,
		default: 'Picture'
	}
}