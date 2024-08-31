grayCodeGame = (function(grayCodeGame) {
	addEventListener('load', function() {
		grayCodeGame.startGame();
	});
	return Object.assign(grayCodeGame, {
		checkboxArea: null,
		checkboxes: null,
		lost: true,
		iteration: 0,
		startGame: function() {
			this.checkboxArea = document.getElementById('checkbox-area');
			this.statusElement = document.getElementById('status-message');
			this.setStatusMessage('Game has started');
			var grayCodeGame = this;
			var restartButton = document.getElementById('game-restart');
			restartButton.onclick = function() {
				grayCodeGame.startGame();
			}
			this.restartButton = restartButton;
			this.reset();
			this.appendCheckbox();
			this.checkboxes[0].focus();
		},
		reset: function() {
			this.checkboxArea.innerHTML = '';
			this.checkboxes = [];
			this.iteration = 0;
			this.lost = false;
		},
		appendCheckbox: function() {
			var checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			var container = document.createElement('label');
			container.className = 'bit-checkbox';
			var index = this.checkboxes.push(checkbox) - 1;
			checkbox.title = '#' + index;
			container.innerText = index + '';
			container.appendChild(checkbox);
			var grayCodeGame = this;
			checkbox.addEventListener('change', function(ev) {
				void(ev);
				grayCodeGame.updateBit(index, checkbox.checked);
			});
			this.checkboxArea.appendChild(container);
		},
		updateBit: function(index, value) {
			this.setStatusMessage((value ? 'Set' : 'Reset') + ' bit #' + index);
			if (this.lost) {
				return;
			}
			if (value && index == this.checkboxes.length - 1) {
				this.appendCheckbox();
			}
			var prevIteration = this.iteration;
			var iteration = ++(this.iteration);
			var prevMask = prevIteration ^ (prevIteration >> 1);
			var mask = iteration ^ (iteration >> 1);
			var maskDiff = prevMask ^ mask;
			var playedMask = 1 << index;
			if (maskDiff != playedMask) {
				this.lose();
				var expectedIndex = Math.log2(maskDiff);
				this.setStatusMessage('You lost!\nBit #' + index + ' was inverted instead of #' + expectedIndex + '\nScore: ' + prevIteration);
			}
		},
		lose: function() {
			this.lost = true;
			for (var i = 0; i < this.checkboxes.length; ++i) {
				this.checkboxes[i].disabled = true;
			}
			this.restartButton.focus();
		},
		setStatusMessage: function(msg) {
			this.statusElement.innerText = msg;
		},
	});
})(window.grayCodeGame || {});
