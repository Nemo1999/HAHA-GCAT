function make_scene_40(loader_cat, scene_name='metaverse-trans') {
    scene = new Scene(scene_name)

    scene.reloadSelf = function(){
        this.activate()
        this.show()
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
    ]));

    normal_cat.setScale(0.27)
    

    normal_cat.updateSelf = function(deltaT) {
        // TODO: update rotation


        this.crawl(deltaT)
    }

    scene.addChild(bg)
    scene.addChild(normal_cat)

    return scene
}