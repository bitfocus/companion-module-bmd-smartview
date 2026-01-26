import { combineRgb } from '@companion-module/base'
import { Fields } from './setup.js'

/**
 * INTERNAL: initialize feedbacks.
 *
 * @access protected
 * @since 1.1.0
 */

const styles = {
	blackOnYellow: {
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(255, 255, 0),
		}
}

export function updateFeedbacks() {
	let feedbacks = {}

	feedbacks['bright'] = {
		type: 'boolean',
		name: 'Brightness',
		description: 'True if the selected monitor has the brightness specified',
		defaultStyle: styles.blackOnYellow,
		options: [this.MONITOR_FIELD, Fields.Level(255)],
		callback: ({ options }) => {
			return this.getMonitor(options.mon).brightness == options.val
		},
	}

	if (this.config.ver != 'smView4K') {
		feedbacks['cont'] = {
			type: 'boolean',
			name: 'Contrast',
			description: 'True if the selected monitor has the contrast specified',
			defaultStyle: styles.blackOnYellow,
			options: [this.MONITOR_FIELD, Fields.Level(127)],
			callback: ({ options }) => {
				return this.getMonitor(options.mon).contrast == options.val
			},
		}
		feedbacks['sat'] = {
			type: 'boolean',
			name: 'Saturation',
			description: 'True if the selected monitor has the saturation specified',
			defaultStyle: styles.blackOnYellow,
			options: [this.MONITOR_FIELD, Fields.Level(127)],
			callback: ({ options }) => {
				return this.getMonitor(options.mon).saturation == options.val
			},
		}
	}

	feedbacks['ident'] = {
		type: 'boolean',
		name: 'Identify state',
		description: 'True if the selected monitor is currently identifying',
		defaultStyle: styles.blackOnYellow,
		options: [this.MONITOR_FIELD],
		callback: ({ options }) => {
			return this.getMonitor(options.mon).identify === true
		},
	}

	feedbacks['border'] = {
		type: 'boolean',
		name: 'Border color',
		description: 'True if the selected monitor has the border color defined',
		defaultStyle: styles.blackOnYellow,
		options: [this.MONITOR_FIELD, Fields.Color],
		callback: ({ options }) => {
			return this.getMonitor(options.mon).border == options.val
		},
	}

	feedbacks['borderVal'] = {
		type: 'value',
		name: 'Border color - Value',
		options: [this.MONITOR_FIELD],
		callback: ({ options }) => {
			return this.getMonitor(options.mon).border
		},
	}

	if (this.config.ver == 'smScope') {
		feedbacks['scopeFunc'] = {
			type: 'boolean',
			name: 'Scope function',
			description: 'True if the selected monitor has the scope function active',
			defaultStyle: styles.blackOnYellow,
			options: [this.MONITOR_FIELD, Fields.ScopeType],
			callback: ({ options }) => {
				return this.getMonitor(options.mon).scopeMode == options.val
			},
		}

		feedbacks['scopeFuncVal'] = {
			type: 'value',
			name: 'Scope function - Value',
			options: [this.MONITOR_FIELD],
			callback: ({ options }) => {
				return this.getMonitor(options.mon).scopeMode
			},
		}

		feedbacks['audio'] = {
			type: 'boolean',
			name: 'Audio channels',
			description: 'True if the selected monitor has the audio channels active',
			defaultStyle: styles.blackOnYellow,
			options: [this.MONITOR_FIELD, Fields.AudioChannel],
			callback: ({ options }) => {
				return this.getMonitor(options.mon).audioChannel == options.val
			},
		}

	}

	if (this.config.ver == 'smView4K') {
		feedbacks['lut'] = {
			type: 'boolean',
			name: 'LUT LUT',
			description: 'True if the selected monitor has the LUT action',
			defaultStyle: styles.blackOnYellow,
			options: [this.MONITOR_FIELD, Fields.Lut],
			callback: ({ options }) => {
				return this.getMonitor(options.mon).lut == options.val
			},
		}


		feedbacks['input'] = {
			type: 'boolean',
			name: 'Input',
			description: 'True if the selected monitor has the input active',
			defaultStyle: styles.blackOnYellow,
			options: [this.MONITOR_FIELD, Fields.Input],
			callback: ({ options }) => {
				return this.getMonitor(options.mon).monitorInput == options.val
			},
		}

		feedbacks['inputVal'] = {
			type: 'value',
			name: 'Input - Value',
			options: [this.MONITOR_FIELD],
			callback: ({ options }) => {
				return this.getMonitor(options.mon).monitorInput
			},
		}
	}

	this.setFeedbackDefinitions(feedbacks)
}
