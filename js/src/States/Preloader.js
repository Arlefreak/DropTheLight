(function () {
	'use strict';
	function Preload() {
		this.preloadBarBg = null;
		this.preloadBar = null;
	}

	Preload.prototype = {
		preload: function() {
			game.stage.backgroundColor = '#000';
			this.preloadBarBg = this.add.sprite(300, 400, 'loadingBG');
			this.preloadBar = this.add.sprite(304, 405, 'loading');
			this.load.setPreloadSprite(this.preloadBar);
		},
		create: function() {
			this.preloadBar.cropEnabled = false;
			game.state.start('mainmenu');
		}
	};

	PreloaderS = Preload;
}());