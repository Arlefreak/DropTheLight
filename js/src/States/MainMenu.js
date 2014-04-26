(function() {
	'use strict';
	function Menu() {}

	Menu.prototype = {
		create: function() {
			game.stage.backgroundColor = '#fff';
			this.LIGHT_RADIUS = 350;
			this.highScore = 0;
			this.lastScore = 0;
			this.getScore();

			this.shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);
			this.shadowTexture.context.fillStyle = 'rgb(0, 0, 0)';
			this.shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);

			var gradient = this.shadowTexture.context.createRadialGradient(
				game.world.centerX + 10 , game.world.centerY + 10, this.LIGHT_RADIUS * 0.75,
				game.world.centerX + 10, game.world.centerY + 10, this.LIGHT_RADIUS);
			gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
			gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

			this.shadowTexture.context.beginPath();
			this.shadowTexture.context.fillStyle = gradient;
			this.shadowTexture.context.arc(game.world.centerX + 10, game.world.centerY + 10,
				this.LIGHT_RADIUS, 0, Math.PI*2);
			this.shadowTexture.context.fill();


			var light =  game.add.bitmapData(100, 100);
			light.context.beginPath();
			light.context.arc(10, 10 , 10, 0, 2 * Math.PI, false);
			light.context.fillStyle = 'rgba(0, 0, 0, 1.0)';
			light.context.fill();
			game.add.sprite(game.world.centerX, game.world.centerY,light);

			this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
			this.enterKey.onDown.add(this.startGame, this);
			
			this.lightSprite = game.add.image(0, 0, this.shadowTexture);
			this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;

			this.text = game.add.text(game.world.centerX, 150, "Drop the light", {
				font: "30px Source Code Pro",
				fill: "#0f0f0f",
				align: "center"
			});
			this.textTut = game.add.text(game.world.centerX, 200 , "Use the arrow keys & press enter to start", {
				font: "20px Source Code Pro",
				fill: "#0f0f0f",
				align: "center"
			});
			this.text.anchor.setTo(0.5, 0.5);
			this.textTut.anchor.setTo(0.5, 0.5);

			this.scoreTxt = game.add.text(game.world.centerX, 250, " High Score: " + this.highScore + "\n Last Score: " + this.lastScore, {
				font: "20px Source Code Pro",
				fill: "#0f0f0f",
				align: "left"
			});
			
			this.scoreTxt.anchor.setTo(0.5, 0.5);

			this.creditsTxt = game.add.text(game.world.centerX, this.world.height - 20, " Made with Phaser by Arlefreak ", {
				font: "14px Source Code Pro",
				fill: "#ffffff",
				align: "left"
			});
			
			this.creditsTxt.anchor.setTo(0.5, 0.5);
		},

		update: function() {
			if (game.input.activePointer.isDown){
				this.startGame();
			}
		},

		startGame: function() {
			game.state.start('play');
		},

		getScore: function(){
			this.lastScore = localStorage.getItem('lastScore');
			this.highScore = localStorage.getItem('highScore');
			if (typeof(this.highScore) == 'undefined' || this.highScore == null || isNaN(this.highScore)){
				this.highScore = 0;
				this.lastScore = 0;
				localStorage.setItem('highScore', this.highScore);
				localStorage.setItem('lastScore', this.lastScore);
			}
			this.highScore = parseInt(this.highScore,10);
			this.lastScore = parseInt(this.lastScore,10);
			if(this.highScore < this.lastScore ){
				this.highScore = this.lastScore;
				localStorage.setItem('highScore', this.lastScore);
			}
		}
	};
	MainMenuS = Menu;
}());