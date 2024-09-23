import { CompositeWindow } from "./Window.js";

export class ImageView extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;
        this.element.style.display = "none";

        this.element.addEventListener("mousedown", this.OnMouseDown.bind(this));
        this.element.addEventListener("mouseup", this.OnMouseUp.bind(this));
        this.element.addEventListener("mousemove", this.OnMouseMove.bind(this));
        this.element.addEventListener("dblclick", this.OnDblClick.bind(this));
        this.element.tabIndex = -1; // enable focus = enable key action
        this.element.addEventListener("keyup", this.OnKeyUp.bind(this));
        this.element.addEventListener("dragover", (event) => {
            event.preventDefault();
        });
        this.element.addEventListener("dragstart", (event) => {
            event.preventDefault();
        });
        this.element.addEventListener("dragend", (event) => {
            event.preventDefault();
        });

        this.region = document.createElement("div");
        this.region.className = "imageView-region";
        this.region.style.display = "none";
        this.region.addEventListener("mousemove", (event) => {
            event.preventDefault();
        });
        this.element.appendChild(this.region);

        this.result = document.createElement("div");
        this.result.className = "imageView-result";
        this.result.style.display = "none";
        this.element.appendChild(this.result);

        this.isDown = false;
        this.startX = 0;
        this.startY = 0;
        this.marginX = 0;

        this.image = null;
        this.canvas = null;
    }

    SetImage(source) {
        this.element.style.display = "flex";
        
        if (this.image != null) {
            this.element.removeChild(this.image);
        }
        
        this.image = document.createElement("img");
        this.image.src = source;
        this.image.style.display = "none";
        this.image.addEventListener("load", this.OnImageLoaded.bind(this));

        this.element.appendChild(this.image);
    }

    Hide() {
        this.element.style.display = "none";
    }

    OnImageLoaded(event) {
        this.image.style.display = "block";
        
        let viewRect = this.element.getBoundingClientRect();
        let imageRect = this.image.getBoundingClientRect();
        let width = imageRect.width;
        let height = imageRect.height;
        
        if (width > viewRect.width && height > viewRect.height) {
            let viewRate;
            let imageRate;
            if (viewRect.width > viewRect.height) {
                viewRate = viewRect.height / viewRect.width;
                imageRate = imageRect.height / imageRect.width;
                width = viewRect.width;
                height = width * imageRate;
                if (imageRate > viewRate) {
                    height = viewRect.height;
                    width = height * (imageRect.width / imageRect.height);
                }
            }
            else {
                viewRate = viewRect.width / viewRect.height;
                imageRate = imageRect.width / imageRect.height;
                height = viewRect.height;
                width = height * imageRate;
                if (imageRate > viewRate) {
                    width = viewRect.width;
                    height = width * (imageRect.height / imageRect.width);
                }
            }
        }
        else if (width > viewRect.width) {
            width = viewRect.width;
            height = width * (imageRect.height / imageRect.width);
        }
        else if (height > viewRect.height) {
            height = viewRect.height;
            width = height * (imageRect.width / imageRect.height);
        }
        
        this.marginX = (viewRect.width - width) / 2;
        
        this.element.style.height = height + "px";
        this.image.style.width = width + "px";
        this.image.style.height = height + "px";
        
        this.result.style.backgroundImage = "url('" + this.image.src + "')";
    }

    OnMouseDown(event) {
        if (event.ctrlKey && this.result.style.display === "none") {
            this.isDown = true;
            this.region.style.display = "block";
            this.startX = event.offsetX + this.marginX;
            if (event.target === this.element) {
                this.startX -= this.marginX;
            }
            this.startY = event.offsetY;
            this.region.style.left = this.startX + "px";
            this.region.style.top = this.startY + "px";
        }
        else {
            this.result.style.display = "none";
            if (this.canvas != null) {
                this.canvas.style.display = "none";
            }
        }
    }

    OnMouseUp(event) {
        if (event.ctrlKey) {
            if (this.isDown === true) {
                this.result.style.display = "block";

                let rect = this.region.getBoundingClientRect();
                let rate = rect.height / rect.width;

                let resultRect = this.result.getBoundingClientRect();
                let height = resultRect.width * rate;
                this.result.style.height = height + "px";

                let cx = this.result.offsetWidth / this.region.offsetWidth;
                let cy = this.result.offsetHeight / this.region.offsetHeight;
                this.result.style.backgroundSize =
                    (this.image.width * cx) + "px " +
                    (this.image.height * cy) + "px";

                let resultX = (this.startX - this.marginX) * cx;
                if (resultX < 0) {
                    resultX = 0;
                }
                let resultY = this.startY * cy;

                this.result.style.backgroundPosition =
                    "-" + resultX + "px -" + resultY + "px";
            }
        }
        this.region.style.width = 0;
        this.region.style.height = 0;
        this.region.style.display = "none";
        this.isDown = false;
        this.startX = 0;
        this.startY = 0;
    }

    OnMouseMove(event) {
        if (event.ctrlKey) {
            this.element.classList.add("sizing");
            if (this.isDown === true) {
                event.preventDefault();
                let x = event.offsetX + this.marginX;
                if (event.target === this.element) {
                    x -= this.marginX;
                }
                const y = event.offsetY;

                let width = (x - this.startX);
                let height = (y - this.startY);
                let rate = height / width;

                let rect = this.element.getBoundingClientRect();
                let originRate = rect.height / rect.width;

                rect = this.image.getBoundingClientRect();
                if (width > rect.width) {
                    width = rect.width;
                }

                if (rate > originRate) {
                    height = width * originRate;
                }

                this.region.style.width = width + "px";
                this.region.style.height = height + "px";
            }
        }
        else {
            this.element.classList.remove("sizing");
        }
    }

    OnDblClick(event) {
        if (this.result.style.display === "none") {
            this.canvas = document.createElement("canvas");
            this.canvas.className = "imageView-canvas";

            let imageRect = this.image.getBoundingClientRect();

            this.canvas.width = imageRect.width;
            this.canvas.height = imageRect.height;

            let context = this.canvas.getContext("2d");
            context.drawImage(this.image,
                0, 0, this.image.naturalWidth, this.image.naturalHeight,
                0, 0, imageRect.width, imageRect.height);

            // this.element.insertBefore(this.canvas, this.region);

            let x = event.offsetX;
            let y = event.offsetY;

            const contextAnalyzer = new ContextAnalyzer(context, imageRect.width, imageRect.height);
            let upLinePixel = contextAnalyzer.FindLineToUp(x, y);
            let downLinePixel = contextAnalyzer.FindLineToDown(x, y);

            this.region.style.display = "block";
            this.startX = 0;
            this.startY = upLinePixel.Y; //upLineY
            this.region.style.left = this.startX + "px";
            this.region.style.top = this.startY + "px";

            let rect = this.image.getBoundingClientRect();
            this.region.style.width = rect.width + "px";
            this.region.style.height = downLinePixel.Y - upLinePixel.Y + "px"; //downLineY - upLineY

            // 확대 결과 보이기
            this.result.style.display = "block";

            rect = this.region.getBoundingClientRect();
            let rate = rect.height / rect.width;

            let resultRect = this.result.getBoundingClientRect();
            let height = resultRect.width * rate;
            this.result.style.height = height + "px";

            let cx = this.result.offsetWidth / this.region.offsetWidth;
            let cy = this.result.offsetHeight / this.region.offsetHeight;
            this.result.style.backgroundSize =
                (this.image.width * cx) + "px " +
                (this.image.height * cy) + "px";
            this.result.style.backgroundPosition =
                "-" + (this.startX * cx) +
                "px -" + (this.startY * cy) + "px";

            this.region.style.width = 0;
            this.region.style.height = 0;
            this.region.style.display = "none";
            this.isDown = false;
            this.startX = 0;
            this.startY = 0;
        }
    }

    OnKeyUp(event) {
        if (event.key === "Escape") {
            this.result.style.display = "none";
        }
    }
}

