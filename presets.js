module.exports = {

	/**
	 * INTERNAL: initialize presets.
	 *
	 * @access protected
	 * @since 1.1.0
	 */
	initPresets () {
		var presets = [];

		for (let monID in this.CHOICES_MONITOR) {
			let monitor  = this.CHOICES_MONITOR[monID].id;
			let lbl      = this.CHOICES_MONITOR[monID].preset;
			let variable = this.CHOICES_MONITOR[monID].variable;

			for (let pt in this.PRESETS_STATES) {
				let pv = this.PRESETS_STATES[pt];

				if ( (pv.action == 'cont' || pv.action == 'sat') && this.config.ver == 'smView4K') {
					continue;
				}
				else if ( (pv.action == 'scopeFunc' || pv.action == 'audio') && this.config.ver != 'smScope') {
					continue;
				}
				else if ( (pv.action == 'lut' || pv.action == 'input') && this.config.ver != 'smView4K') {
					continue;
				}

				if (pv.choices != null) {
					for (let id in pv.choices) {
						let choice = pv.choices[id];

						presets.push({
							category: pv.group,
							label: lbl + pv.label + choice.label,
							bank: {
								style: 'text',
								text: lbl + pv.label + choice.label,
								size: '7',
								color: this.rgb(255,255,255),
								bgcolor: this.rgb(0,0,0)
							},
							actions: [
								{
									action: pv.action,
									options: {
										mon: monitor,
										val: choice.id
									}
								}
							],
							feedbacks: [
								{
									type: pv.action,
									options: {
										bg: this.rgb(255,255,0),
										fg: this.rgb(0,0,0),
										mon: monitor,
										val: choice.id
									}
								}
							]
						});
					}
				}
				else {
					presets.push({
						category: pv.group,
						label: lbl + pv.label,
						bank: {
							style: 'text',
							text: lbl + pv.label,
							size: '14',
							color: this.rgb(255,255,255),
							bgcolor: this.rgb(0,0,0)
						},
						actions: [
							{
								action: pv.action,
								options: {
									mon: monitor
								}
							}
						],
						feedbacks: [
							{
								type: pv.action,
								options: {
									bg: this.rgb(255,255,0),
									fg: this.rgb(0,0,0),
									mon: monitor
								}
							}
						]
					});
				}
			}

			for (let pt in this.PRESETS_VALUES) {
				let pv = this.PRESETS_VALUES[pt];

				if ( (pv.group == 'Contrast' || pv.group == 'Saturation') && this.config.ver == 'smView4K') {
					continue;
				}

				let varParts = pv.label.split('_');
				let varLabel = lbl + varParts.join(variable);

				presets.push({
					category: pv.group,
					label: varLabel,
					bank: {
						style: 'text',
						text: varLabel,
						size: '7',
						color: this.rgb(255,255,255),
						bgcolor: this.rgb(0,0,0)
					},
					actions: [
						{
							action: pv.action,
							options: {
								mon: monitor,
								val: 1
							}
						}
					]
				});
			}
		}

		this.setPresetDefinitions(presets);
	}
}