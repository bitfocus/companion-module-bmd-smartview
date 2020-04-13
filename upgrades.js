module.exports = {

	/**
	 * INTERNAL: add various upgrade scripts
	 *
	 * @access protected
	 * @since 1.1.0
	 */
	addUpgradeScripts() {

		// v1.1.0 (convert border col to val)
		this.addUpgradeScript((config, actions, releaseActions, feedbacks) => {
			var changed = false;

			let upgradePass = function(action, changed) {
				switch (action.action) {
					case 'border':
						if (action.options !== undefined && action.options.col !== undefined) {
							action.options.val = action.options.col;
							delete action.options.col;
							changed = true;
						}
						break;
				}

				return changed;
			}

			for (let k in actions) {
				changed = upgradePass(actions[k], changed);
			}

			for (let k in releaseActions) {
				changed = upgradePass(releaseActions[k], changed);
			}

			return changed;
		});
	}
}