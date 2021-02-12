define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.loadFile = exports.loadImage = void 0;
    var loadImage = function (path, callback) {
        var image = new Image();
        image.onload = function () { callback(image); };
        image.src = path;
    };
    exports.loadImage = loadImage;
    var loadFile = function (path, isTextFile, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status !== 404) {
                if (isTextFile) {
                    callback(xhr.responseText);
                }
                else {
                    callback(xhr.responseXML);
                }
            }
        };
        xhr.open("GET", path, true);
        xhr.send();
    };
    exports.loadFile = loadFile;
});
//# sourceMappingURL=Loaders.js.map