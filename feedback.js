module.exports = {

	/**
	 * INTERNAL: initialize feedbacks.
	 *
	 * @access protected
	 * @since 1.1.0
	 */
	initFeedbacks() {
		// feedbacks
		var feedbacks = {};

		feedbacks['bright'] = {
			label: 'Change background color by monitor brightness',
			description: 'If the selected monitor has the brightness specified, change background color of the bank',
			options: [
				this.FG_COLOR_FIELD(this.rgb(0,0,0)),
				this.BG_COLOR_FIELD(this.rgb(255,255,0)),
				this.MONITOR_FIELD,
				this.LEVEL_FIELD(255)
			],
			callback: (feedback, bank) => {
				if (this.getMonitor(feedback.options.mon).brightness == feedback.options.val) {
					return {
						color: feedback.options.fg,
						bgcolor: feedback.options.bg
					};
				}
			}
		};

		if (this.config.ver != 'smView4K') {
			feedbacks['cont'] = {
				label: 'Change background color by monitor contrast',
				description: 'If the selected monitor has the contrast specified, change background color of the bank',
				options: [
					this.FG_COLOR_FIELD(this.rgb(0,0,0)),
					this.BG_COLOR_FIELD(this.rgb(255,255,0)),
					this.MONITOR_FIELD,
					this.LEVEL_FIELD(127)
				],
				callback: (feedback, bank) => {
					if (this.getMonitor(feedback.options.mon).contrast == feedback.options.val) {
						return {
							color: feedback.options.fg,
							bgcolor: feedback.options.bg
						};
					}
				}
			};
			feedbacks['sat'] = {
				label: 'Change background color by monitor saturation',
				description: 'If the selected monitor has the saturation specified, change background color of the bank',
				options: [
					this.FG_COLOR_FIELD(this.rgb(0,0,0)),
					this.BG_COLOR_FIELD(this.rgb(255,255,0)),
					this.MONITOR_FIELD,
					this.LEVEL_FIELD(127)
				],
				callback: (feedback, bank) => {
					if (this.getMonitor(feedback.options.mon).saturation == feedback.options.val) {
						return {
							color: feedback.options.fg,
							bgcolor: feedback.options.bg
						};
					}
				}
			};
		}

		feedbacks['ident'] = {
			label: 'Change background color by monitor identify state',
			description: 'If the selected monitor is currently identifying, change background color of the bank',
			options: [
				this.FG_COLOR_FIELD(this.rgb(0,0,0)),
				this.BG_COLOR_FIELD(this.rgb(255,255,0)),
				this.MONITOR_FIELD
			],
			callback: (feedback, bank) => {
				if (this.getMonitor(feedback.options.mon).identify === true) {
					return {
						color: feedback.options.fg,
						bgcolor: feedback.options.bg
					};
				}
			}
		};


		feedbacks['border'] = {
			label: 'Change background color by monitor border color',
			description: 'If the selected monitor has the border color defined, change background color of the bank',
			options: [
				this.FG_COLOR_FIELD(this.rgb(0,0,0)),
				this.BG_COLOR_FIELD(this.rgb(255,255,0)),
				this.MONITOR_FIELD,
				this.COLOR_FIELD
			],
			callback: (feedback, bank) => {
				if (this.getMonitor(feedback.options.mon).border == feedback.options.val) {
					return {
						color: feedback.options.fg,
						bgcolor: feedback.options.bg
					};
				}
			}
		};

		if (this.config.ver == 'smScope') {
			feedbacks['scopeFunc'] = {
				label: 'Change background color by scope function',
				description: 'If the selected monitor has the scope function active, change background color of the bank',
				options: [
					this.FG_COLOR_FIELD(this.rgb(0,0,0)),
					this.BG_COLOR_FIELD(this.rgb(255,255,0)),
					this.MONITOR_FIELD,
					this.SCOPETYPE_FIELD
				],
				callback: (feedback, bank) => {
					if (this.getMonitor(feedback.options.mon).scopeMode == feedback.options.val) {
						return {
							color: feedback.options.fg,
							bgcolor: feedback.options.bg
						};
					}
				}
			};

			feedbacks['audio'] = {
				label: 'Change background color by audio channels',
				description: 'If the selected monitor has the audio channels active, change background color of the bank',
				options: [
					this.FG_COLOR_FIELD(this.rgb(0,0,0)),
					this.BG_COLOR_FIELD(this.rgb(255,255,0)),
					this.MONITOR_FIELD,
					this.AUDIOCHANNEL_FIELD
				],
				callback: (feedback, bank) => {
					if (this.getMonitor(feedback.options.mon).audioChannel == feedback.options.val) {
						return {
							color: feedback.options.fg,
							bgcolor: feedback.options.bg
						};
					}
				}
			};
		}

		if (this.config.ver == 'smView4K') {
			feedbacks['lut'] = {
				label: 'Change background color by LUT',
				description: 'If the selected monitor has the LUT action, change background color of the bank',
				options: [
					this.FG_COLOR_FIELD(this.rgb(0,0,0)),
					this.BG_COLOR_FIELD(this.rgb(255,255,0)),
					this.MONITOR_FIELD,
					this.LUT_FIELD
				],
				callback: (feedback, bank) => {
					if (this.getMonitor(feedback.options.mon).lut == feedback.options.val) {
						return {
							color: feedback.options.fg,
							bgcolor: feedback.options.bg
						};
					}
				}
			};

			feedbacks['input'] = {
				label: 'Change background color by input',
				description: 'If the selected monitor has the input active, change background color of the bank',
				options: [
					this.FG_COLOR_FIELD(this.rgb(0,0,0)),
					this.BG_COLOR_FIELD(this.rgb(255,255,0)),
					this.MONITOR_FIELD,
					this.INPUT_FIELD
				],
				callback: (feedback, bank) => {
					if (this.getMonitor(feedback.options.mon).monitorInput == feedback.options.val) {
						return {
							color: feedback.options.fg,
							bgcolor: feedback.options.bg
						};
					}
				}
			};
		}

		this.setFeedbackDefinitions(feedbacks);
	}
}