class ContextAnalyzer {
    constructor(context, width, height) {
        this.context = context;
        this.width = width;
        this.height = height;
    }

    GetPixel(x, y) {
        let imageData = this.context.getImageData(x, y, 1, 1);
        let red = imageData.data[0];
        let green = imageData.data[1];
        let blue = imageData.data[2];
        let alpha = imageData.data[3] / 255;
        let pixel = new Pixel(x, y, red, green, blue, alpha);

        return pixel;
    }

    FindStandardPixel(x, y) {
        // 1. 기준 색을 구한다.
        let colorFinder = new ColorFinder();
        let imageData;
        let red;
        let green;
        let blue;
        let alpha;
        let rangeEndX = x + 2;
        let rangeEndY = y + 2;
        let rangeX;
        let rangeY = y - 2;
        while (rangeY <= rangeEndY) {
            rangeX = x - 2;
            while (rangeX <= rangeEndX) {
                imageData = this.context.getImageData(rangeX, rangeY, 1, 1);
                red = imageData.data[0];
                green = imageData.data[1];
                blue = imageData.data[2];
                alpha = imageData.data[3] / 255;
                colorFinder.Find(red, green, blue, alpha);
                rangeX++;
            }
            rangeY++;
        }
        let index = colorFinder.FindMost();
        let colorCounter = colorFinder.GetAt(index);
        let standardPixel = new Pixel(x, y, colorCounter.Red, colorCounter.Green, colorCounter.Blue, colorCounter.Alpha);

        return standardPixel;
    }

