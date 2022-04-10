/** This file defines Scene, Node and SceneManager classes. 
 *  
 *  Node is a container for objects on the scene
 *  Node can be a container for other nodes
 *  Node can be a leaf node (e.g. a picture / shape / text)
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
 *  The scene is hidden when it first registered.
 *  The scene can request to be shown by calling self.Show()
 *  The scene can request to be hidden by calling self.Hide()
 *  The scene can request to be removed by calling self.Remove()
 *  
 *  The communication between scenes done by subscribing to topics
 *  I use implemetation here (https://github.com/mroderick/PubSubJS) 
 *  because it defaults to asynchronous semantics, which avoid unexpected blocking behavior when message handeler publish another message. 
 * 
 * 
 *  @author BO-YU Cheng <nemo1999.eecs06@g2.nctu.edu.tw>
 *  @version 0.0.1   2022/04/08
 **/


class Node{
    constructor(){
        // transforms
        this.theta = 0;
        this.scale = 1;
        this.translation = [0,0]
        this.additional_transforms = [];

        // children
        // Note that all children will be affected by the transforms of the parent
        this.children = []; // the cildren will be drawn in the order of this array
        this.parent = null; // the parent will be drawn after all children
        // state
        this.visible = true; // if true,  render() will be called at each frame
        this.active = true; //  if true,  update() will be called at each frame

        // time control (milliseconds)
        this.acc_t = 0; // accumulated time since object creation
        this.del_t = 0; // time since last update
        
        // callbacks handeling 
        this.subcriptions = []; // each element contains {topic: t, token: k, callback: c}

        // deleteing self
    }

    update(deltaT){
        this.acc_t += deltaT;
        this.del_t = deltaT;
        this.update_self(); // implement in child class
    }
    render(){
        push();
        // apply transforms
        rotate(this.theta);
        scale(this.scale);
        translate(...this.translation)
        for(t of this.additional_transforms){
            t();
        }
        
        // render children
        for(ch of this.children){
            ch.updata(deltaT)
            ch.render()
        }

        // render self
        this.draw_self(); // implement in child class

        // restore transforms
        pop();
    }
    
    update_self(){
        //define in child class
    }
    
    draw_self(){
        //define in child class
    }

    add_child(child){
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
        for(ch of temp_children){
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
    rotate(theta){
        this.theta = theta;
    }
    scale(scale){
        this.scale = scale;
    }
    translate(x,y){
        this.translate = [x,y]
    }
    
}

class Scene extends Node{
    constructor(){

    }
}




