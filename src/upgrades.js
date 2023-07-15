export function upgrade_v1_1_0(context, props) {
	let updateActions = []
	let upgradePass = (action) => {
		switch (action.actionId) {
			case 'border':
				if (action.options !== undefined && action.options.col !== undefined) {
					action.options.val = action.options.col
					delete action.options.col
					updateActions.push(action)
				}
				break
		}
	}

	if (props.actions) {
		for (let k in actions) {
			upgradePass(actions[k])
		}
	}

	return {
		updatedConfig: null,
		updatedActions: updateActions,
		updatedFeedbacks: [],
	}
}

export const BooleanFeedbackUpgradeMap = {
	audio: true,
	border: true,
	bright: true,
	cont: true,
	ident: true,
	input: true,
	lut: true,
	sat: true,
	scopeFunc: true,
}
