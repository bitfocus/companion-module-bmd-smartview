import assert from 'node:assert/strict'
import test from 'node:test'

import BlackmagicSmartviewInstance from '../src/index.js'

test('keepalive bypasses the command queue so an unanswered PING cannot block actions', () => {
	const instance = Object.create(BlackmagicSmartviewInstance.prototype)
	const sent = []

	instance.socket = {
		isConnected: true,
		send: (command) => {
			sent.push(command)
			return Promise.resolve()
		},
	}
	instance.cts = true
	instance.commandQueue = []
	instance.startKeepAlive = () => {
		instance.keepaliveRescheduled = true
	}
	instance.log = () => undefined

	instance.sendKeepAlive()

	assert.deepEqual(sent, ['PING\n\n'])
	assert.deepEqual(instance.commandQueue, [])
	assert.equal(instance.cts, true)
	assert.equal(instance.keepaliveRescheduled, true)
})

test('keepalive does not overtake an operator command already in flight', () => {
	const instance = Object.create(BlackmagicSmartviewInstance.prototype)
	const sent = []

	instance.socket = { isConnected: true, send: (command) => sent.push(command) }
	instance.cts = false
	instance.commandQueue = ['MONITOR A:\nMonitorInput: SDI B\n\n']
	instance.startKeepAlive = () => undefined

	instance.sendKeepAlive()

	assert.deepEqual(sent, [])
	assert.deepEqual(instance.commandQueue, ['MONITOR A:\nMonitorInput: SDI B\n\n'])
})
