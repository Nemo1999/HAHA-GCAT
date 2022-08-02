// 
class Caterpillar extends SpriteNode {
    /**
     * The caterpillar with behaviours defined
     * @param {SpriteHandle} sprite_handle 
     */
    constructor(sprite_handle) {
        super(sprite_handle)
        // velocity is a p5.Vector
        this.velocity = createVector(0 ,0)
        this.walk_frames = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 0, 0]
        this.state.walk_cnt = 0
    }

    /**
     * The oen-step crawling behaviour of caterpillars.
     */
    crawl(deltaT) {
        // update the caterpillar's sprite
        this.state.walk_cnt = (this.state.walk_cnt+1) % this.walk_frames.length
        this.setSpriteIndex(this.walk_frames[this.state.walk_cnt])

        // update the caterpillar's velocity
        const speed = this.state.walk_cnt < 5? .3 : .08
        const direction = p5.Vector.fromAngle(this.theta)
        this.velocity = p5.Vector.mult(direction, speed)

        // update the caterpillar's poistion
        const offset = p5.Vector.mult(this.velocity, deltaT)
        const new_pos = p5.Vector.add(createVector(...this.translation), offset)
        this.setTranslate(...new_pos.array())
    }


}