function t_local_scaling(scene_name='local-scaling') {
    const test_cases = [
        {
            'parent': 1,
            'child': 1
        },
        {
            'parent': 0.5,
            'child': 1
        }
    ];

    // scene
    const scene = new Scene(scene_name);
    
    scene.reloadSelf = function() {
        this.activate()
        this.show()
    };

    // background
    const bg = new Node('background', false);
    bg.drawSelf = function() {
        background(200);
    };

    scene.addChild(bg);

    test_cases.forEach((scales, i) => {
        let parent = new Node('parent'+i), child = new Node('child'+i);
        parent.addChild(child);
        parent.setTranslate(width*0.1*i, 0);

        child.drawSelf = function() {
            square(this.parent.translation[0], this.parent.translation[1], 30);
        }

        parent.setScale(scales['parent']);
        child.setScale(scales['child']);

        scene.addChild(parent);
    });

    return scene;
}