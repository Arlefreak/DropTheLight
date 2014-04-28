(function () {
	'use strict';
	function Preload() {
		this.preloadBarBg = null;
		this.preloadBar = null;
	}

	Preload.prototype = {
		preload: function() {
			game.stage.backgroundColor = '#000';
			this.preloadBarBg = this.add.sprite(game.world.centerX, game.world.centerY, 'loadingBG');
			this.preloadBar = this.add.sprite(game.world.centerX + 4, game.world.centerY + 5, 'loading');
			game.load.audio('sfx', [ 'js/res/sound/die.mp3', 'js/res/sound/die.ogg' ]);
			this.load.setPreloadSprite(this.preloadBar);
			this.load.image('particle', 'js/res/img/particle.png');
		},
		create: function() {
			this.preloadBar.cropEnabled = false;
			game.state.start('mainmenu');
		}
	};

	PreloaderS = Preload;
}());