class TextNode extends SizeNode{
    constructor(text, message_control=true,  fontFamily="openhuninn", fontSize=32, lineHeight = 1){
        super(text, 10, 10, message_control, false)
        this.element = createP(text);
        this.fontSize = fontSize
        this.element.style("font-size", fontSize+"px")
        this.fontFamily = fontFamily
        this.element.style("font-family", fontFamily)
        this.lineHeight = lineHeight
        this.element.style("line-height", lineHeight+"em")
        this.element.style("overflow", "hidden")
        //this.element.style("left", "1%")
        this.element.style("top", "1%")
        this.element.style("right", "1%")
        //this.element.style("bottom", "1%")
        this.element.style("text-align", "center")
        //this.element.style("margin", "1%") 
        this.element.style("height","fit-content")
        this.element.style("width","fit-content")
        /*
        const halfWidthMatches = (text.match(/[\u0000-\u00ff]/g)) //Half-width characters
        const chineseMatches = (text.match(/[\u4e00-\u9fa5]/g)) //Chinese characters
        const fullWidthMatches = (text.match(/[\uff00-\uffff]/g)) //full width chracters
        console.log(halfWidthMatches, chineseMatches, fullWidthMatches)
        const numHalf = halfWidthMatches ? halfWidthMatches.length : 0
        const numChinese = chineseMatches ? chineseMatches.length : 0
        const numFull = fullWidthMatches ? fullWidthMatches.length : 0
        console.log(numHalf, numChinese, numFull)
        const numEM = Math.ceil(numHalf / 2) + numChinese + numFull
        console.log(numEM)
        this.element.style("width", numEM +"em")
        */


        this.color = [0,0,0]
        this.elt = this.element.elt
        this.elt.style.zIndex = 2000
        width = this.elt.clientWidth
        height = this.elt.clientHeight
        this.fitDrawnSize(width,height)
        
        //hide self in the begining 
        //this.hide()
        this.show()

        this.onMouseEnter = null;
        this.onMouseExit = null;
        
        this.onMouseClick = null;
        this.onMouseRelease = null;
        this.onMousePress = null;

        this.element.mouseReleased(()=>{if(this.onMouseRelease){this.onMouseRelease()}})
        this.element.mouseOver(()=>{if(this.onMouseEnter){this.onMouseEnter()}})
        this.element.mouseOut(()=>{if(this.onMouseExit){this.onMouseExit()}})
        this.element.mouseClicked(()=>{if(this.onMouseClick){this.onMouseClick()}})
        this.element.mousePressed(()=>{if(this.onMousePress){this.onMousePress()}})
    }
    setColor(r,g,b){
        if(r<1 && g<1 && b<1){
            r*=255
            g*=255
            b*=255
        } 
        this.color = [r,g,b]
    }
    updateSize(){
        this.fitDrawnSize(this.elt.clientWidth, this.elt.clientWidth)
    }
    setFontFamily(fontFamily){
        this.fontFamily = fontFamily
        this.element.style("font-family", fontFamily)
        this.updateSize()
    }
    setFontSize(fontSize){
        this.fontSize = fontSize
        this.element.style("font-size", fontSize + "px")
        this.updateSize()
    }
    setLineHeight(lineHeight){
        this.lineHeight = lineHeight
        this.element.style("line-height", lineHeight+"em")
    }
    render(){
        super.render()
        console.log("render")
        this.elt.style.display = "absolute"
        this.element.position(this.accX, this.accY)
        const r = this.color[0] * this.accTintColor[0]
        const g = this.color[1] * this.accTintColor[1]
        const b = this.color[2] * this.accTintColor[2]
        this.element.style("color", "rgba("+r+","+g+","+b+","+this.accAlpha+")")
    }
    show(value=true){
        
        super.show(value)
        if (value == true){
            this.elt.style.display = "absolute"
        }
        else if (value == false){
            this.elt.style.display = "none"
        }
        else{
            this.elt.style.display = "absolute"
        }
    }
    hide(){
        super.hide()
        this.elt.style.display = "none"
    }
    






}