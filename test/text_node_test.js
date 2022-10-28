function t_font_family(scene_name='font_family') {
    const test_cases = [
        {
            'content': 'HAHA-GCAT 綠毛蟲要過河',
            'style': {
                'font-family': 'Serif',
                'font-size': 16,
            }
        },
        {
            'content': 'HAHA-GCAT 綠毛蟲要過河',
            'style': {
                'font-family': 'Courier New',
                'font-size': 16,
            }
        }
    ];

    // scene
    const scene = new Scene(scene_name);
    
    scene.reloadSelf = function() {
        this.activate()
        this.show()
    };

    test_cases.forEach((p, i) => {
        let text_node = new TextNode('text'+i, p['content'], true, p['style'])
        text_node.setTranslate(100, 100*(i+1))
        scene.addChild(text_node)
    });

    return scene
}

function t_text_scaling(scene_name='text_scaling') {
    const test_cases = [
        {
            'content': 'HAHA-GCAT 綠毛蟲要過河',
            'scale': 1,
            'style': {
                'font-family': 'serif',
                'font-size': 16,
            },
        },
        {
            'content': 'HAHA-GCAT 綠毛蟲要過河',
            'scale': 2,
            'style': {
                'font-family': 'openhuninn',
                'font-size': 16,
            },
        }
    ];

    // scene
    const scene = new Scene(scene_name);
    
    scene.reloadSelf = function() {
        this.activate()
        this.show()
    };

    test_cases.forEach((p, i) => {
        let text_node = new TextNode('text'+i, p['content'], true, p['style'])
        text_node.setTranslate(100, 100*(i+1))
        text_node.setScale(p['scale'])
        scene.addChild(text_node)
    });

    return scene
}