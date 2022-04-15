/** This file defines Scene, Node and SceneManager classes. 
 *  
 *  Node is a container for objects on the scene
 *  Node can be a container for other nodes
 *  Node can be a leaf node (e.g. a picture / shape / text)
 *  A node can be inactive, which means it and its children will not be updated
 *  A node can be invisible, which means it and its children will be drawn 
 * 
 *  Scene is a extension of Node
 *  Scene wraps around all needed Nodes in a game stage or animation scene.
 *  The Nodes are organized in a tree structure.
 *  The root node is the scene itself.
 *  
 *  SceneManager is a singleton class that manages the scenes.
 *  It is responsible for managing the scenes.
 *  Anyone can create and register a scene to the scene manager
 *  After Registration, the creater should remove its own reference to the scene
 *  The scene manager will take care of the scene's life cycle. 
 *  
 *  A scene is hidden when it first initialized.
 *  A scene can request to be removed by calling self.Remove()
 *  
 *  The communication between scenes done by subscribing to topics
 *  I use implemetation here (https://github.com/mroderick/PubSubJS) 
 *  because it defaults to asynchronous semantics, which avoid unexpected blocking behavior when message handeler publish another message. 
 * 
 * 
 *  @author BO-YU Cheng <nemo1999.eecs06@g2.nctu.edu.tw>
 *  @version 0.0.1   2022/04/08
 **/

// initialize transformer instance (see /lib/transform_tracker.js)
tf = new Transformer()

class Node{
    constructor(name, message_control=true){
        this.name = name;
        // transforms
        this.theta = 0;
        this.scale = 1;
        this.translation = [0,0]
        this.additional_transforms = [];
        this.state = {};

        // net effect of transforms
        this.acc_x = 0;
        this.acc_y = 0;
        this.acc_theta = 0;
        this.acc_scale = 0;

        // children
        // Note that all children will be affected by the transforms of the parent
        this.children = []; // the cildren will be rendered in the order of this array
        this.parent = null; // the parent will be rendered before all children
        // state
        this.visible = true; // if true,  render() will be called at each frame
        this.active = true; //  if true,  update() will be called at each frame
        
        // time control (milliseconds)
        this.acc_t = 0; // accumulated time since object creation
        this.del_t = 0; // time since last update
        
        // track window size (for responsive design) 
        this.dw = windowWidth;
        this.dh = windowHeight;

        // callbacks handeling 
        this.subcriptions = []; // each element contains {topic: t, token: k, callback: c}

        // default update_self and draw_self
        this.update_self = function(deltaT,dw,dh){}
        this.draw_self = function(){}

        // receive message for killing / activate / deactivate / show / hide
        if(message_control){
            this.subscribe(this.name, (node, topic, data) => {
                if(topic == this.name){
                    if(data == "kill"){
                        this.remove_self();
                    }
                    else if(["hide", "invisible"].includes(data)){
                        this.hide();
                    }
                    else if([ "show", "visible"].includes(data)){
                        this.show();
                    }
                    else if(["activate"].includes(data)){
                        this.activate();
                    }
                    else if(["deactivate"].includes(data)){
                        this.deactivate();
                    }
                    else{
                        console.log("Unknown message: " + data)
                    }
                }
            })
        }
    }
    // delta_t is in milliseconds
    // dw and dh are the width and height of the canvas (for responsive design)
    update(deltaT, dw, dh){
        if(this.active == false){ return;}
        this.acc_t += deltaT;
        this.del_t = deltaT;
        this.dw = dw;
        this.dh = dh;

        this.update_self(deltaT,dw,dh); //implement in child class
        // update children
        for(var ch of this.children){
            ch.update(deltaT,dw,dh);
        }
    }
    render(){
        if(this.visible == false){ return;}
        tf.push();
        // apply transforms
        tf.rotate(this.theta);
        tf.translate(...this.translation)
        tf.scale(this.scale);
        
        // record net effect of transforms
        this.acc_x = tf.x
        this.acc_y = tf.y
        this.acc_theta = tf.a
        this.acc_scale = tf.s

        // apply additional transforms on pmly self 
        push();
        for(var t of this.additional_transforms){
            t();
        }
        this.draw_self(); // implement in child class
        pop();

        // render children
        for(var ch of this.children){
            ch.render()
        }
        

        // restore transforms
        tf.pop();
    }
    activate(value=true){
        this.active = value
    }
    deactivate(){
        this.active = false
    }
    show(value=true){
        this.visible = value
    }
    hide(){
        this.visible = false;
    }


