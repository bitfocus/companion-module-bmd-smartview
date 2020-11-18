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
	]
}