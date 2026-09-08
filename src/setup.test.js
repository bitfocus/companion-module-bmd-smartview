import assert from 'node:assert/strict'
import test from 'node:test'

import { Choices, getMonitorInputCommand } from './setup.js'

test('offers both lettered and numbered SmartView input names', () => {
	assert.deepEqual(
		Choices.Inputs.map((input) => input.id),
		['SDI A', 'SDI B', 'SDI 1', 'SDI 2', 'OPTICAL'],
	)
})

test('sends the numbered input exactly as required by the monitor protocol', () => {
	assert.equal(getMonitorInputCommand('MONITOR A:', 'SDI 1'), 'MONITOR A:\nMonitorInput: SDI 1')
})
