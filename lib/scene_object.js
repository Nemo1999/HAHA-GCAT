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
                
        this.state = {};
        // current scene manager
        this.sm = null
        // net effect of transforms
        this.accX = 0;
        this.accY = 0;
        this.accTheta = 0;
        this.accScale = 1;

        // children
        // Note that all children will be affected by the transforms of the parent
        this.children = []; // the cildren will be rendered in the order of this array
        this.parent = null; // the parent will be rendered before all children
        // state
        this.visible = true; // if true,  render() will be called at each frame
        this.active = true; //  if true,  update() will be called at each frame
        
        // time control (milliseconds)
        this.accTime = 0; // accumulated time since object creation
        this.delTime = 0; // time since last update

        // callbacks handeling 
        this.subcriptions = []; // each element contains {topic: t, token: k, callback: c}

        // default update_self and draw_self
        this.updateSelf = null
        this.drawSelf = null

        // receive message for killing / activate / deactivate / show / hide
        if(message_control){
            this.subscribe(this.name, (node, topic, data) => {
                if(topic == this.name){
                    if(data == "kill"){
                        this.removeSelf();
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
    update(deltaT){
        if(this.active == false){ return;}
        this.accTime += deltaT;
        this.delTime = deltaT;
        if(this.updateSelf != null){
            this.updateSelf(deltaT); //implement in child class or specify externally
        }
        // update children
        for(var ch of this.children){
            ch.update(deltaT);
        }
    }
    render(){
        if(this.visible == false){ return;}
        tf.push();
            // apply transforms
            tf.rotate(this.theta)
            tf.translate(...this.translation)
            tf.scale(this.scale);
        
            // record net effect of transforms
            this.accX = tf.x
            this.accY = tf.y
            this.accTheta = tf.a
            this.accScale = tf.s

            // apply additional transforms on only self 
            push();
                if(this.drawSelf != null){
                    this.drawSelf(); // implement in child class
                }
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


    addChild(child){
        if(child instanceof Scene){
            console.error("Scene should be top-level Node")
            console.error("Cannot add a scene as a child of a Node")
            return 
        }
        child.parent = this;
        this.children.push(child);
        // update the scene manager of the child tree
        child.traverseDescendants((node) => {
            node.sm = this.sm;
        })
    }
    traverseDescendants(f){
        f(this);
        for(var ch of this.children){
            ch.traverseDescendants(f);
        }
    }
    removeChild(child){
        var index = this.children.indexOf(child);
        //remove all child instance from children array
        while(index != -1){
            child.parent = null;
            this.children.splice(index, 1);
            index = this.children.indexOf(child);
        }
    }

    removeSelf(){
        this.unsubscribeAll();
        // need to clone the childern array to avoid changing the same array in forloop
        var temp_children = [...this.children]
        for(var ch of temp_children){
            // removeSelf of children wil remove itself from this.children list.
            ch.removeSelf()
        }
        if(this.parent != null){
            this.parent.removeChild(this);
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
    unsubscribeTopic(topic){
        for(var sub of this.subcriptions){
            if(sub.topic == topic){
                PubSub.unsubscribe(sub.token);
                this.subcriptions.splice(this.subcriptions.indexOf(sub), 1);
            }
        }
    }
    unsubscribeToken(token){
        for(var sub of this.subcriptions){
            if(sub.token == token){
                PubSub.unsubscribe(sub.token);
                this.subcriptions.splice(this.subcriptions.indexOf(sub), 1);
            }
        }
    }
    unsubscribeCallback(callback){
        for(var sub of this.subcriptions){
            if(sub.callback == callback){
                PubSub.unsubscribe(sub.token);
                this.subcriptions.splice(this.subcriptions.indexOf(sub), 1);
            }
        }
    }

    unsubscribeAll(){
        for(var sub of this.subcriptions){
            PubSub.unsubscribe(sub.token);
        }
        this.subcriptions = [];
    }
    setRotate(theta){
        this.theta = theta;
    }
    setScale(scale){
        this.scale = scale;
    }
    setTranslate(x,y){
        this.translation = [x,y]
    }
    
}

/* Seperate mouse logic from sprite sheet logic */
class SizeNode extends Node{
    constructor(name, width, height, message_control=true){
        super(name, message_control)
        // the original size of the node, without scaling
        this.size = [width, height];
        // the size of the node drawn on canvas (after scaling)
        this.drawnSize = [this.accScale * this.size[0], this.accScale * this.size[1]]
        
        this.mouseHovered= false;
        this.mouseHoveredPrev = false;
        // mouse events
        this.onMouseEnter = null;
        this.onMouseExit = null;

        this.onMouseRelease = null;
        this.onMousePress = null;
        
        // track the position pressed of current drag 
        this.dragStartPos = null;
        // is the mouse dragging this node? (previous press is inside bbox and havn't released yet)
        this.isDragging = false;
        this.onMouseDrag = null; //parameters: (this, currentPos, startPos)

        // click is triggered when the mouse stays hovered between the press and release 
        this.noExitSincePress = false;
        this.onMouseClick = null;
        
        // mouse wheel is trigger whenever the mouse is in interactive list of this.sm
        // i.e. the mouse is either hovering this node
        // or the mouse is dragging this node
        this.onMouseScroll = null;
    }

    handleMouseEnter(){
        console.log("enter")
        if(this.onMouseEnter != null){
            this.onMouseEnter(this);
        }
        if(!this.isDragging){
            this.sm.addInteractingNode(this);
        }
        
    }
    handleMouseExit(){
        console.log("exit")
        if(this.onMouseExit != null){
            this.onMouseExit(this);
        }
        this.noExitSincePress = false;
        if(!this.isDragging){
            this.sm.removeInteractingNode(this);
        }
        else{
            //exit click state
            this.hovering_since_pressed = false;
        }
    }
    handleMouseDrag(event){
        // this checking is to prevent the node from receiving dragging event that start from outside of its bbox
        // we only want to receive dragging event that start from inside of its bbox
        if(this.isDragging == true){
            if(this.onMouseDrag != null){
                this.onMouseDrag(this, [event.clientX, event.clientY], this.dragStartPos);
            }
        }
    }

    handleMousePress(){
        this.isDragging = true;
        this.dragStartPos = [mouseX, mouseY];
        this.noExitSincePress = true;
        if(this.onMousePress != null){
            this.onMousePress(this);
        }
    }

    handleMouseRelease(){
        if(this.onMouseRelease != null){
            this.onMouseRelease(this);
        }
        // if not dragging, then the mouse is comming from an outside drag event
        if(this.isDragging == true){
            if(this.noExitSincePress == true){
                //mouse clicked
                if(this.onMouseClick != null){
                    this.onMouseClick(this);
                }
                this.noExitSincePress = false;
                this.isDragging = false;
            }
            else{
                if(!this.mouseHovered){
                    this.sm.removeInteractingNode(this);
                }
                this.isDragging = false;
            }
        }
    }

    handleMouseScroll(delta){
        if(this.onMouseScroll != null){
            this.onMouseScroll(delta);
        }
    }

    checkMouseHover(){
        const s = this.drawnSize;
        const xIN = mouseX > this.accX && mouseX < this.accX + s[0];
        const yIN = mouseY > this.accY && mouseY < this.accY + s[1];
        return xIN && yIN;
    }

    update(deltaT){
        if(this.active == false){ return;}
        //update this.acc_scale and maybe this.size (user modify using this.set_size())
        super.update(deltaT);
        const s = this.size
        this.drawnSize = [this.accScale * s[0], this.accScale * s[1]]
        
        //update mouse events
        this.mouseHoveredPrev = this.mouseHovered;
        this.mouseHovered = this.checkMouseHover();
        // add self to sm.hovered_nodes for handling release/press/drag events
        if(!this.mouseHoveredPrev && this.mouseHovered){
            this.handleMouseEnter()
        }
        if(this.mouseHoveredPrev && !this.mouseHovered){
            this.handleMouseExit()
        }
        
    }
    setSize(x,y){
        this.size = [x,y]
        this.drawnSize = [this.accScale * this.width, this.accScale * this.height]
    }
    fitDrawnSize(x,y){
        this.drawnSize = [x,y]
        this.size = [x/this.accScale, y/this.accScale]
    }
}
/*
class SpriteNode extends SizeNode{

}
*/
class SpriteNode extends Node{
    constructor(spriteHandle, messageControl=true){
        var name
        var sph
        if(spriteHandle instanceof SpriteHandle){
            sph = [spriteHandle]
            name = spriteHandle.name
        }
        else if(spriteHandle instanceof Array){
            if(!spriteHandle[0] instanceof SpriteHandle){
                throw `constructor: SpriteNode() expects 'SpriteHandle' or '[SprideHandel]', got ${sp_handle}`
            }
            sph = spriteHandle
            name = spriteHandle[0].name
        }
        super(name, messageControl)
        this.spriteHandle = sph
        this.spriteIndex = 0;
        this.spriteCnt = this.spriteHandle.length
        this.spriteW = 0
        this.spriteH = 0
        
        this.size = [this.accScale * this.spriteW, this.accScale * this.spriteH]
        this.forced_size = null
        this.mouseHovered = false;
        // mouse event
        this.onMouseEnter = null;
        this.onMouseExit = null;
        this.onMouseClick = null;
        this.onMousePress = null;
        this.onMouseDrag = null;

        this.draw_self = function(){
            const sp = this.spriteHandle[this.spriteIndex]
            if(this.forcedSize){
                sp.draw(0,0,this.forcedSize[0]/this.accScale, this.forcedSize[1]/this.acc_scale)
            }else{
                sp.draw()
            }
        }
    }
    //scale to fit size
    forceSize(w,h){
        this.forcedSize = [w,h]
    }
    unforceSize(){
        this.forcedSize = null
    }
    mouseHovered(){
        const s = this.forcedSize? this.forcedSize: this.size;
        const x_in = mouseX > this.accX && mouseX < this.accX + s[0];
        const y_in = mouseY > this.accY && mouseY < this.accY + s[1];
        this.mouseHovered = x_in && y_in;
        return this.mouseHovered
    }
    update(deltaT){
        super.update(deltaT);
        [this.spriteW, this.spriteH] = this.spriteHandle[this.spriteIndex].getSize()
        this.size = [this.accScale * this.spriteW, this.accScale * this.spriteH]
    }
    nextSprite(){
        this.spriteIndex = (this.spriteIndex + 1) % this.spriteCnt
    }
    setSprite(ind_or_name){
        if(typeof ind_or_name == "number"){
            this.spriteIndex = ind_or_name
        }
        else if(typeof ind_or_name == "string"){
            for(var i = 0; i < this.spriteCnt; i++){
                if(this.spriteHandle[i].name == ind_or_name){
                    this.spriteIndex = i
                    break
                }
            }
        }else{
            throw `setSprite: invalid argument ${ind_or_name}`
        }
    }
        
}


class Scene extends Node{
    constructor(name){
        super(name, true)
        this.deactivate();
        this.hide();
    }
    removeSelf(){
        super.removeSelf();
        this.sm.removeScene(this);
    }

}

// implement singleton class with function scope encapsulation and cache
// "update and render" of Scene manager should be the only code that runs in draw() function of p5.js 
var getSceneManager = (function(){
    var cache
    // class definition
    class SceneManager{
        constructor(){
            this.scenes=[]; // we don't use set here because the order of rendering matters
            
            // interacting nodes contrains
            // 1. hovered_nodes
            // 2. currently dragged nodes (previously pressed and haven't released yet)
            // The mouse callbackes of these nodes are triggered when sm receive mouse events.
            this.interactingNodes = new Set(); // set prevents duplicate nodes
        }
        update(deltaT){
            //clear hovered nodes before update
            for(var scene of this.scenes){
                scene.update(deltaT);
            }
        }
        render(){
            for(var scene of this.scenes){
                scene.render();
            }
        }
        addInteractingNode(node){
            this.interactingNodes.add(node);
        }

        removeInteractingNode(node){
            this.interactingNodes.delete(node);
        }
        handleMousePress(){
            for(var node of this.interactingNodes){
                node.handleMousePress();
            }
        }
        handleMouseRelease(){
            for(var node of this.interactingNodes){
                node.handleMouseRelease();
            }
        }
        handleMouseDrag(event){
            for(var node of this.interactingNodes){
                node.handleMouseDrag(event);
            }
        }
        handleMouseScroll(delta){
            for(var node of this.interactingNodes){
                node.handleMouseScroll(delta);
            }
        
        }    

        // anyone can add create and register a scene
        // one needs to forget its reference after registration.
        // (you can use:  `delete varname`) 
        addScene(scene){
            this.scenes.push(scene);
            scene.traverseDescendants(node=>{node.sm = this});
        }

        // search and get scene by name 
        // only return the first active scene that matches the name
        getScene(name){
            for(var scene of this.scenes){
                if(scene.name == name && scene.active == true){
                    return scene;
                }
            }
            return null;
        }

        // this method should only be called by the scene itself (suicide calling)
        removeScene(scene){
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





