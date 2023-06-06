import {
	CreateConvertToBooleanFeedbackUpgradeScript,
	InstanceBase,
	Regex,
	runEntrypoint,
	TCPHelper,
} from '@companion-module/base'
import { updateActions } from './actions.js'
import { updateFeedbacks } from './feedback.js'
import { updatePresets } from './presets.js'
import { updateVariables } from './variables.js'
import { BooleanFeedbackUpgradeMap, upgrade_v1_1_0 } from './upgrades.js'
import { Choices } from './setup.js'

/**
 * Companion instance class for the Blackmagic SmartView/SmartScope Monitors.
 *
 * @extends InstanceBase
 * @since 1.0.0
 * @author Keith Rocheck <keith.rocheck@gmail.com>
 */
class BlackmagicSmartviewInstance extends InstanceBase {
	/**
	 * Create an instance of a SmartView/SmartScope module.
	 *
	 * @param {Object} internal - Companion internals
	 * @since 1.0.0
	 */
	constructor(internal) {
		super(internal)

		this.updateActions = updateActions.bind(this)
		this.updateFeedbacks = updateFeedbacks.bind(this)
		this.updatePresets = updatePresets.bind(this)
		this.updateVariables = updateVariables.bind(this)
	}

	/**
	 * Process an updated configuration array.
	 *
	 * @param {Object} config - the new configuration
	 * @access public
	 * @since 1.0.0
	 */
	async configUpdated(config) {
		let resetConnection = false

		if (this.config.host != config.host) {
			resetConnection = true
		}

		this.config = config

		this.updateActions()
		this.updateVariables()
		this.updateFeedbacks()
		this.updatePresets()

		if (resetConnection === true || this.socket === undefined) {
			this.initTCP()
		}
	}

	/**
	 * Clean up the instance before it is destroyed.
	 *
	 * @access public
	 * @since 1.0.0
	 */
	async destroy() {
		if (this.socket !== undefined) {
			this.socket.destroy()
		}

		this.log('debug', 'destroy', this.id)
	}

