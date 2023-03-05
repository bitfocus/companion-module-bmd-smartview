/**
 * INTERNAL: returns a value between 0 and 255 based on change.
 *
 * @param {number} base - the base value to modify
 * @param {number} offset - the +/- value
 * @returns {number} 0-255
 * @access protected
 * @since 1.1.0
 */
export function getValue(base, offset) {
	let out = base + offset

	if (out > 255) {
		out = 255
	} else if (out < 0) {
		out = 0
	}

	return out
}

export const Choices = {
	Model: [
		{ id: 'smView', label: 'SmartView HD' },
		{ id: 'smView4K', label: 'SmartView 4K' },
		{ id: 'smViewDuo', label: 'SmartView Duo' },
		{ id: 'smScope', label: 'SmartScope Duo 4K' },
	],
	AudioChannels: [
		{ id: '0', label: 'Channels 1 and 2' },
		{ id: '1', label: 'Channels 3 and 4' },
		{ id: '2', label: 'Channels 5 and 6' },
		{ id: '3', label: 'Channels 7 and 8' },
		{ id: '4', label: 'Channels 9 and 10' },
		{ id: '5', label: 'Channels 11 and 12' },
		{ id: '6', label: 'Channels 13 and 14' },
		{ id: '7', label: 'Channels 15 and 16' },
	],
	Colors: [
		{ id: 'none', label: 'None' },
		{ id: 'red', label: 'Red' },
		{ id: 'green', label: 'Green' },
		{ id: 'blue', label: 'Blue' },
		{ id: 'white', label: 'White' },
	],
	Inputs: [
		{ id: 'SDI A', label: 'SDI A' },
		{ id: 'SDI B', label: 'SDI B' },
		{ id: 'OPTICAL', label: 'OPTICAL' },
	],
	Luts: [
		{ id: '0', label: 'LUT 1' },
		{ id: '1', label: 'LUT 2' },
		{ id: 'NONE', label: 'DISABLE' },
	],
	ScopeType: [
		{ id: 'Picture', label: 'Picture' },
		{ id: 'WaveformLuma', label: 'Waveform' },
		{ id: 'Vector100', label: 'Vector - 100%' },
		{ id: 'Vector75', label: 'Vector - 75%' },
		{ id: 'ParadeRGB', label: 'RGB Parade' },
		{ id: 'ParadeYUV', label: 'YVU Parade' },
		{ id: 'Histogram', label: 'Histogram' },
		{ id: 'AudioDbfs', label: 'Audio dBFS' },
		{ id: 'AudioDbvu', label: 'Audio dBVU' },
	],
	Values: [
		{ id: 0, label: '0' },
		{ id: 127, label: '127' },
		{ id: 255, label: '255' },
	],
}

export const Fields = {
	AudioChannel: {
		type: 'dropdown',
		label: 'Channels',
		id: 'val',
		choices: Choices.AudioChannels,
		default: '0',
	},
	Color: {
		type: 'dropdown',
		label: 'Color',
		id: 'val',
		choices: Choices.Colors,
	},
	Decrement: {
		type: 'number',
		label: 'Decrement Amount (1-255)',
		id: 'val',
		min: 1,
		max: 255,
		default: 5,
		required: true,
		range: false,
	},
	Increment: {
		type: 'number',
		label: 'Increment Amount (1-255)',
		id: 'val',
		min: 1,
		max: 255,
		default: 5,
		required: true,
		range: false,
	},
	Input: {
		type: 'dropdown',
		label: 'Input',
		id: 'val',
		choices: Choices.Inputs,
		default: 'SDI A',
	},
	Level: function (defaultLevel) {
		return {
			type: 'number',
			label: 'Set the level 0-255',
			id: 'val',
			min: 0,
			max: 255,
			default: defaultLevel,
			required: true,
			range: true,
		}
	},
	Lut: {
		type: 'dropdown',
		label: 'LUT',
		id: 'val',
		choices: Choices.Luts,
		default: 'NONE',
	},
	ScopeType: {
		type: 'dropdown',
		label: 'Function',
		id: 'val',
		choices: Choices.ScopeType,
		default: 'Picture',
	},
}

export const Presets = {
	States: [
		{ action: 'bright', group: 'Brightness', label: 'Brightness\\n\\n@ ', choices: Choices.Values },
		{ action: 'cont', group: 'Contrast', label: 'Contrast\\n\\n@ ', choices: Choices.Values },
		{ action: 'sat', group: 'Saturation', label: 'Saturation\\n\\n@ ', choices: Choices.Values },
		{ action: 'ident', group: 'Identify', label: 'Identify', choices: null },
		{ action: 'border', group: 'Border Color', label: 'Border Color:\\n', choices: Choices.Colors },
		{ action: 'scopeFunc', group: 'Scope Function', label: 'Scope Fn:\\n', choices: Choices.ScopeType },
		{ action: 'audio', group: 'Audio Channels', label: 'Audio Ch:\\n', choices: Choices.AudioChannels },
		{ action: 'lut', group: 'LUT', label: 'LUT: ', choices: Choices.Luts },
		{ action: 'input', group: 'Input', label: 'Input: ', choices: Choices.Inputs },
	],
	Values: [
		{ action: 'brightUp', group: 'Brightness', label: 'BRIGHTNESS\\nUP\\n\\n$(smart:_brightness)' },
		{ action: 'brightDown', group: 'Brightness', label: 'BRIGHTNESS\\nDOWN\\n\\n$(smart:_brightness)' },
		{ action: 'contUp', group: 'Contrast', label: 'CONTRAST\\nUP\\n\\n$(smart:_contrast)' },
		{ action: 'contDown', group: 'Contrast', label: 'CONTRAST\\nDOWN\\n\\n$(smart:_contrast)' },
		{ action: 'satUp', group: 'Saturation', label: 'SATURATION\\nUP\\n\\n$(smart:_saturation)' },
		{ action: 'satDown', group: 'Saturation', label: 'SATURATION\\nDOWN\\n\\n$(smart:_saturation)' },
	],
}
