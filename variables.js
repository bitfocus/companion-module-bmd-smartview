module.exports = {

	/**
	 * INTERNAL: initialize variables.
	 *
	 * @access protected
	 * @since 1.1.0
	 */
	initVariables() {
		var variables = [];

		variables.push({ label: 'Monitor A Brightness', name: 'mon_a_brightness' });
		variables.push({ label: 'Monitor A Contrast',   name: 'mon_a_contrast' });
		variables.push({ label: 'Monitor A Saturation', name: 'mon_a_saturation' });

		this.setVariable('mon_a_brightness', this.getMonitor('A').brightness);
		this.setVariable('mon_a_contrast',   this.getMonitor('A').contrast);
		this.setVariable('mon_a_saturation', this.getMonitor('A').saturation);

		if ( this.config.ver == 'smViewDuo' || this.config.ver == 'smScope' ) {
			variables.push({ label: 'Monitor B Brightness', name: 'mon_b_brightness' });
			variables.push({ label: 'Monitor B Contrast',   name: 'mon_b_contrast' });
			variables.push({ label: 'Monitor B Saturation', name: 'mon_b_saturation' });

			this.setVariable('mon_b_brightness', this.getMonitor('B').brightness);
			this.setVariable('mon_b_contrast',   this.getMonitor('B').contrast);
			this.setVariable('mon_b_saturation', this.getMonitor('B').saturation);
		}

		this.setVariableDefinitions(variables);
	}
}