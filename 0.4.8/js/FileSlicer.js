export class FileSlicer {
    constructor() {

    }

    Slice(file, start, end) {
        let slice = file.mozSlice ? file.mozSlice :
            file.webkitSlice ? file.webkitSlice :
                file.slice;

        return slice.bind(file)(start, end);
    }

    GetChunksAmount(size) {
        const BYTES_PER_CHUNK = ((1024 * 1024) * 5); //5MB chunk sizes.
        return Math.ceil(size / BYTES_PER_CHUNK);
    }

    SliceFile(file, chunksAmount, mimetype) {
        let byteIndex = 0;
        let chunks = [];
        let byteEnd;
        let i = 0;
        while (i < chunksAmount) {
            byteEnd = Math.ceil((file.size / chunksAmount) * (i + 1));
            chunks.push(new Blob([this.Slice(file, byteIndex, byteEnd)], {
                type: mimetype
            }));

            byteIndex += (byteEnd - byteIndex);

            i++;
        }

        return chunks;
    }
}