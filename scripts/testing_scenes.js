function test_scene(sm){
    var scene = new Scene("test_scene");
    var whiteBoard = new Node("whiteBoard", false);
    var container = new SizeNode("contrainer", windowWidth/2, windowHeight/2, false, true);
    var ball = new SizeNode("ball", 100, 100, true, true)
    var arrow = new Node("arrow", true)
    container.addChild(ball);
    container.addChild(arrow);
    scene.addChild(whiteBoard);
    scene.addChild(container);

    container.state.duringResize = false
    container.state.onPressSize = null
    container.drawSelf = function(){
      fill(0);
      noStroke();
      rect(0,0,this.size[0], this.size[1]);
    }
    container.onMousePress = function(){
        if(!ball.mouseHovered){
            ball.freeze = true;
            this.state.duringResize = true;
            this.state.onPressSize = [this.drawnSize[0], this.drawnSize[1]];
        }
    }
    container.onMouseDrag = function(self, currentPoint, startPoint){
        if(this.state.duringResize){
            const newX = this.state.onPressSize[0] * (currentPoint[0] / startPoint[0]);
            const newY = this.state.onPressSize[1] * (currentPoint[1] / startPoint[1]);
            this.fitDrawnSize(newX, newY);
            console.log("fitsize", newX, newY, currentPoint, startPoint);
            ball.updateSelf()
        }
    }
    container.onMouseRelease = function(){
        ball.freeze = false;
        this.state.duringResize = false;

    }

    whiteBoard.drawSelf = function(){
        background(255);
    }

    
    arrow.state.start = [0,0]
    arrow.state.end = [200,200]
    arrow.drawSelf = function(){
        console.log("drawing arrow")
        const d = dist(this.state.start[0], this.state.start[1], this.state.end[0], this.state.end[1]);
        stroke(0,255,0);
        strokeWeight(d/50);
        midPoint = [(this.state.start[0]*0.2 + this.state.end[0]*0.8), (this.state.start[1]*0.2 + this.state.end[1]*0.8)]
        line(this.state.start[0], this.state.start[1], ...midPoint);
        
        push();
        noStroke();
        fill(0,255,0);
        translate(this.state.end[0], this.state.end[1]);
        rotate(atan2(this.state.end[1]-this.state.start[1], this.state.end[0]-this.state.start[0]));
        triangle(0,4, -d/5, d/5, -d/5, -d/5);
        pop();
    }
    arrow.hide();


   
    ball.state.velocity = [0,0]
    ball.state.position = [0,0]
    ball.freeze = false;
    ball.state.color=color("#FF0000")
    ball.updateSelf = function(){
        if(!this.freeze){
            this.state.position[0] += this.state.velocity[0]
            this.state.position[1] += this.state.velocity[1]
        }


        // check and fit into bounding box
        // we may need this even if ball freeze
        // i.e. in the situation of resizing container
        const bboxXYWH = [... container.translation, ...container.drawnSize]
            
        var lrBound = [bboxXYWH[0], bboxXYWH[0]+bboxXYWH[2]-this.size[0]]
        var tbBound = [bboxXYWH[1], bboxXYWH[1]+bboxXYWH[3]-this.size[1]]
            
        //console.log(this.state.position, lrBound, tbBound)
        if(this.state.position[0] < lrBound[0] || this.state.position[0] > lrBound[1]){
            //console.log("out of bounds", lrBound)
            this.state.velocity[0] *= -1;
            this.state.position[0] = constrain(this.state.position[0], ... lrBound)
        }
        if(this.state.position[1] < tbBound[0] || this.state.position[1] > tbBound[1]){
            this.state.velocity[1] *= -1;
            this.state.position[1] = constrain(this.state.position[1], ... tbBound)
        }
        this.setTranslate(this.state.position[0], this.state.position[1])
            
        

        
    }

    ball.drawSelf = function(){
      fill(ball.state.color);
      noStroke();
      ellipse(this.size[0]/2,this.size[1]/2,this.size[0], this.size[1]);
    }
    ball.onMouseEnter = function(){
      //this.setSize(this.size[0]+20,this.size[1]+20);
      this.state.color = color("#FF8800");
    }
    ball.onMouseExit = function(){
      //this.setSize(this.size[0]-20,this.size[1]-20);
      this.state.color = color("#FF0000");
    }
    ball.onMousePress = function(){
      this.state.color = color("#FFFF00");
      arrow.state.start = [this.translation[0]+this.size[0]/2, this.translation[1]+this.size[1]/2];
      arrow.state.end = [mouseX, mouseY];
      arrow.show();
      this.freeze = true;
    }
    ball.onMouseRelease = function(){
        this.state.color = color("#FF0000");
        this.state.velocity[0] = (arrow.state.end[0] - arrow.state.start[0])/100
        this.state.velocity[1] = (arrow.state.end[1] - arrow.state.start[1])/100
        this.freeze = false;
        arrow.hide();
    }
    ball.onMouseDrag = function(self, currentPoint, startPoint){
      //this.setTranslate(currentPoint[0]-this.size[0]/2, currentPoint[1]-this.size[1]/2);
      arrow.state.end = [currentPoint[0], currentPoint[1]];
    }
    ball.onMouseClick = function(){
      //this.setSize(this.size[0]+20,this.size[1]+20);
        this.state.color = color("#00FF00");
    }
  
    

    
    
    scene.activate();
    scene.show()
    return scene;
  }