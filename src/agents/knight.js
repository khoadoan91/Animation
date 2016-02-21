function Knight (x, y, game, level) {
    Entity.call(this, x, y, 41, 50);
    this.level = level;
    this.game = game;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.followers = [];
    this.checkPointX = this.currentX_px;
    this.checkPointY = this.currentY_px;

    this.health = GAME_CONSTANT.MAX_HEALTH;

    this.injureTime = GAME_CONSTANT.INJURE_TIME;

    //setting up gamestate bools
    this.removeFromWorld = false;
    this.controllable = true;
    // this.moveable = true;
    this.isRight = true;
    this.isAttacking = false;
    this.isInjure = false;

    var KnightAttackRight = new Animation(AM.getAsset("./img/knight/knight attack.png"), 90, 70, 0.085, false, 0, -20);
    KnightAttackRight.addFrame(0, 0, 8);
    var KnightAttackLeft = new Animation(AM.getAsset("./img/knight/knight attack flipped.png"), 90, 70, 0.085, false, -40, -20);
    KnightAttackLeft.addFrame(0, 0, 8);

    // var KnightHitRight = new Animation(AM.getAsset("./img/knight/knight hit draft.png"), 48, 50, 0.10, true);
    // KnightHitRight.addFrame(0, 0);
    // var KnightHitLeft = new Animation(AM.getAsset("./img/knight/knight hit draft flipped.png"), 48, 50, 0.10, true);
    // KnightHitLeft.addFrame(0, 0);

    var KnightStandingRight = new Animation(AM.getAsset("./img/knight/knight standing.png"), 41, 50, 0.1, true);
    KnightStandingRight.addFrame(0, 0);
    var KnightStandingLeft = new Animation(AM.getAsset("./img/knight/knight standing flipped.png"), 41, 50, 0.1, true);
    KnightStandingLeft.addFrame(0, 0);

    var KnightRunningRight = new Animation(AM.getAsset("./img/knight/knight run.png"), 49, 52, 0.1, true);
    KnightRunningRight.addFrame(0, 0, 8);
    var KnightRunningLeft = new Animation(AM.getAsset("./img/knight/knight run flipped.png"), 49, 52, 0.1, true);
    KnightRunningLeft.addFrame(0, 0, 8);

    var KnightJumpRight = new Animation(AM.getAsset("./img/knight/knight jump.png"), 47, 55, 0.1, true);
    KnightJumpRight.addFrame(0, 0);
    var KnightJumpLeft = new Animation(AM.getAsset("./img/knight/knight jump flipped.png"), 47, 55, 0.1, true);
    KnightJumpLeft.addFrame(0, 0);

    var KnightFallRight = new Animation(AM.getAsset("./img/knight/knight jump.png"), 47, 55, 0.1, true);
    KnightFallRight.addFrame(47, 0);
    var KnightFallLeft = new Animation(AM.getAsset("./img/knight/knight jump flipped.png"), 47, 55, 0.1, true);
    KnightFallLeft.addFrame(47, 0);

    this.animationList.push(KnightStandingRight);
    this.animationList.push(KnightStandingLeft);
    this.animationList.push(KnightRunningRight);
    this.animationList.push(KnightRunningLeft);
    this.animationList.push(KnightJumpRight);
    this.animationList.push(KnightJumpLeft);
    this.animationList.push(KnightFallRight);
    this.animationList.push(KnightFallLeft);
    this.animationList.push(KnightAttackRight);
    this.animationList.push(KnightAttackLeft);
    // this.animationList.push(KnightHitRight);
    // this.animationList.push(KnightHitLeft);
}

