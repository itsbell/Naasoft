export class DraggableGround {

    static SetElement(id) {
        let element;

        element = document.getElementById(id);
        element.current = -1;
        element.addEventListener("mouseup", DraggableGround.OnMouseup);
        element.addEventListener("mousemove", DraggableGround.OnMousemove);
        element.addEventListener("mouseleave", DraggableGround.OnMouseleave);
    }

    static OnMouseup(event) {
        this.current = -1;
    }

    static OnMousemove(event) {
        if (this.current != -1) {
            let element = this.children[this.current];

            let distanceX = event.clientX - element.x;
            let distanceY = event.clientY - element.y;

            let maxLeft = this.offsetLeft + this.offsetWidth - element.offsetWidth;
            let maxTop = this.offsetTop + this.offsetHeight - element.offsetHeight;

            let left = element.offsetLeft + distanceX;
            if (left < 0) {
                left = 0;
            }
            else if (left > maxLeft) {
                left = maxLeft;
            }
            element.style.left = `${left}px`;

            let top = element.offsetTop + distanceY;
            if (top < 0) {
                top = 0;
            }
            else if (top > maxTop) {
                top = maxTop;
            }
            element.style.top = `${top}px`;

            element.x = event.clientX;
            element.y = event.clientY;
        }
    }

    static OnMouseleave(event) {
        if (this.current != -1) {
            let element = this.children[this.current];

            let distanceX = event.clientX - element.x;
            let distanceY = event.clientY - element.y;

            let maxLeft = this.offsetLeft + this.offsetWidth - element.offsetWidth;
            let maxTop = this.offsetTop + this.offsetHeight - element.offsetHeight;

            let left = element.offsetLeft + distanceX;
            if (left < 0) {
                left = 0;
            }
            else if (left > maxLeft) {
                left = maxLeft;
            }
            element.style.left = `${left}px`;

            let top = element.offsetTop + distanceY;
            if (top < 0) {
                top = 0;
            }
            else if (top > maxTop) {
                top = maxTop;
            }
            element.style.top = `${top}px`;

            element.x = event.clientX;
            element.y = event.clientY;
        }
    }
}