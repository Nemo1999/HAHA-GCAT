
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

class spriteLoader{
    constructor(sprite_path_list){
        this.sprite_path_list = sprite_path_list;
        this.sprite_loaded = 0;
        this.sprite_total = sprite_path_list.length;
        this.json = {}
        this.image = {}
        this.ready = false
    }
    async load_sprite(sprite_path, progress_callback, ready_callback){
        const filename = sprite_path.substring(sprite_path.lastIndexOf('/')+1);
        const scene_name = filename.substring(0, filename.lastIndexOf('.'));
        console.log("parsing sprite: " + filename);
        // fetch json file 
        this.json[scene_name] = await fetch(sprite_path).then(response => response.json());
        // load image 
        const png_url = sprite_path.substring(0, sprite_path.lastIndexOf('.')) + ".png";
        this.image[scene_name] = await async_load_image(png_url);
        this.sprite_loaded++;
        if(typeof progress_callback == "function"){
            progress_callback(this.sprite_loaded / this.sprite_total);
        }
        
        if(this.sprite_loaded == this.sprite_total){
            this.ready = true;
            if(typeof ready_callback == "function"){
                ready_callback();
            }
        }
    }
    async load_all(progress_callback, ready_callback){
        if(typeof progress_callback == "function"){
            progress_callback(0);
        }
        await Promise.all(this.sprite_path_list.map(x=>this.load_sprite(x, progress_callback, ready_callback)));
    }
    draw_sprite(scene_name, sprite_name, x, y, w, h){
        if(!this.ready){console.error("spritesheet accessed before loading complete");return;}
        const sprite_image = this.image[scene_name];
        const sprite_frame = this.json[scene_name]["frames"][sprite_name]["frame"];
        if(!sprite_frame || !sprite_image){console.error("error fetching sprite data: ",scene_name, sprite_name);return;}
        image(sprite_image, x, y, w, h, sprite_frame["x"], sprite_frame["y"], sprite_frame["w"], sprite_frame["h"]);
    }
    get_sprite_image(scene_name, sprite_name, destImage){
        if(!this.ready){console.error("spritesheet accessed before loading complete");return;}
        const sprite_image = this.image[scene_name];
        const sprite_frame = this.json[scene_name]["frames"][sprite_name]["frame"];

        if(!sprite_frame || !sprite_image){console.error("error fetching sprite data: ",scene_name, sprite_name);return;}
        destImage.copy(sprite_image, sprite_frame["x"], sprite_frame["y"], sprite_frame["w"], sprite_frame["h"], 0, 0, sprite_frame["w"], sprite_frame["h"]);
    }
    get_size(scene_name, sprite_name){
        if(!this.ready){console.error("spritesheet accessed before loading complete");return;}
        console.log(this.json)
        const sprite_frame = this.json[scene_name]["frames"][sprite_name]["frame"];
        return [sprite_frame["w"], sprite_frame["h"]];
    }
    get_animation_frame(scene_name, animation_name){
        if(!this.ready){console.error("spritesheet accessed before loading complete");return;}
        return Array.from(this.json[scene_name]["animations"][animation_name])
    }
}