	/**
	 * Creates the configuration fields for web config.
	 *
	 * @returns {Array} the config fields
	 * @access public
	 * @since 1.0.0
	 */
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 6,
				regex: Regex.IP,
			},
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value:
					'This information below will automatically populate from the device upon connection, however, can be set manually for offline programming.',
			},
			{
				type: 'dropdown',
				id: 'ver',
				label: 'Product',
				width: 6,
				choices: Choices.Model,
				default: 'smView',
			},
		]
	}

	/**
	 * INTERNAL: returns the desired monitor object.
	 *
	 * @param {String} id - the monitor to fetch
	 * @returns {Object} the desired monitor object
	 * @access protected
	 * @since 1.1.0
	 */
	getMonitor(id) {
		if (id.length > 1) {
			if (id.match(/ A/)) {
				id = 'A'
			} else if (id.match(/ B/)) {
				id = 'B'
			}
		}

		id = id.toLowerCase()

		if (this.monitors[id] === undefined) {
			this.monitors[id] = {
				id: id,
				brightness: 255,
				contrast: 128,
				saturation: 128,
				identify: false,
				border: 'none',
				scopeMode: 'Picture',
				audioChannel: '0',
				lut: 'NONE',
				monitorInput: 'SDI A',
			}
		}

		return this.monitors[id]
	}

	/**
	 * Main initialization function called once the module
	 * is OK to start doing things.
	 *
	 * @param {Object} config - the configuration
	 * @access public
	 * @since 1.0.0
	 */
	async init(config) {
		this.config = config
		this.stash = []
		this.command = null
		this.commandQueue = []
		this.cts = false
		this.deviceName = ''
		this.monitors = {}

		this.setupFields()

		this.updateActions()
		this.updateVariables()
		this.updateFeedbacks()
		this.updatePresets()

		this.initTCP()
	}

	/**
	 * INTERNAL: use setup data to initalize the tcp socket object.
	 *
	 * @access protected
	 * @since 1.0.0
	 */
	initTCP() {
		this.receiveBuffer = ''

		if (this.socket !== undefined) {
			this.socket.destroy()
			delete this.socket
		}

		if (this.config.port === undefined) {
			this.config.port = 9992
		}

		if (this.config.host) {
			this.socket = new TCPHelper(this.config.host, this.config.port)

			this.socket.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})

			this.socket.on('error', (err) => {
				this.log('error', 'Network error: ' + err.message)
			})

			this.socket.on('connect', () => {
				this.log('debug', 'Connected')
			})

			// separate buffered stream into lines with responses
			this.socket.on('data', (chunk) => {
				let i = 0,
					line = '',
					offset = 0
				this.receiveBuffer += chunk

				while ((i = this.receiveBuffer.indexOf('\n', offset)) !== -1) {
					line = this.receiveBuffer.substr(offset, i - offset)
					offset = i + 1

					if (line.match(/Error/)) {
						this.commandQueue.shift()
						this.sendNextCommand()
					} else if (line.match(/ACK/)) {
						if (this.commandQueue.length > 0) {
							let echo = this.commandQueue.shift()
							echo = echo.split('\n')

							if (echo.length > 1) {
								let cmd = echo.shift().trim().split(/:/)[0]
								this.processSmartviewInformation(cmd, echo)
							}

							this.sendNextCommand()
						}
					} else {
						this.socket.emit('receiveline', line.toString())
					}
				}

				this.receiveBuffer = this.receiveBuffer.substr(offset)
			})

			this.socket.on('receiveline', (line) => {
				if (this.command === null && line.match(/:/)) {
					this.command = line
				} else if (this.command !== null && line.length > 0) {
					this.stash.push(line.trim())
				} else if (line.length === 0 && this.command !== null) {
					let cmd = this.command.trim().split(/:/)[0]

					this.processSmartviewInformation(cmd, this.stash)

					this.stash = []
					this.command = null
					this.sendNextCommand()
				} else if (line.length > 0) {
					this.log('debug', 'weird response from smartview', line, line.length)
				}
			})
		}
	}

	/**
	 * INTERNAL: Routes incoming data to the appropriate function for processing.
	 *
	 * @param {string} key - the command/data type being passed
	 * @param {Object} data - the collected data
	 * @access protected
	 * @since 1.1.0
	 */
	processSmartviewInformation(key, data) {
		if (key.match(/MONITOR (A|B)/)) {
			this.updateMonitor(key, data)
			//this.updatePresets()
		} else if (key == 'SMARTVIEW DEVICE') {
			this.updateDevice(key, data)
			this.updateActions()
			this.updateVariables()
			this.updateFeedbacks()
			this.updatePresets()
		} else {
			// TODO: find out more about the smart view from stuff that comes in here
		}
	}

	/**
	 * INTERNAL: Will add a command to the queue to send and send it if cleared to.
	 *
	 * @param {string} cmd - the command
	 * @access protected
	 * @since 1.1.0
	 */
	queueCommand(cmd) {
		if (cmd !== undefined) {
			if (this.socket !== undefined && this.socket.isConnected) {
				this.commandQueue.push(`${cmd}\n\n`)

				if (this.cts === true) {
					this.sendNextCommand()
				}
			} else {
				this.log('debug', 'Socket not connected :(')
			}
		}
	}

	/**
	 * INTERNAL: Send the next command in the queue OR clears to send if none.
	 *
	 * @access protected
	 * @since 1.1.0
	 */
	sendNextCommand() {
		if (this.commandQueue.length > 0) {
			this.socket.send(this.commandQueue[0])
			this.cts = false
		} else {
			this.cts = true
		}
	}

	/**
	 * INTERNAL: use model data to define the choices for the dropdowns.
	 *
	 * @access protected
	 * @since 1.1.0
	 */
	setupChoices() {
		this.CHOICES_MONITOR = []

		if (this.config.ver == 'smViewDuo' || this.config.ver == 'smScope') {
			this.CHOICES_MONITOR = [
				{ id: 'MONITOR A:', label: 'Monitor A', preset: 'MONITOR: A\\n', variable: 'mon_a_' },
				{ id: 'MONITOR B:', label: 'Monitor B', preset: 'MONITOR: B\\n', variable: 'mon_b_' },
			]
		} else {
			this.CHOICES_MONITOR = [{ id: 'MONITOR A:', label: 'Monitor A', preset: '', variable: 'mon_a_' }]
		}

		this.MONITOR_FIELD.choices = this.CHOICES_MONITOR
	}

	/**
	 * Set up the fields used in actions and feedbacks
	 *
	 * @access protected
	 * @since 1.1.2
	 */
	setupFields() {
		this.MONITOR_FIELD = {
			type: 'dropdown',
			label: 'Select Monitor',
			id: 'mon',
			choices: this.CHOICES_MONITOR,
			default: 'MONITOR A:',
		}
	}

	/**
	 * INTERNAL: Updates device data from the SmartView
	 *
	 * @param {string} labeltype - the command/data type being passed
	 * @param {Object} object - the collected data
	 * @access protected
	 * @since 1.1.0
	 */
	updateDevice(labeltype, object) {
		for (let key in object) {
			let parsethis = object[key]
			let a = parsethis.split(/: /)
			let attribute = a.shift()
			let value = a.join(' ')

			switch (attribute) {
				case 'Model':
					if (value.match(/SmartView 4K/)) {
						this.config.ver = 'smView4K'
					} else if (value.match(/SmartView HD/)) {
						this.config.ver = 'smView'
					} else if (value.match(/SmartView Duo/)) {
						this.config.ver = 'smViewDuo'
					} else if (value.match(/SmartScope Duo 4K/)) {
						this.config.ver = 'smScope'
					}
					this.deviceName = value
					this.log('info', 'Connected to a ' + this.deviceName)
					break
			}
		}

		this.saveConfig(this.config)
	}

	/**
	 * INTERNAL: Updates monitor config based on data from the SmartView
	 *
	 * @param {string} labeltype - the command/data type being passed
	 * @param {Object} object - the collected data
	 * @access protected
	 * @since 1.1.0
	 */
	updateMonitor(labeltype, object) {
		let monitor = this.getMonitor(labeltype)

		for (let key in object) {
			let parsethis = object[key]
			let a = parsethis.split(/: /)
			let attribute = a.shift()
			let value = a.join(' ')

			switch (attribute) {
				case 'Brightness':
					monitor.brightness = parseInt(value)
					this.setVariableValues({ [`mon_${monitor.id}_brightness`]: monitor.brightness })
					this.checkFeedbacks('bright')
					break
				case 'Contrast':
					monitor.contrast = parseInt(value)
					this.setVariableValues({ [`mon_${monitor.id}_contrast`]: monitor.contrast })
					this.checkFeedbacks('cont')
					break
				case 'Saturation':
					monitor.saturation = parseInt(value)
					this.setVariableValues({ [`mon_${monitor.id}_saturation`]: monitor.saturation })
					this.checkFeedbacks('sat')
					break
				case 'Border':
					monitor.border = value
					this.checkFeedbacks('border')
					break
				case 'ScopeMode':
					monitor.scopeMode = value
					this.checkFeedbacks('scopeFunc')
					break
				case 'AudioChannel':
					monitor.audioChannel = value
					this.checkFeedbacks('audio')
					break
				case 'LUT':
					monitor.lut = value
					this.checkFeedbacks('lut')
					break
				case 'MonitorInput':
					monitor.monitorInput = value
					this.checkFeedbacks('input')
					break
				case 'Identify':
					monitor.identify = value == 'true'
					this.checkFeedbacks('ident')
					break
			}
		}
	}
}

runEntrypoint(BlackmagicSmartviewInstance, [
	upgrade_v1_1_0,
	CreateConvertToBooleanFeedbackUpgradeScript(BooleanFeedbackUpgradeMap),
])