    add_child(child){
        if(child instanceof Scene){
            console.error("Scene should be top-level Node")
            console.error("Cannot add a scene as a child of a Node")
            return 
        }
        child.parent = this;
        this.children.push(child);
    }

    remove_child(child){
        var index = this.children.indexOf(child);
        if(index != -1){
            child.parent = null;
            this.children.splice(index, 1);
        }
    }

    remove_self(){
        this.unsubscribe_all();
        // need to clone the childern array to avoid changing the same array in forloop
        var temp_children = [...this.children]
        for(var ch of temp_children){
            // remove_self of children wil remove itself from this.children list.
            ch.remove_self()
        }
        if(this.parent != null){
            this.parent.remove_child(this);
        }
    }

    // the callback will be passed the object reference as additional argument
    subscribe(topic, callback){
        // the callback should accept 3 arguments:  function(this_node, topic, data)
        var token = PubSub.subscribe(topic, (topic, data) => callback(this, topic, data));
        var sub = {topic: topic, token: token, callback: callback};
        this.subcriptions.push(sub);
        return sub
    }
    unsubscribe_topic(topic){
        for(var sub of this.subcriptions){
            if(sub.topic == topic){
                PubSub.unsubscribe(sub.token);
                this.subcriptions.splice(this.subcriptions.indexOf(sub), 1);
            }
        }
    }
    unsubscribe_token(token){
        for(var sub of this.subcriptions){
            if(sub.token == token){
                PubSub.unsubscribe(sub.token);
                this.subcriptions.splice(this.subcriptions.indexOf(sub), 1);
            }
        }
    }
    unsubscribe_callback(callback){
        for(var sub of this.subcriptions){
            if(sub.callback == callback){
                PubSub.unsubscribe(sub.token);
                this.subcriptions.splice(this.subcriptions.indexOf(sub), 1);
            }
        }
    }

    unsubscribe_all(){
        for(var sub of this.subcriptions){
            PubSub.unsubscribe(sub.token);
        }
        this.subcriptions = [];
    }


    clear_transform(){
        this.additional_transforms = [];
    }
    apply_transform(t){
        this.additional_transforms.push(t);
    }
    set_rotate(theta){
        this.theta = theta;
    }
    set_scale(scale){
        this.scale = scale;
    }
    set_translate(x,y){
        this.translation = [x,y]
    }
    
}

class Scene extends Node{
    constructor(name){
        super(name)
        this.manager = null;
        this.parent = null;
        this.deactivate();
        this.hide();
    }
    remove_self(){
        super.remove_self();
        this.manager.remove_scene(this);
    }

}

// implement singleton class with function scope encapsulation and cache
// "update and render" of Scene manager should be the only code that runs in draw() function of p5.js 
var getSceneManager = (function(){
    var cache
    // class definition
    class SceneManager{
        constructor(){
            this.scenes=[]
        }
        update(deltaT, dw, dh){
            for(var scene of this.scenes){
                scene.update(deltaT, dw, dh);
            }
        }
        render(){
            for(var scene of this.scenes){
                scene.render();
            }
        }
        // anyone can add create and register a scene
        // one needs to forget its reference after registration.
        // (you can use:  `delete varname`) 
        add_scene(scene){
            this.scenes.push(scene);
            scene.manager = this;
        }

        // search and get scene by name 
        // only return the first active scene that matches the name
        get_scene(name){
            for(var scene of this.scenes){
                if(scene.name == name && scene.active == true){
                    return scene;
                }
            }
            return null;
        }

        // this method should only be called by the scene itself (suicide calling)
        remove_scene(scene){
            var index = this.scenes.indexOf(scene);
            if(index != -1){
                scene.manager = null;
                this.scenes.splice(index, 1);
            }
        }
    }

    return function(){
        if(!cache){
            cache = new SceneManager()
        }
        return cache
    }
})();





