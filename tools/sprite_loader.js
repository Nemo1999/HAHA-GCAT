
async function sync_load_image(url){
    // convert p5JS laodImage into async function
    return new Promise(function(resolve, reject){
        function onSuccess(p5Image){
            resolve(p5Image);    
        }
        function onFailure(error){
            console.error("p5 load image fail:", error);
            reject(error);
        }
        loadImage(url, [onSuccess], [onFailure]);
    });
} 



class spriteLoader{
    constructor(sprite_path_list){
        this.sprite_path_list = sprite_path_list;
        this.sprite_loaded = 0;
        this.sprite_total = sprite_path_list.length;
        this.json = {}
        this.image = {}
    }
    async load_sprite(sprite_path){
        const filename = sprite_path.substring(sprite_path.lastIndexOf('/')+1);
        const scene_name = filename.substring(0, filename.lastIndexOf('.'));
        console.log("parsing sprite: " + filename);
        // fetch json file 
        this.data[scene_name] = await fetch(sprite_path).then(response => response.json());
        // load image 
        this.image[scene_name] = loadImage(this.data[scene_name].meta.image);
        
        this.sprite_loaded++;
    }
    load_all(){

    }
    
}
