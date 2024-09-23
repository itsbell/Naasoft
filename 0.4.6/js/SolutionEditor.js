import { CompositeWindow } from "./Window.js";
import { Button, ImageButton } from "./Buttons.js";
import { EditSolutionForm } from "./EditSolutionForm.js";
import { ImageView } from "./ImageView.js";

export class SolutionEditor extends CompositeWindow {
    constructor(id) {
        super(id);

        this.element = document.getElementById(this.id);
        this.element.logicalObject = this;

        let box = document.createElement("div");
        box.className = "solutionEditor-image";
        this.element.appendChild(box);

        this.top = document.createElement("div");
        this.top.className = "image-top";
        box.appendChild(this.top);

        let title = document.createElement("p");
        title.textContent = "이미지";
        this.top.appendChild(title);

        this.input = document.createElement("input");
        this.input.id = "FILEINPUT";
        this.input.type = "file";
        this.input.accept = "image/*";
        this.input.addEventListener("change", this.OnFileChanged.bind(this));
        box.appendChild(this.input);

        this.label = document.createElement("label");
        this.label.htmlFor = "FILEINPUT";
        this.label.className = "image-file";
        this.label.style.display = "flex";
        box.appendChild(this.label);

        let graphic = document.createElement("div");
        graphic.className = "file-graphic";
        this.label.appendChild(graphic);

        let img = document.createElement("img");
        img.src = "../assets/upload.png";
        graphic.appendChild(img);

        let p = document.createElement("p");
        p.textContent = "업로드할 이미지 파일을 선택하세요.";
        graphic.appendChild(p);

        this.preview = document.createElement("div");
        this.preview.className = "image-preview";
        this.preview.style.display = "none";
        box.appendChild(this.preview);

        let view = document.createElement("div");
        view.id = "IMAGEVIEW";
        view.className = "imageView";
        this.preview.appendChild(view);

        const imageView = new ImageView(view.id);
        this.Add(imageView);

        box = document.createElement("div");
        box.className = "solutionEditor-text";
        this.element.appendChild(box);

        let textArea = document.createElement("textarea");
        textArea.id = "TEXTAREA";
        textArea.className = "solutionEditor-textArea";
        textArea.placeholder = "내용을 입력하세요."
        box.appendChild(textArea);

        let submit = document.createElement("div");
        submit.className = "solutionEditor-submit";
        this.element.appendChild(submit);

        let button = document.createElement("button");
        button.id = "SUBMITBUTTON";
        button.className = "submitButton";
        button.type = "button";
        submit.appendChild(button);

        const submitButton = new Button("SUBMITBUTTON", "제출", this.OnSubmitButtonClicked.bind(this));
        this.Add(submitButton);
    }

    OnFileChanged(event) {
        let i = this.top.children.length - 1;
        while (i >= 1) { //"이미지" 제외 지우기
            this.top.removeChild(this.top.children[i]);
            i--;
        }

        let index = this.Find("IMAGEVIEW");
        let imageView;
        if (index != -1) {
            imageView = this.GetAt(index);
        }

        if (event.target.files.length > 0) {
            let url = URL.createObjectURL(event.target.files[0]);

            this.label.style.display = "none";

            this.preview.style.display = "block";

            if (imageView != undefined) {
                imageView.SetImage(url);
            }

            let p = document.createElement("p");
            p.textContent = event.target.files[0].name;
            this.top.appendChild(p);

            let size = event.target.files[0].size / (1024 * 1024);
            p = document.createElement("p");
            p.textContent = "(" + size.toFixed(2) + " MB)";
            this.top.appendChild(p);

            let button = document.createElement("button");
            button.id = "DELETEBUTTON";
            button.className = "deleteButton";
            button.type = "button";
            this.top.appendChild(button);

            const deleteButton = new ImageButton("DELETEBUTTON", "../assets/delete.png", this.OnDeleteButtonClicked.bind(this), "삭제");
            this.Add(deleteButton);

            if (size >= 10) {
                alert("이미지 파일 크기는 10MB 미만으로 제한됩니다.");
                button.dispatchEvent(new Event("click"));
            }
        }
        else {
            this.input.value = ''; //안넣으면 두 번째부터 이벤트가 안들어감.

            this.preview.style.display = "none";

            if (imageView != undefined) {
                imageView.Hide();
            }

            index = this.Find("DELETEBUTTON");
            if (index != -1) {
                this.Remove(index);
            }

            this.label.style.display = "flex";
        }
    }

    OnDeleteButtonClicked() {
        let i = this.top.children.length - 1;
        while (i >= 1) {
            this.top.removeChild(this.top.children[i]);
            i--;
        }

        this.input.value = ''; //안넣으면 두 번째부터 이벤트가 안들어감.

        this.preview.style.display = "none";

        let index = this.Find("IMAGEVIEW");
        if (index != -1) {
            this.GetAt(index).Hide();
        }

        index = this.Find("DELETEBUTTON");
        if (index != -1) {
            this.Remove(index);
        }

        this.label.style.display = "flex";
    }

    OnSubmitButtonClicked() {
        const textArea = document.getElementById("TEXTAREA");
        let content = textArea.value;

        let file = null;
        if (this.input.files.length > 0) {
            file = this.input.files[0];
        }

        /** 이미지 압축 */
        // if (file != null) {
        //     const reader = new FileReader();
        //     reader.onload = function (e) {
        //         const img = new Image();
        //         img.onload = function () {
        //             const canvas = document.createElement("canvas");
        //             const ctx = canvas.getContext('2d');
        //             canvas.width = 800; // 원하는 너비로 설정
        //             const aspectRatio = img.height / img.width;
        //             canvas.height = canvas.width * aspectRatio;
        //             ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        //             // 이미지 처리 후 FormData를 이용해 서버에 업로드
        //             const dataURL = canvas.toDataURL('image/jpeg');
        //             const formData = new FormData();

        //             formData.append('image', dataURL);
        //             formData.append('emailAddress', "leebellhwan@gmail.com");
        //             formData.append('chapterNumber', 2);
        //             formData.append('problemNumber', 1);
        //             formData.append('solutionNumber', 2);

        //             fetch("../php/UploadFileTest.php", {
        //                 method: 'POST',
        //                 body: formData
        //             })
        //                 .then(response => response.text())
        //                 .then(result => alert(result))
        //                 .catch(error => console.error('Error:', error));
        //         };
        //         img.src = e.target.result;
        //     };
        //     reader.readAsDataURL(file); // 파일을 Base64 인코딩된 데이터 URL로 읽음
        // }

        if (content != "" || file != null) {
            EditSolutionForm.GetInstance().SubmitSolution(content, file);
        }
        else {
            alert("이미지 또는 내용을 입력하십시오.");
        }
    }
}