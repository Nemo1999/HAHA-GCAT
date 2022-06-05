// This Copy from a comment by dave pagurek
// link: https://github.com/processing/p5.js/issues/3610#issuecomment-920459238

// use globalComposition Operation to Speed up tint implementation of P5.js

p5.Renderer2D.prototype._getTintedImageCanvas = function(img) {
    if (!img.canvas) {
      return img;
    }
  
    if (!img.tintCanvas) {
      // Once an image has been tinted, keep its tint canvas
      // around so we don't need to re-incur the cost of
      // creating a new one for each tint
      img.tintCanvas = document.createElement('canvas');
    }
  
    // Keep the size of the tint canvas up-to-date
    if (img.tintCanvas.width !== img.canvas.width) {
      img.tintCanvas.width = img.canvas.width;
    }
    if (img.tintCanvas.height !== img.canvas.height) {
      img.tintCanvas.height = img.canvas.height;
    }
  
    // Goal: multiply the r,g,b,a values of the source by
    // the r,g,b,a values of the tint color
    const ctx = img.tintCanvas.getContext('2d');
  
    ctx.save();
    ctx.clearRect(0, 0, img.canvas.width, img.canvas.height);
  
    if (this._tint[0] < 255 || this._tint[1] < 255 || this._tint[2] < 255) {
      // Color tint: we need to use the multiply blend mode to change the colors.
      // However, the canvas implementation of this destroys the alpha channel of
      // the image. To accommodate, we first get a version of the image with full
      // opacity everywhere, tint using multiply, and then use the destination-in
      // blend mode to restore the alpha channel again.
  
      // Start with the original image
      ctx.drawImage(img.canvas, 0, 0);
  
      // This blend mode makes everything opaque but forces the luma to match
      // the original image again
      ctx.globalCompositeOperation = 'luminosity';
      ctx.drawImage(img.canvas, 0, 0);
  
      // This blend mode forces the hue and chroma to match the original image.
      // After this we should have the original again, but with full opacity.
      ctx.globalCompositeOperation = 'color';
      ctx.drawImage(img.canvas, 0, 0);
  
      // Apply color tint
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = `rgb(${this._tint.slice(0, 3).join(', ')})`;
      ctx.fillRect(0, 0, img.canvas.width, img.canvas.height);
  
      // Replace the alpha channel with the original alpha * the alpha tint
      ctx.globalCompositeOperation = 'destination-in';
      ctx.globalAlpha = this._tint[3] / 255;
      ctx.drawImage(img.canvas, 0, 0);
    } else {
      // If we only need to change the alpha, we can skip all the extra work!
      ctx.globalAlpha = this._tint[3] / 255;
      ctx.drawImage(img.canvas, 0, 0);
    }
  
    ctx.restore();
    return img.tintCanvas;
  };