Knight.prototype = {
    updateFollowers : function (x, y) {
        for (var i = this.followers.length - 1; i > 0; i -= 1) {
            if (this.isRight) {
                this.followers[i].currentX_px = this.followers[i - 1].currentX_px - 25;
            } else {
                this.followers[i].currentX_px = this.followers[i - 1].currentX_px + 25;
            }
            if (this.yVelocity > 0) {
                this.followers[i].currentY_px = this.followers[i - 1].currentY_px - 10;
            } else if (this.yVelocity < 0) {
                this.followers[i].currentY_px = this.followers[i - 1].currentY_px + 10;
            } else {
                this.followers[i].currentY_px = this.followers[i - 1].currentY_px;
            }

        }
        if (this.followers.length > 0) {
            if (this.isRight) {
                this.followers[0].currentX_px = x - 25;
            } else {
                this.followers[0].currentX_px = x + 25;
            }
            if (this.yVelocity > 0) {
                this.followers[0].currentY_px = y - 10;
            } else if (this.yVelocity < 0) {
                this.followers[0].currentY_px = y + 10;
            } else {
                this.followers[0].currentY_px = y;
            }
        }
    },

    moveX : function () {
        var oldX = this.currentX_px;
        if (this.controllable) {
            if (this.game.keyStatus["d"])  {
                this.isRight = true;
                this.xVelocity = GAME_CONSTANT.RUNNING_SPEED;
                this.currentAnimation = GAME_CONSTANT.RUNNING_RIGHT_ANIMATION;
            } else if (this.game.keyStatus["a"]) {
                this.isRight = false;
                this.xVelocity = -GAME_CONSTANT.RUNNING_SPEED;
                this.currentAnimation = GAME_CONSTANT.RUNNING_LEFT_ANIMATION;
            } else if (!this.game.keyStatus["d"] && !this.game.keyStatus["a"]) {
                this.xVelocity = 0;
                if (this.isRight) {
                    this.currentAnimation = GAME_CONSTANT.STANDING_RIGHT_ANIMATION;
                } else {
                    this.currentAnimation = GAME_CONSTANT.STANDING_LEFT_ANIMATION;
                }
            }
            var newX = this.currentX_px + this.xVelocity;
            var obstacle = this.level.obstacleAt(newX, this.currentY_px, this.width, this.height);
            if (!obstacle) {
                this.currentX_px = newX;
            } // else if (obstacle instanceof Door) {
            //     this.level.displayHidden(this.currentX_px, this.currentY_px, obstacle);
            //     this.currentX_px = newX;
            // }
        }
        return oldX;
    },

    moveY : function () {
        var oldY = this.currentY_px;
        if (this.controllable) {
            if (this.yVelocity < GAME_CONSTANT.TERMINAL_VELOCITY) {
                this.yVelocity += GAME_CONSTANT.Y_ACCELERATION;
            }
            var newY = this.currentY_px + this.yVelocity;
            var obstacle = this.level.obstacleAt(this.currentX_px, newY, this.width, this.height);
            if (!obstacle) {
                this.currentY_px = newY;
            } else {
                if (this.game.keyStatus["w"] && this.yVelocity === GAME_CONSTANT.Y_ACCELERATION) {
                    this.yVelocity = -GAME_CONSTANT.JUMP_SPEED;
                } else {
                    this.yVelocity = 0;
                    if (this.currentY_px < obstacle.currentY_px) {
                        this.currentY_px = obstacle.currentY_px - this.height - 0.1;
                    }
                }
            }
            if (this.yVelocity !== 0) {
                if (this.yVelocity > 0) {
                    if (this.isRight) {
                        this.currentAnimation = GAME_CONSTANT.FALLING_RIGHT_ANIMATION;
                    } else {
                        this.currentAnimation = GAME_CONSTANT.FALLING_LEFT_ANIMATION;
                    }
                } else if (this.yVelocity < 0) {
                    if (this.isRight) {
                        this.currentAnimation = GAME_CONSTANT.JUMPING_RIGHT_ANIMATION;
                    } else {
                        this.currentAnimation = GAME_CONSTANT.JUMPING_LEFT_ANIMATION;
                    }
                }
            }
        }
        return oldY;
    },

    dealWithMonster : function (monster) {
        if (monster instanceof HealingStuff) {
            if (this.health < GAME_CONSTANT.MAX_HEALTH) {
                monster.removeFromWorld = true;
                this.health += monster.health;
            }
            if (this.health >= GAME_CONSTANT.MAX_HEALTH) {
                this.health = GAME_CONSTANT.MAX_HEALTH;
            }
        } else if (monster instanceof Arrow) {
            monster.removeFromWorld = true;
            this.health -= 1;
        } else if (monster instanceof Wisp) {
            monster.isFollowing = true;
            monster.currentY_px = this.currentY_px;
            if (this.isRight) {
                monster.currentX_px = this.currentX_px - 25 * (this.followers.length + 1);
            } else {
                monster.currentX_px = this.currentX_px + 25 * (this.followers.length + 1);
            }
            this.followers.push(monster);
            console.log(monster.currentX_px + " " + monster.currentY_px + " " + this.currentX_px + " " + this.currentY_px);
        } else {
            if (this.isAttacking) {
                // TODO deal with the monster attacks at behind.
                monster.health -= GAME_CONSTANT.DAMAGE;
                if (monster.health < 0) {
                    monster.removeFromWorld = true;
                }
            } else {
                if (this.health > 0 && !this.isInjure) {
                    this.health -= GAME_CONSTANT.DAMAGE;
                    this.isInjure = true;
                    // TODO make some effects when the knight touches the monster.
                }
            }
        }
    },

    update : function (tick) {
        var oldX = this.moveX();
        var oldY = this.moveY();
        if (oldX !== this.currentX_px || oldY !== this.currentY_px) {
            this.updateFollowers(oldX, oldY);
        }
        if (this.game.keyStatus['space'] && this.yVelocity === 0) {
            this.controllable = false;
            this.isAttacking = true;
            if (this.isRight) {
                this.currentAnimation = GAME_CONSTANT.ATTACKING_RIGHT_ANIMATION;
            } else {
                this.currentAnimation = GAME_CONSTANT.ATTACKING_LEFT_ANIMATION;
            }
        }
        if (this.animationList[GAME_CONSTANT.ATTACKING_RIGHT_ANIMATION].isDone() ||
            this.animationList[GAME_CONSTANT.ATTACKING_LEFT_ANIMATION].isDone()) {
            this.animationList[GAME_CONSTANT.ATTACKING_RIGHT_ANIMATION].elapsedTime = 0;
            this.animationList[GAME_CONSTANT.ATTACKING_LEFT_ANIMATION].elapsedTime = 0;
            this.controllable = true;
            this.isAttacking = false;
        }
        var monster = this.level.enemyAt(this);
        if (monster) {
            // console.log(monster);
            this.dealWithMonster(monster);
        }
        if (this.isInjure) {
            this.injureTime -= tick;
        }
        if (this.injureTime <= 0) {
            this.injureTime = GAME_CONSTANT.INJURE_TIME;
            this.isInjure = false;
        }

        if (this.health <= 0) {
            // TODO reset a map or go back to the check point
            this.currentX_px = this.checkPointX;
            this.currentY_px = this.checkPointY;
            this.health = GAME_CONSTANT.MAX_HEALTH;
            this.followers = [];
        }
        Entity.prototype.update.call(this);
    },

    draw : function (ctx, cameraRect, tick) {
        // console.log(cameraRect.left + " " + cameraRect.top + " " + this.currentX_px + " " + this.currentY_px);
        Entity.prototype.draw.call(this, ctx, cameraRect, tick);
        var percent = this.health / GAME_CONSTANT.MAX_HEALTH;
        ctx.fillStyle = "black";
        ctx.fillRect(this.currentX_px - cameraRect.left, this.currentY_px - cameraRect.top - 10,
                        this.width, 5);
        if (percent > 0.4) {
            ctx.fillStyle = "green";
        } else {
            ctx.fillStyle = "red";
        }
        ctx.fillRect(this.currentX_px - cameraRect.left, this.currentY_px - cameraRect.top - 10,
                        this.width * percent, 5);
    }
};
