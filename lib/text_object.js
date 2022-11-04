class TextNode extends SizeNode {
    constructor(name, str, message_control=true){
        super(name, 1, 1, message_control, false)
        
        this._text = str;
        this._font = null;
        this._fontSize = 12;
        this._fontStyle = NORMAL;
        this._align = LEFT;
        this._lineHeight = this.fontSize;
        this._color = [0, 0, 0, 255];

        this.drawSelf = function() {
            if(this._font != null) {
                textFont(this._font);
            }
            textSize(this._fontSize);
            textStyle(this._fontStyle);
            textAlign(this._align);
            textLeading(this._lineHeight);
            fill(...this._color);

            text(this._text, ...this.translation);
            smooth();
        };
    }

    /**
     * 
     * @param {p5.Font|string} font 
     */
    font(font){
        this._font = font;
        return this;
    }

    fontSize(size) {
        this._fontSize = size;
        return this;
    }
    
    fontStyle(style) {
        this._fontStyle = style;
        return this;
    }

    align(align) {
        this._align = align;
        return this;
    }

    lineHeight(height) {
        this._lineHeight = height;
        return this;
    }

    color(r, g, b, a) {
        if(r<1 && g<1 && b<1 && a<1){
            r*=255
            g*=255
            b*=255
            a*=255
        }

        this._color = [r, g, b, a];
        return this;
    }
}