export class PhpRequestor {
    constructor() {
    }

    Open(method, target) {
        if (this._request != null) {
            this._request = null;
        }
        this._request = new XMLHttpRequest();
        this._request.open(method, target, true);
    }

    Ready(header, value) {
        this._request.setRequestHeader(header, value);
    }

    Request(action, body) {
        this._request.onreadystatechange = action;
        this._request.send(body);
    }

    async Get(link) {
        const result = await fetch(link);
        const text = await result.text();

        return text;
    }

    // async Post(link, body) {
    //     let i;
    //     for (i = 1; i <= 3; i++) {
    //         const controller = new AbortController();
    //         const signal = controller.signal;

    //         // 타임아웃 설정
    //         // let timeout = 1;
    //         // if (i === 2) {
    //         //     timeout = 100;
    //         // }
    //         // else if (i === 3) {
    //         //     timeout = 1000;
    //         // }
    //         // const timeoutId = setTimeout(() => controller.abort(), timeout);
    //         const timeoutId = setTimeout(() => controller.abort(), 1000);

    //         try {
    //             // fetch 요청
    //             const result = await fetch(link, {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    //                 },
    //                 body,
    //                 signal,
    //             });

    //             // 타임아웃 클리어
    //             clearTimeout(timeoutId);

    //             // 응답 처리
    //             const text = await result.text();
    //             return text;

    //         } catch (error) {
    //             if (error.name === 'AbortError') {
    //                 console.warn(`Request timed out. Retrying... (${i}/3)`);
    //             } else {
    //                 console.error('Fetch error:', error);
    //                 throw error;
    //             }
    //         }
    //     }

    //     throw new Error('Request failed after multiple retries');
    // }

    async Post(link, body) {
        // fetch 요청
        const result = await fetch(link, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body,
        });

        // 응답 처리
        const text = await result.text();
        return text;
    }

    async PostJson(link, body) {
        const result = await fetch(link, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body,
        });

        // 응답 처리
        const text = await result.text();
        // console.log(text);
        let object = JSON.parse(text);
        return object;
    }

    PostJsonBackground(link, body, callback) {
        fetch(link, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body,
        })
            .then((response) => response.json())
            .then((result) => {
                callback(result);
            })
            .catch((error) => {
                console.error("Error:", error); // 에러 처리
            });
    }
}
