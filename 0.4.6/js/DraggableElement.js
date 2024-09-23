export class DraggableElement {

    static SetElement(id) {
        let element;

        element = document.getElementById(id);
        element.x = 0;
        element.y = 0;

        element.addEventListener("mousedown", DraggableElement.OnMousedown);
        element.addEventListener("mouseup", DraggableElement.OnMouseup);
    }

    static OnMousedown(event) {
        this.x = event.clientX;
        this.y = event.clientY;

        let i = 0;
        while (i < this.parentNode.childElementCount && this.parentNode.current === -1) {
            if (this.parentNode.children[i] === this) {
                this.parentNode.current = i;
            }
            i++;
        }
    }

    static OnMouseup() {
        this.parentNode.current = -1;
    }
}