    FindLineToUp(x, y) {
        let linePixel = null;
        const standard = this.FindStandardPixel(x, y);

        let endY = y - this.height * 0.1;
        if (endY < 0) {
            endY = 0;
        }
        let width = 0;
        let moveX;
        let moveY = y - 1;
        let pixel;
        let horizontalPixel;
        // this.context.fillStyle = "red";
        while (moveY >= endY && linePixel === null) {
            pixel = this.GetPixel(x, moveY);
            if (standard.IsEqualColor(pixel) === false) {
                moveX = x;
                moveX--;
                horizontalPixel = this.GetPixel(moveX, moveY);
                while (moveX >= 0 && pixel.IsEqualColor(horizontalPixel) === true) {
                    // this.context.fillRect(moveX, moveY, 1, 1);
                    width++;
                    moveX--;
                    horizontalPixel = this.GetPixel(moveX, moveY);
                }
                moveX = x;
                moveX++;
                horizontalPixel = this.GetPixel(moveX, moveY);
                while (moveX <= this.width && pixel.IsEqualColor(horizontalPixel) === true) {
                    // this.context.fillRect(moveX, moveY, 1, 1);
                    width++;
                    moveX++;
                    horizontalPixel = this.GetPixel(moveX, moveY);
                }
                if (width > this.width * 0.1) {
                    linePixel = new Pixel(x, moveY, pixel.Red, pixel.Green, pixel.Blue, pixel.Alpha);
                }
            }
            moveY--;
        }

        if (linePixel === null) {
            linePixel = new Pixel(x, endY, pixel.Red, pixel.Green, pixel.Blue, pixel.Alpha);
        }

        return linePixel;
    }

    FindLineToDown(x, y) {
        let linePixel = null;

        const standard = this.FindStandardPixel(x, y);

        let endY = y + this.height * 0.1;
        if (endY > this.height) {
            endY = this.height;
        }
        let width = 0;
        let moveX;
        let moveY = y + 1;
        let pixel;
        let horizontalPixel;
        // this.context.fillStyle = "red";
        while (moveY <= endY && linePixel === null) {
            pixel = this.GetPixel(x, moveY);
            if (standard.IsEqualColor(pixel) === false) {
                moveX = x;
                moveX--;
                horizontalPixel = this.GetPixel(moveX, moveY);
                while (moveX >= 0 && pixel.IsEqualColor(horizontalPixel) === true) {
                    // this.context.fillRect(moveX, moveY, 1, 1);
                    width++;
                    moveX--;
                    horizontalPixel = this.GetPixel(moveX, moveY);
                }
                moveX = x;
                moveX++;
                horizontalPixel = this.GetPixel(moveX, moveY);
                while (moveX <= this.width && pixel.IsEqualColor(horizontalPixel) === true) {
                    // this.context.fillRect(moveX, moveY, 1, 1);
                    width++;
                    moveX++;
                    horizontalPixel = this.GetPixel(moveX, moveY);
                }
                if (width > this.width * 0.1) {
                    linePixel = new Pixel(x, moveY, pixel.Red, pixel.Green, pixel.Blue, pixel.Alpha);
                }
            }
            moveY++;
        }

        if (linePixel === null) {
            linePixel = new Pixel(x, endY, pixel.Red, pixel.Green, pixel.Blue, pixel.Alpha);
        }

        return linePixel;
    }
}

