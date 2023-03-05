/**
 * INTERNAL: initialize variables.
 *
 * @access protected
 * @since 1.1.0
 */
export function updateVariables() {
	let variables = []

	variables.push({ name: 'Monitor A Brightness', variableId: 'mon_a_brightness' })

	if (this.config.ver != 'smView4K') {
		variables.push({ name: 'Monitor A Contrast', variableId: 'mon_a_contrast' })
		variables.push({ name: 'Monitor A Saturation', variableId: 'mon_a_saturation' })
	}

	if (this.config.ver == 'smViewDuo' || this.config.ver == 'smScope') {
		variables.push({ name: 'Monitor B Brightness', variableId: 'mon_b_brightness' })

		if (this.config.ver != 'smView4K') {
			variables.push({ name: 'Monitor B Contrast', variableId: 'mon_b_contrast' })
			variables.push({ name: 'Monitor B Saturation', variableId: 'mon_b_saturation' })
		}
	}

	this.setVariableDefinitions(variables)

	this.setVariableValues({ mon_a_brightness: this.getMonitor('A').brightness })

	if (this.config.ver != 'smView4K') {
		this.setVariableValues({ mon_a_contrast: this.getMonitor('A').contrast })
		this.setVariableValues({ mon_a_saturation: this.getMonitor('A').saturation })
	}

	if (this.config.ver == 'smViewDuo' || this.config.ver == 'smScope') {
		this.setVariableValues({ mon_b_brightness: this.getMonitor('B').brightness })

		if (this.config.ver != 'smView4K') {
			this.setVariableValues({ mon_b_contrast: this.getMonitor('B').contrast })
			this.setVariableValues({ mon_b_saturation: this.getMonitor('B').saturation })
		}
	}
}
