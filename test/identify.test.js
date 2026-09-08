import assert from 'node:assert/strict'
import test from 'node:test'

import BlackmagicSmartviewInstance from '../src/index.js'

test('identify feedback clears when the monitor finishes its 15-second identify period', () => {
	const originalSetTimeout = globalThis.setTimeout
	const originalClearTimeout = globalThis.clearTimeout
	let timeout
	const cleared = []

	globalThis.setTimeout = (callback, delay) => {
		timeout = { callback, delay }
		return timeout
	}
	globalThis.clearTimeout = (timer) => cleared.push(timer)

	try {
		const instance = Object.create(BlackmagicSmartviewInstance.prototype)
		instance.monitors = {}
		instance.checkFeedbacks = (...ids) => feedbackChecks.push(ids)
		const feedbackChecks = []

		instance.updateMonitor('MONITOR A:', ['Identify: true'])

		const monitor = instance.getMonitor('MONITOR A:')
		assert.equal(monitor.identify, true)
		assert.equal(timeout.delay, 15000)
		assert.deepEqual(feedbackChecks, [['ident']])

		timeout.callback()
		assert.equal(monitor.identify, false)
		assert.equal(monitor.identifyTimer, undefined)
		assert.deepEqual(feedbackChecks, [['ident'], ['ident']])
		assert.deepEqual(cleared, [])
	} finally {
		globalThis.setTimeout = originalSetTimeout
		globalThis.clearTimeout = originalClearTimeout
	}
})