class Pixel {
    constructor(x, y, red, green, blue, alpha) {
        this.x = x;
        this.y = y;
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
    get X() {
        return this.x;
    }
    get Y() {
        return this.y;
    }
    get Red() {
        return this.red;
    }
    get Green() {
        return this.green;
    }
    get Blue() {
        return this.blue;
    }
    get Alpha() {
        return this.alpha;
    }

    IsEqualColor(pixel) {
        let result = false;

        const colorCalculator = new ColorCalculator();
        const deltaE = colorCalculator.GetCie94DeltaE([this.red, this.green, this.blue], [pixel.Red, pixel.Green, pixel.Blue]);

        if (deltaE < 1) {
            result = true;
        }

        return result;
    }
}

class ColorFinder {
    constructor() {
        this.colors = [];
        this.length = 0;
    }

    Find(red, green, blue, alpha) {
        let i = 0;
        while (i < this.length && this.colors[i].IsEqual(red, green, blue, alpha) === false) {
            i++;
        }
        if (i < this.length) {
            this.colors[i].Increase();
        }
        else {
            this.colors[this.length] = new ColorCounter(red, green, blue, alpha);
            this.colors[this.length].Increase();
            this.length++;
        }
    }

    FindMost() {
        let index = -1;

        let colorCount;
        let i = 0;
        while (i < this.length) {
            if (i === 0 || this.colors[i].Count > colorCount) {
                colorCount = this.colors[i].Count;
                index = i;
            }
            i++;
        }

        return index;
    }

    GetAt(index) {
        return this.colors[index];
    }
}

class ColorCounter {
    constructor(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
        this.count = 0;
    }

    get Red() {
        return this.red;
    }
    get Green() {
        return this.green;
    }
    get Blue() {
        return this.blue;
    }
    get Alpha() {
        return this.alpha;
    }
    get Count() {
        return this.count;
    }

    Increase() {
        this.count++;
    }

    IsEqual(red, green, blue, alpha) {
        let result = false;
        if (this.red === red && this.green === green && this.blue === blue && this.alpha === alpha) {
            result = true;
        }
        return result;
    }
}

class ColorCalculator {
    RGBtoLAB(rgb) {
        let r = rgb[0] / 255;
        let g = rgb[1] / 255;
        let b = rgb[2] / 255;
        let x;
        let y;
        let z;
        r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
        g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
        b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
        x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
        y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
        z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
        x = (x > 0.008856) ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
        y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
        z = (z > 0.008856) ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;
        return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
    }

    HEXtoRGB(hex) {
        hex = hex.replace(/[^0-9A-F]/gi, '');
        let bigint = parseInt(hex, 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;
        return [r, g, b];
    }

    GetCie94DeltaE(rgbA, rgbB) {
        let labA = this.RGBtoLAB(rgbA);
        let labB = this.RGBtoLAB(rgbB);

        let deltaL = labA[0] - labB[0];
        let deltaA = labA[1] - labB[1];
        let deltaB = labA[2] - labB[2];
        let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
        let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
        let deltaC = c1 - c2;
        let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
        deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
        let sc = 1.0 + 0.045 * c1;
        let sh = 1.0 + 0.015 * c1;
        let deltaLKlsl = deltaL / (1.0);
        let deltaCkcsc = deltaC / (sc);
        let deltaHkhsh = deltaH / (sh);
        let i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
        return i < 0 ? 0 : Math.sqrt(i);
    }
}