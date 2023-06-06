import { combineRgb } from '@companion-module/base'
import { Fields } from './setup.js'

/**
 * INTERNAL: initialize feedbacks.
 *
 * @access protected
 * @since 1.1.0
 */
export function updateFeedbacks() {
	let feedbacks = {}

	feedbacks['bright'] = {
		type: 'boolean',
		name: 'Change background color by monitor brightness',
		description: 'If the selected monitor has the brightness specified, change background color of the bank',
		defaultStyle: {
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(255, 255, 0),
		},
		options: [this.MONITOR_FIELD, Fields.Level(255)],
		callback: ({ options }) => {
			return this.getMonitor(options.mon).brightness == options.val
		},
	}

	if (this.config.ver != 'smView4K') {
		feedbacks['cont'] = {
			type: 'boolean',
			name: 'Change background color by monitor contrast',
			description: 'If the selected monitor has the contrast specified, change background color of the bank',
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			options: [this.MONITOR_FIELD, Fields.Level(127)],
			callback: ({ options }) => {
				return this.getMonitor(options.mon).contrast == options.val
			},
		}
		feedbacks['sat'] = {
			type: 'boolean',
			name: 'Change background color by monitor saturation',
			description: 'If the selected monitor has the saturation specified, change background color of the bank',
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			options: [this.MONITOR_FIELD, Fields.Level(127)],
			callback: ({ options }) => {
				return this.getMonitor(options.mon).saturation == options.val
			},
		}
	}

	feedbacks['ident'] = {
		type: 'boolean',
		name: 'Change background color by monitor identify state',
		description: 'If the selected monitor is currently identifying, change background color of the bank',
		defaultStyle: {
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(255, 255, 0),
		},
		options: [this.MONITOR_FIELD],
		callback: ({ options }) => {
			return this.getMonitor(options.mon).identify === true
		},
	}

	feedbacks['border'] = {
		type: 'boolean',
		name: 'Change background color by monitor border color',
		description: 'If the selected monitor has the border color defined, change background color of the bank',
		defaultStyle: {
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(255, 255, 0),
		},
		options: [this.MONITOR_FIELD, Fields.Color],
		callback: ({ options }) => {
			return this.getMonitor(options.mon).border == options.val
		},
	}

	if (this.config.ver == 'smScope') {
		feedbacks['scopeFunc'] = {
			type: 'boolean',
			name: 'Change background color by scope function',
			description: 'If the selected monitor has the scope function active, change background color of the bank',
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			options: [this.MONITOR_FIELD, Fields.ScopeType],
			callback: ({ options }) => {
				return 	this.getMonitor(options.mon).scopeMode == options.val
			},
		}

		feedbacks['audio'] = {
			type: 'boolean',
			name: 'Change background color by audio channels',
			description: 'If the selected monitor has the audio channels active, change background color of the bank',
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			options: [this.MONITOR_FIELD, Fields.AudioChannel],
			callback: ({ options }) => {
				return this.getMonitor(options.mon).audioChannel == options.val
			},
		}
	}

	if (this.config.ver == 'smView4K') {
		feedbacks['lut'] = {
			type: 'boolean',
			name: 'Change background color by LUT',
			description: 'If the selected monitor has the LUT action, change background color of the bank',
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			options: [this.MONITOR_FIELD, Fields.Lut],
			callback: ({ options }) => {
				return this.getMonitor(options.mon).lut == options.val
			},
		}

		feedbacks['input'] = {
			type: 'boolean',
			name: 'Change background color by input',
			description: 'If the selected monitor has the input active, change background color of the bank',
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			options: [this.MONITOR_FIELD, Fields.Input],
			callback: ({ options }) => {
				return this.getMonitor(options.mon).monitorInput == options.val
			},
		}
	}

	this.setFeedbackDefinitions(feedbacks)
}
