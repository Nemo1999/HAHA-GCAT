function make_scene_40(loader_cat, scene_name='metaverse-trans') {
    // scene
    scene = new Scene(scene_name)
    const duration = 1400      // the scene duration in millisecond
    const delay_time = 400     // the delay time (ms) before the caterpillar appears
    
    // caterpillar
    const speed = 6.8
    const deg_seq = [90, 60, 30, 20, 25, 40, 60, 80, 90]    // the caterpillar's rotation sequence
    const lerp_period = (duration-delay_time)/(deg_seq.length - 1)      // the rotation interpolation period between each two steps

    scene.reloadSelf = function(){
        this.activate()
        this.show()
    }

    scene.updateSelf = function(deltaT) {
        if(this.accTime > duration+100) {
            this.deactivate()
            this.hide()
        }
    }

    // background
    const bg_img = loadImage('assets/Scene4/scene40-bg.png')
    const bg = new Node('background', false)
    bg.drawSelf = () => {
        background(bg_img)
    }

    // caterpillar
    const normal_cat = new Caterpillar(loader_cat.get_handle([
            "normal-cat.png", 
            "normal-cat-1.png", 
            "normal-cat-2.png", 
            "normal-cat-3.png", 
            "normal-cat-4.png", 
            "normal-cat-blink.png"
    ]))

    normal_cat.setScale(0.25)
    normal_cat.setTranslate(420, -640)
    normal_cat.setRotate(radians(deg_seq[0]))

    let deg_ckpt = 1     // the next caterpillar's rotation degree checkpoint
    normal_cat.updateSelf = function(deltaT) {
        if(this.accTime >= delay_time && this.accTime < duration) {
            let timeline = this.accTime - delay_time
            if(timeline >= lerp_period * deg_ckpt) {
                deg_ckpt++     // update the next checkpoint
            }
            
            if(deg_ckpt < deg_seq.length) {
                const mid = (timeline - lerp_period * (deg_ckpt-1)) / lerp_period
                const theta = radians(lerp(deg_seq[deg_ckpt-1], deg_seq[deg_ckpt], mid))
                this.setRotate(theta)
            }
        }

        // the caterpillar will go forward in its direction
        this.crawl(deltaT, speed, false)
    }

    scene.addChild(bg)
    scene.addChild(normal_cat)

    return scene
}