
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let stars;
let platforms;
let score = 0;
let scoreText;


function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.spritesheet('dude', 'assets/dude.png', 
        { frameWidth: 80, frameHeight: 58 }
    );
}

function create() {
    // Background
    this.add.image(800, 600, 'sky');
    
    // Platforms
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(1).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
    platforms.create(300, 300, 'ground');
    platforms.create(10, 600, 'ground');
    
    // Player
    player = this.physics.add.sprite(80, 400, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    
    // Player animations
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    
    // Stars
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 18, y: 0, stepX: 70 }
    });
    
    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    
    // Score
    scoreText = this.add.text(16, 16, 'Score: 0', 
        { fontSize: '32px', fill: '#000' }
    );
    
    // Colliders
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
}
function update() {
    const cursors = this.input.keyboard.createCursorKeys();
    
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        // player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);
        // player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);
        // player.anims.play('turn');
    }
    
    if (cursors.up.isDown && player.body.touching.down ) {
        player.setVelocityY(-330);
    }
    if(player.body.touching.down){
        console.log("k");
    }
}
function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
    
    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });
    }
}