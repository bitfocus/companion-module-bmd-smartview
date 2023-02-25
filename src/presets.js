import { combineRgb } from '@companion-module/base'
import { Presets } from './setup.js'

/**
 * INTERNAL: initialize presets.
 *
 * @access protected
 * @since 1.1.0
 */
export function updatePresets() {
	let presets = {}

	for (let monID in this.CHOICES_MONITOR) {
		let monitor = this.CHOICES_MONITOR[monID].id
		let lbl = this.CHOICES_MONITOR[monID].preset
		let variable = this.CHOICES_MONITOR[monID].variable

		for (let pt in Presets.States) {
			let pv = Presets.States[pt]

			if ((pv.action == 'cont' || pv.action == 'sat') && this.config.ver == 'smView4K') {
				continue
			} else if ((pv.action == 'scopeFunc' || pv.action == 'audio') && this.config.ver != 'smScope') {
				continue
			} else if ((pv.action == 'lut' || pv.action == 'input') && this.config.ver != 'smView4K') {
				continue
			}

			if (pv.choices != null) {
				for (let id in pv.choices) {
					let choice = pv.choices[id]

					presets[`mon_${monitor}_${pv.action}_${choice.id}`] = {
						type: 'button',
						category: pv.group,
						name: lbl + pv.label + choice.label,
						style: {
							text: lbl + pv.label + choice.label,
							size: '7',
							color: combineRgb(255, 255, 255),
							bgcolor: combineRgb(0, 0, 0),
						},
						steps: [
							{
								down: [
									{
										actionId: pv.action,
										options: {
											mon: monitor,
											val: choice.id,
										},
									},
								],
								up: [],
							},
						],
						feedbacks: [
							{
								feedbackId: pv.action,
								options: {
									bg: combineRgb(255, 255, 0),
									fg: combineRgb(0, 0, 0),
									mon: monitor,
									val: choice.id,
								},
							},
						],
					}
				}
			} else {
				presets[`mon_${monitor}_${pv.action}`] = {
					type: 'button',
					category: pv.group,
					name: lbl + pv.label,
					style: {
						text: lbl + pv.label,
						size: '14',
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(0, 0, 0),
					},
					steps: [
						{
							down: [
								{
									actionId: pv.action,
									options: {
										mon: monitor,
									},
								},
							],
							up: [],
						},
					],
					feedbacks: [
						{
							feedbackId: pv.action,
							options: {
								bg: combineRgb(255, 255, 0),
								fg: combineRgb(0, 0, 0),
								mon: monitor,
							},
						},
					],
				}
			}
		}

		for (let pt in Presets.Values) {
			let pv = Presets.Values[pt]

			if ((pv.group == 'Contrast' || pv.group == 'Saturation') && this.config.ver == 'smView4K') {
				continue
			}

			let varParts = pv.label.split('_')
			let varLabel = lbl + varParts.join(variable)

			presets[`mon_${monitor}_${pv.action}`] = {
				type: 'button',
				category: pv.group,
				name: varLabel,
				style: {
					text: varLabel,
					size: '7',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [
							{
								actionId: pv.action,
								options: {
									mon: monitor,
									val: 1,
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			}
		}
	}

	this.setPresetDefinitions(presets)
}
