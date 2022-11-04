function t_text_font(scene_name='text_font') {
    const test_cases = [
        {
            'content': 'HAHA-GCAT 綠毛蟲要過河',
            'font': 'serif',
            'fontSize': 16,
        },
        {
            'content': 'HAHA-GCAT 綠毛蟲要過河',
            'font': 'sans-serif',
            'fontSize': 20,
        },
        {
            'content': 'HAHA-GCAT 綠毛蟲要過河',
            'font': font_huninn,
            'fontSize': 32,
        }
    ];

    // scene
    const scene = new Scene(scene_name);
    
    scene.reloadSelf = function() {
        this.activate();
        this.show();
    };

    test_cases.forEach((p, i) => {
        let text_node = new TextNode('text'+i, p['content'], true);
        text_node.font(p['font']).fontSize(p['fontSize']);
        text_node.setTranslate(200, 60*(i+1));
        scene.addChild(text_node);
    });

    return scene;
}

function t_text_scaling(scene_name='text_scaling') {
    const test_cases = [
        {
            'content': 'HAHA-GCAT 綠毛蟲要過河',
            'font': 'serif',
            'scale': 1,
        },
        {
            'content': 'HAHA-GCAT 綠毛蟲要過河\n', 
            'font': font_huninn,
            'scale': 2,
        }
    ];

    const scene = new Scene(scene_name);
    
    scene.reloadSelf = function() {
        this.activate();
        this.show();
    };

    test_cases.forEach((p, i) => {
        let text_node = new TextNode('text'+i, p['content'], true);
        text_node.font(p['font']);
        text_node.setTranslate(100, 60*(i+1));
        text_node.setScale(p['scale']);
        scene.addChild(text_node);
    });

    return scene;
}

// TEST: render numerous text
function t_render_blob(scene_name='render_blob') {
    const scene = new Scene(scene_name);
    
    scene.reloadSelf = function() {
        this.activate();
        this.show();
    };

    var rawFile = new XMLHttpRequest();
    rawFile.open('GET', 'user_agreement.txt', false);
    rawFile.onreadystatechange = function() {
        if(rawFile.readyState === 4) {
            if(rawFile.status === 200 || rawFile.status == 0) {
                let content = rawFile.responseText;
                let text_node = new TextNode('text', content);
                scene.addChild(text_node);
            }
        }
    }
    rawFile.send(null);

    return scene;
}

// TEST: show/hide text nodes
function t_text_show(scene_name='text_show') {
    const test_cases = [
        {
            'content': 'HAHA-GCAT 綠毛蟲要過河',
            'font': font_huninn,
            'fontSize': 32,
            'color': [255, 166, 148, 255],
            'show': true,
        },
        {
            'content': 'HAHA-GCAT 綠毛蟲要過河', 
            'font': font_huninn,
            'fontSize': 32,
            'color': [148, 193, 255, 255],
            'show': false,
        }
    ];

    const scene = new Scene(scene_name);
    
    scene.reloadSelf = function() {
        this.activate();
        this.show();
    };

    test_cases.forEach((p, i) => {
        let text_node = new TextNode('text'+i, p['content'], true);
        text_node
          .font(p['font'])
          .fontSize(p['fontSize'])
          .color(p['color']);
        text_node.setTranslate(100, 60*(i+1));
        text_node.updateSelf = function() {
            text_node.hide();
            if(p['show']) {
                text_node.show();
            }
        }
        
        scene.addChild(text_node);
    });

    return scene;
}
