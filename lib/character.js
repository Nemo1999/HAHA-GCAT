class Caterpillar extends SpriteNode {
    /**
     * The caterpillar with behaviours defined
     * @param {SpriteHandle} sprite_handle 
     */
    constructor(sprite_handle) {
        super(sprite_handle)
        
        this.velocity = createVector(0 ,0)   // velocity is a p5.Vector
        this.walk_frames = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 4, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 0, 0]   // the complete walk cycle sprite frames
        this.state.walk_cnt = 0     // the frame steps counter
    }

    /**
     * The oen-step crawling behaviour of caterpillars.
     * @param {number} deltaT the time between the last update and the current update.
     * @param {number} speed_magnitude a number that multiplies on the speed to adjust the speed scale. You can use this to set the crawling speed.
     * @param {boolean} update_sprites whether or not to update the sprites while crawling.
     */
    crawl(deltaT, speed_magnitude=1, update_sprites=true) {
        // update the caterpillar's sprite
        if(update_sprites) {
            this.state.walk_cnt = (this.state.walk_cnt+1) % this.walk_frames.length
            this.setSpriteIndex(this.walk_frames[this.state.walk_cnt])
        }

        // update the caterpillar's velocity
        const speed = this.state.walk_cnt < 14? .2 : .02
        const direction = p5.Vector.fromAngle(this.theta)
        this.velocity = p5.Vector.mult(direction, speed * speed_magnitude)

        // update the caterpillar's poistion
        const offset = p5.Vector.mult(this.velocity, deltaT)
        const new_pos = p5.Vector.add(createVector(...this.translation), offset)
        this.setTranslate(...new_pos.array())
    }
}
