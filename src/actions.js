import { Fields, getValue } from './setup.js'

/**
 * INTERNAL: Get the available actions.
 *
 * @access protected
 * @since 1.1.0
 */
export function updateActions() {
	let actions = {}

	this.setupChoices()

	actions['bright'] = {
		name: 'Brightness',
		options: [this.MONITOR_FIELD, Fields.Level(255)],
		callback: ({ options }) => {
			this.queueCommand(`${options.mon}\nBrightness: ${options.val}`)
		},
	}
	actions['brightUp'] = {
		name: 'Brightness (Inc)',
		options: [this.MONITOR_FIELD, Fields.Increment],
		callback: ({ options }) => {
			let mon = this.getMonitor(options.mon)
			this.queueCommand(`${options.mon}\nBrightness: ${getValue(mon.brightness, options.val)}`)
		},
	}
	actions['brightDown'] = {
		name: 'Brightness (Dec)',
		options: [this.MONITOR_FIELD, Fields.Decrement],
		callback: ({ options }) => {
			let mon = this.getMonitor(options.mon)
			this.queueCommand(`${options.mon}\nBrightness: ${getValue(mon.brightness, 0 - options.val)}`)
		},
	}

	if (this.config.ver != 'smView4K') {
		actions['cont'] = {
			name: 'Contrast',
			options: [this.MONITOR_FIELD, Fields.Level(127)],
			callback: ({ options }) => {
				this.queueCommand(`${options.mon}\nContrast: ${options.val}`)
			},
		}
		actions['contUp'] = {
			name: 'Contrast (Inc)',
			options: [this.MONITOR_FIELD, Fields.Increment],
			callback: ({ options }) => {
				let mon = this.getMonitor(options.mon)
				this.queueCommand(`${options.mon}\nContrast: ${getValue(mon.contrast, options.val)}`)
			},
		}
		actions['contDown'] = {
			name: 'Contrast (Dec)',
			options: [this.MONITOR_FIELD, Fields.Decrement],
			callback: ({ options }) => {
				let mon = this.getMonitor(options.mon)
				this.queueCommand(`${options.mon}\nContrast: ${getValue(mon.contrast, 0 - options.val)}`)
			},
		}

		actions['sat'] = {
			name: 'Saturation',
			options: [this.MONITOR_FIELD, Fields.Level(127)],
			callback: ({ options }) => {
				this.queueCommand(`${options.mon}\nSaturation: ${options.val}`)
			},
		}
		actions['satUp'] = {
			name: 'Saturation (Inc)',
			options: [this.MONITOR_FIELD, Fields.Increment],
			callback: ({ options }) => {
				let mon = this.getMonitor(options.mon)
				this.queueCommand(`${options.mon}\nSaturation: ${getValue(mon.saturation, options.val)}`)
			},
		}
		actions['satDown'] = {
			name: 'Saturation (Dec)',
			options: [this.MONITOR_FIELD, Fields.Decrement],
			callback: ({ options }) => {
				let mon = this.getMonitor(options.mon)
				this.queueCommand(`${options.mon}\nSaturation: ${getValue(mon.saturation, 0 - options.val)}`)
			},
		}
	}

	actions['ident'] = {
		name: 'Identify 15 Sec',
		options: [this.MONITOR_FIELD],
		callback: ({ options }) => {
			this.queueCommand(`${options.mon}\nIdentify: true`)
		},
	}

	actions['border'] = {
		name: 'Border',
		options: [this.MONITOR_FIELD, Fields.Color],
		callback: ({ options }) => {
			this.queueCommand(`${options.mon}\nBorder: ${options.val}`)
		},
	}

	if (this.config.ver == 'smScope') {
		actions['scopeFunc'] = {
			name: 'Scope Function',
			options: [this.MONITOR_FIELD, Fields.ScopeType],
			callback: ({ options }) => {
				let mon = this.getMonitor(options.mon)
				this.queueCommand(`${options.mon}\nScopeMode: ${options.val}`)
			},
		}

		actions['audio'] = {
			name: 'Audio Channels',
			options: [this.MONITOR_FIELD, Fields.AudioChannel],
			callback: ({ options }) => {
				this.queueCommand(`${options.mon}\nAudioChannel: ${options.val}`)
			},
		}
	}

	if (this.config.ver == 'smView4K') {
		actions['lut'] = {
			name: 'Set LUT',
			options: [this.MONITOR_FIELD, Fields.Lut],
			callback: ({ options }) => {
				this.queueCommand(`${options.mon}\nLUT: ${options.val}`)
			},
		}

		actions['input'] = {
			name: 'Select Input',
			options: [this.MONITOR_FIELD, Fields.Input],
			callback: ({ options }) => {
				this.queueCommand(`${options.mon}\nMonitorInput: ${options.val}`)
			},
		}
	}

	this.setActionDefinitions(actions)
}
