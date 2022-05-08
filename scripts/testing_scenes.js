function test_scene(sm){
    var scene = new Scene("test_scene");
    var container = new SizeNode("contrainer", windowWidth/2, windowHeight/2);
    container.drawSelf = function(){
      fill(0);
      noStroke();
      rect(0,0,this.size[0], this.size[1]);
    }
    
    var ball = new SizeNode("ball", 100, 100, true, true)
    ball.state.color=color("#FF0000")
    ball.drawSelf = function(){
      fill(ball.state.color);
      noStroke();
      ellipse(this.size[0]/2,this.size[1]/2,this.size[0], this.size[1]);
    }
    ball.onMouseEnter = function(){
      this.setSize(this.size[0]+20,this.size[1]+20);
    }
    ball.onMouseExit = function(){
      this.setSize(this.size[0]-20,this.size[1]-20);
    }
    ball.onMousePress = function(){
      this.state.color = color("#00FF00");
    }
    ball.onMouseRelease = function(){
      this.state.color = color("#FF0000");
    }
    ball.onMouseDrag = function(self, currentPoint, startPoint){
      this.setTranslate(currentPoint[0]-this.size[0]/2, currentPoint[1]-this.size[1]/2);
    }
    ball.onMouseClick = function(){
      this.setSize(this.size[0]+20,this.size[1]+20);
    }
  
    container.addChild(ball);
    scene.addChild(container);
    scene.activate();
    scene.show()
    return scene;
  }