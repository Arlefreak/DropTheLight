(function() {
	'use strict';
	function Play() {}
	Play.prototype = {
		create: function() {
			game.physics.startSystem(Phaser.Physics.ARCADE);
			game.stage.backgroundColor = '#fff';
			this.collided = false;
			this.score = 0;
			this.LIGHT_RADIUS = gameWidth / 2;
			this.highScore = 0;
			this.lastScore = 0;
			this.getScore();
			var blockNumbers = Math.floor(gameWidth / 50 * 5) ;
			if(this.LIGHT_RADIUS > 400){
				this.LIGHT_RADIUS = 400;
			}

			this.fx = game.add.audio('sfx');
			this.fx = game.add.audio('soundtrack');
			this.fx.play('',0,1,true);

			// Show FPS
			this.game.time.advancedTiming = true;


			if (!this.game.device.desktop){
				this.titleTxt = game.add.text(game.world.centerX, 50, "Drop the light", {
					font: "20px Source Code Pro",
					fill: "#f0f0f0",
					align: "center"
				});
				this.tutorialTxt = game.add.text(game.world.centerX, 150 , "Tap the screen to start", {
					font: "18px Source Code Pro",
					fill: "#0f0f0f",
					align: "center"
				});
				this.scoreTxt2 = game.add.text(game.world.centerX, 200, " High Score: " + this.highScore + "\n Last Score: " + this.lastScore, {
					font: "15px Source Code Pro",
					fill: "#0f0f0f",
					align: "left"
				});
			}else{
				this.titleTxt = game.add.text(game.world.centerX, 150, "Drop the light", {
					font: "30px Source Code Pro",
					fill: "#0f0f0f",
					align: "center"
				});
				this.tutorialTxt = game.add.text(game.world.centerX, 200 , "Use the arrow keys & press enter to start", {
					font: "20px Source Code Pro",
					fill: "#0f0f0f",
					align: "center"
				});
				this.scoreTxt2 = game.add.text(game.world.centerX, 250, " High Score: " + this.highScore + "\n Last Score: " + this.lastScore, {
					font: "20px Source Code Pro",
					fill: "#0f0f0f",
					align: "left"
				});
			}

			this.scoreTxt2.anchor.setTo(0.5, 0.5);
			this.titleTxt.anchor.setTo(0.5, 0.5);
			this.tutorialTxt.anchor.setTo(0.5, 0.5);

			game.add.tween(this.titleTxt).to({ y: -150 }, 2000, Phaser.Easing.Linear.None).start();
			game.add.tween(this.tutorialTxt).to({ y: -100 }, 2000, Phaser.Easing.Linear.None).start();
			game.add.tween(this.scoreTxt2).to({ y: -50 }, 2000, Phaser.Easing.Linear.None).start();

			/* Bit Map Data */

			this.blockTexture = game.add.bitmapData(50,50);
			this.blockTexture.context.fillStyle = 'rgba(0, 0, 0, 1.0)';
			this.blockTexture.context.fillRect(0,0, 50, 50);

			this.bmdLight =  game.add.bitmapData(20, 20);
			this.bmdLight.context.beginPath();
			this.bmdLight.context.arc(10, 10 , 10, 0, 2 * Math.PI, false);
			this.bmdLight.context.fillStyle = 'rgba(0, 0, 0, 1.0)';
			this.bmdLight.context.fill();

			this.shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);


			/* Groups */
			this.pipes = game.add.group();
			this.pipes.createMultiple(blockNumbers, this.blockTexture);

			/* Sprites */

			this.light = game.add.sprite(game.world.centerX, game.world.centerY,this.bmdLight);

			this.lightSprite = game.add.image(0, 0, this.shadowTexture);
			this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;

			this.game.input.activePointer.x = this.game.width/2;
			this.game.input.activePointer.y = this.game.height/2;

			/* Text */

			this.scoreTxt = game.add.text(20, 20, "0", {
				font: "30px Source Code Pro",
				fill: "#f0f0f0",
				align: "center"
			});

			this.fpsText = this.game.add.text(game.world.width - 120, 20, '0',{
				font: "30px Source Code Pro",
				fill: "#f0f0f0",
				align: "center"
			});


			/* Timer */
			this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

			/* Physics */
			game.physics.enable(this.pipes, Phaser.Physics.ARCADE);
			game.physics.enable(this.light, Phaser.Physics.ARCADE);
			this.light.body.collideWorldBounds=true;

			/* Particles */

			this.emitter = game.add.emitter(game.world.centerX, game.world.centerY - 20,500,200);

			this.emitter.makeParticles('particle');

			this.emitter.setRotation(0, 0);
			this.emitter.setAlpha(0.3, 0.8);
			this.emitter.setScale(0.5, 1);
			this.emitter.gravity = -200;

			this.emitter.start(false, 5000, 100);
		},

		update: function() {
			this.light.body.velocity.x = 0;
			this.light.body.velocity.y = 0;
			this.light.body.angularVelocity = 0;
			this.updateShadowTexture();
			this.emitter.x = this.light.body.x;
			if (this.game.time.fps !== 0) {
				this.fpsText.setText(this.game.time.fps + ' FPS');
			}

			if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || game.input.pointer1.isDown && game.input.pointer1.x < game.world.centerX)
			{

				this.light.body.velocity.x = -250;
			}
			else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)|| game.input.pointer1.isDown && game.input.pointer1.x > game.world.centerX)
			{
				this.light.body.velocity.x = 200;
			}
			game.physics.arcade.overlap(this.light, this.pipes, function () { this.quitGame('mainmenu'); }, null, this); 
		},

		quitGame: function (state) {
			this.fx.play('',0,1,false);
			localStorage.setItem('lastScore', this.score);
			game.time.events.remove(this.timer);
			game.state.start(state);
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

	Play.prototype.changeTexture = function() {
		if(!this.collided){
			this.collided = true
			this.bmdLight.clear();
			this.bmdLight.context.beginPath();
			this.bmdLight.context.arc(10, 10 , 10, 0, 2 * Math.PI, false);
			this.bmdLight.context.fillStyle = 'rgba(0, 0, 0, 1.0)';
			this.bmdLight.context.fill();
		}
	};

	Play.prototype.die = function() {
		this.score--;
	};

	Play.prototype.addOnePipe = function(x, y, _move, _direction) {  
		var pipe = this.pipes.getFirstDead();
		pipe.reset(x, y);
		pipe.checkWorldBounds = true;
		pipe.body.velocity.y = -200; 
		pipe.outOfBoundsKill = true;

		if (_move){
			if(_direction){
				pipe.body.velocity.x = - 100;
			}else{
				pipe.body.velocity.x = 100;
			}
		}
	};

	Play.prototype.addRowOfPipes = function() {
		var blockNumbers = window.innerWidth / 50;
		var randomNumber = Math.random() >= 0.5;
		var holes = [];
		var move;
		var equealsHole = false;
		var i = 0;

		this.score += 1;
		this.scoreTxt.setText(this.score);

		for (i = blockNumbers/5; i > 0; i--){
			holes.push (Math.floor(Math.random()*blockNumbers)+1);
		}
		console.log('holes size: ' + holes.length);
		if (this.score % 50 === 0 && this.LIGHT_RADIUS !== 100){
			this.LIGHT_RADIUS -= 10;
		}else if(this.score >= 10) {
			move = true;
		}

		for (var i = 0; i < blockNumbers; i++){
			var index;
			equealsHole = false;
			for (index = 0; index < holes.length; ++index) {
				console.log('equealsHole1: ' + equealsHole);
				console.log('i: ' + i, ' hole: ' +  holes[index]);
				if (holes[index] === i || holes[index] + 1 === i){
					equealsHole = true;
				}
			}
			console.log('equealsHole2: ' + equealsHole);
			if (!equealsHole){
				this.addOnePipe(i*50, game.world.height , move, randomNumber);
			}
		}
	};

	Play.prototype.updateShadowTexture = function() {

		this.shadowTexture.context.fillStyle = 'rgb(0, 0, 0)';
		this.shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);

		var gradient = this.shadowTexture.context.createRadialGradient(
			this.light.x + 10, this.light.y + 10, this.LIGHT_RADIUS * 0.75,
			this.light.x + 10, this.light.y + 10, this.LIGHT_RADIUS);
		gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
		gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

		this.shadowTexture.context.beginPath();
		this.shadowTexture.context.fillStyle = gradient;
		this.shadowTexture.context.arc(this.light.x + 10, this.light.y + 10,
			this.LIGHT_RADIUS, 0, Math.PI*2);
		this.shadowTexture.context.fill();

		this.shadowTexture.dirty = true;
	};

	PlayS = Play;
}());
