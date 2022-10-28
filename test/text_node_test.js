function t_font(scene_name='text-node-font') {
    const test_cases = [
        {
            'font': 'Serif',
            'content': 'HAHA-GCAT 綠毛蟲要過河',
            'font-size': 16,
            'line-hieght': 1,
            'node-size': 100
        },
        {
            'font': 'Courier New',
            'content': 'HAHA-GCAT 綠毛蟲要過河',
            'font-size': 16,
            'line-height': 1.5,
            'node-size': 100
        }
    ];

    // scene
    const scene = new Scene(scene_name);
    
    scene.reloadSelf = function() {
        this.activate()
        this.show()
    };

    // background
    // const bg = new Node('background', false);
    // bg.drawSelf = function() {
    //     background(200);
    // };

    test_cases.forEach((p, i) => {
        let text_node = new TextNode(p['content'], true, p['font'], p['font-size'], p['line-height'])
        text_node.setTranslate(100, 100*(i+1))
        scene.addChild(text_node)
    });

    return scene
}