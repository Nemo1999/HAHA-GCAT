/*****
 * This class is used to load sprites from a json files generated by TexturePacker(https://www.codeandweb.com/texturepacker).
 * The spritesheet's json URL is passed in constructor
 * when SpriteLoader.load() method is called, the loader will tries to load the json file
 * and an PNG image file assume to be the same  name as the json file
 * 
 * The user can acces the image file by calling SpriteLoader.draw(image_name, x, y, w, h) method
 * which will draw the image at the specified position
 * 
 * The user can also get a copy of a file by calling SpriteLoader.copy(image_name) method
 * which will return a copy of the specified image region
 * 
 * Other methods include:
 * SpriteLoader.get_size(image_name)
 * SpriteLoader.get_animation_frames(animation_name)
 * 
 * 
 * @author BO-YU Cheng <nemo1999.eecs06@g2.nctu.edu.tw>
 * @version 0.0.1   2020/04/10
 * 
 */


async function async_load_image(url){
    // convert p5JS laodImage into async function
    return new Promise(function(resolve, reject){
        function onSuccess(p5Image){
            resolve(p5Image);    
        }
        function onFailure(error){
            console.error("p5 load image fail:", error);
            reject(error);
        }
        loadImage(url, onSuccess, onFailure);
    });
} 

// a sprite handel is provided by spriteloader, to be access the sprite image after loading complete
class SpriteHandle{
    constructor(sprite_name, drawfunc, get_size, copy_func, isReady){
        this.name = sprite_name;
        this.draw = drawfunc;
        this.getSize = get_size;
        this.copy = copy_func;
        this.isReady = isReady;
    }
}

class SpriteLoader{
    constructor(sprite_path){
        this.sprite_path = sprite_path;
        this.json = null
        this.image = null
        this.ready = false
        this.onFinish = null
    }
    async load(onFinish){
        console.log("spriteLoader loading sprite: " + this.sprite_path);
        
        // Add headers that requires the browser not to cache file (for debugging convenience)
        const requestHeaders = new Headers(
            {
                'pragma': 'no-cache',
                'cache-control': 'no-cache', 
            }
        );
        const requestInit = {
            method: 'GET',
            headers: requestHeaders
        }; 

        // start fetching json file asynchronously 
        this.json = fetch(this.sprite_path, requestInit).then(response => response.json());
        // load image 
        const png_url = this.sprite_path.substring(0, this.sprite_path.lastIndexOf('.')) + ".png";
        this.image = async_load_image(png_url);
        // wait for both json and image to be loaded
        [this.json, this.image] = await Promise.all([this.json, this.image])
        // ready, trigger callback
        this.ready = true
        if(typeof onFinish == "function"){
                onFinish(this);
        }
        //console.log(this.json, this.image)
        return this
    }
    // return an handler to a image, support draw / copy and provide width and height info 
    get_handle(sprite_name){
        if(typeof sprite_name == "string"){
            return this.get_single_sprite_handle(sprite_name);
        }
        else if( sprite_name instanceof Array){
            return sprite_name.map(s => this.get_single_sprite_handle(s));
        }else{
            throw "invalide argument to sprite handle"
        }
    }
    get_single_sprite_handle(sprite_name){
        var handle  = new SpriteHandle(
            sprite_name,
            (x,y,w,h) => {this.draw(sprite_name, x, y, w, h)},
            ()=>{return this.get_size(sprite_name)},
            () => {return this.copy(sprite_name)},
            ()=> {return this.ready}
        )
        return handle;
    }
    // draw sprite image on the canvas location
    draw(sprite_name, x, y, w, h){
        this.check_sprite_available(sprite_name);
        const sprite_frame = this.json["frames"][sprite_name]["frame"];
        if(w == undefined || h == undefined){
            w = sprite_frame["w"];
            h = sprite_frame["h"];   
        }
        if(x == undefined || y == undefined){
            x = 0;
            y = 0;
        }
        image(this.image, x, y, w, h, sprite_frame["x"], sprite_frame["y"], sprite_frame["w"], sprite_frame["h"]);
    }
    // get sprite image as copy
    copy(sprite_name){
        this.check_sprite_available(sprite_name);
        const sprite_frame = this.json["frames"][sprite_name]["frame"];
        let img = createImage(sprite_frame["w"], sprite_frame["h"]);
        img.copy(this.image, sprite_frame["x"], sprite_frame["y"]-1, sprite_frame["w"]-1, sprite_frame["h"]-1, 0, 0, sprite_frame["w"], sprite_frame["h"]);
        return img;
    }
    // get the size of a sprite image
    get_size(sprite_name){
        //console.log(this)
        this.check_sprite_available(sprite_name);
        const sprite_frame = this.json["frames"][sprite_name]["frame"];
        return [sprite_frame["w"], sprite_frame["h"]];
    }
    // check that  image is loaded and sprite name exists
    check_sprite_available(sprite_name){
        if(!this.ready){console.error("spritesheet accessed before loading complete");return;}
        if(this.json["frames"].hasOwnProperty(sprite_name)){
            return true;
        }
        else{
            console.error("" + sprite_name + " is not a valid sprite name");
            const possible_names = Object.keys(this.json["frames"]);
            console.error("possible names: " + possible_names);
        }
    }

    // TexturePacker auto detects animation images( those image names have same prefix, and are appended by frame number)
    // The info is provided in the json file.
    // This method return an Array of sprites name for a given animation name
    get_animation_frames(animation_name){
        if(!this.ready){console.error("spritesheet accessed before loading complete");return;}
        if(this.json["animations"].hasAttribute(animation_name)){
            return Array.from(this.json["animations"][animation_name])
        }else{
            console.error("error fetching animation data: ", animation_name);
            console.error("possible animation names: ", this.json["animations"]);
            throw new Error("animation not found: " + animation_name);
        }
    }
}
