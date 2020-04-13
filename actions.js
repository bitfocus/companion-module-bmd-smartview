module.exports = {

	/**
	 * INTERNAL: Get the available actions.
	 *
	 * @returns {Object[]} the available actions
	 * @access protected
	 * @since 1.1.0
	 */
	getActions() {
		var actions = {};

		actions['bright'] = {
			label: 'Brightness',
			options: [
				this.MONITOR_FIELD,
				this.LEVEL_FIELD(255)
			]
		};
		actions['brightUp'] = {
			label: 'Brightness (Inc)',
			options: [
				this.MONITOR_FIELD,
				this.INCREMENT_FIELD
			]
		};
		actions['brightDown'] = {
			label: 'Brightness (Dec)',
			options: [
				this.MONITOR_FIELD,
				this.DECREMENT_FIELD
			]
		};

		if (this.config.ver != 'smView4K') {
			actions['cont'] = {
				label: 'Contrast',
				options: [
					this.MONITOR_FIELD,
					this.LEVEL_FIELD(127)
				]
			};
			actions['contUp'] = {
				label: 'Contrast (Inc)',
				options: [
					this.MONITOR_FIELD,
					this.INCREMENT_FIELD
				]
			};
			actions['contDown'] = {
				label: 'Contrast (Dec)',
				options: [
					this.MONITOR_FIELD,
					this.DECREMENT_FIELD
				]
			};

			actions['sat'] = {
				label: 'Saturation',
				options: [
					this.MONITOR_FIELD,
					this.LEVEL_FIELD(127)
				]
			};
			actions['satUp'] = {
				label: 'Saturation (Inc)',
				options: [
					this.MONITOR_FIELD,
					this.INCREMENT_FIELD
				]
			};
			actions['satDown'] = {
				label: 'Saturation (Dec)',
				options: [
					this.MONITOR_FIELD,
					this.DECREMENT_FIELD
				]
			};
		}

		actions['ident'] = {
			label: 'Identify 15 Sec',
			options: [
				this.MONITOR_FIELD
			]
		};

		actions['border'] = {
			label: 'Border',
			options: [
				this.MONITOR_FIELD,
				this.COLOR_FIELD
			]
		};

		if (this.config.ver == 'smScope') {
			actions['scopeFunc'] = {
				label: 'Scope Function',
				options: [
					this.MONITOR_FIELD,
					this.SCOPETYPE_FIELD
				]
			};

			actions['audio'] = {
				label: 'Audio Channels',
				options: [
					this.MONITOR_FIELD,
					this.AUDIOCHANNEL_FIELD
				]
			};
		}

		if (this.config.ver == 'smView4K') {
			actions['lut'] = {
				label: 'Set LUT',
				options: [
					this.MONITOR_FIELD,
					this.LUT_FIELD
				]
			};

			actions['input'] = {
				label: 'Select Input',
				options: [
					this.MONITOR_FIELD,
					this.INPUT_FIELD
				]
			};
		}

		return actions;
	}
}