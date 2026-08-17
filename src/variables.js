/**
 * INTERNAL: initialize variables.
 *
 * @access protected
 * @since 1.1.0
 */
export function updateVariables() {
	let variables = {}

	variables['mon_a_brightness'] = { name: 'Monitor A Brightness' }

	if (this.config.ver != 'smView4K') {
		variables['mon_a_contrast'] = { name: 'Monitor A Contrast' }
		variables['mon_a_saturation'] = { name: 'Monitor A Saturation' }
	}

	if (this.config.ver == 'smViewDuo' || this.config.ver == 'smScope') {
		variables['mon_b_brightness'] = { name: 'Monitor B Brightness' }

		if (this.config.ver != 'smView4K') {
			variables['mon_b_contrast'] = { name: 'Monitor B Contrast' }
			variables['mon_b_saturation'] = { name: 'Monitor B Saturation' }
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
