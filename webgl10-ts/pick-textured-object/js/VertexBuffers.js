define(["require", "exports", "./VertexBuffersCollection"], function (require, exports, VertexBuffersCollection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initVertexBuffers = void 0;
    function initVertexBuffers(gl, xmlModel) {
        var dataIndexArrray, dataVertPosArray, dataNormalArray, dataTexCoordArray;
        var amountOfAttributes;
        var meshChildren = xmlModel.getElementsByTagName("mesh")[0].children;
        for (var i = 0; i < meshChildren.length; i++) {
            // console.log(meshChildren[i].getElementsByTagName("float_array")[0].getAttribute("id"));
            var id = meshChildren[i].getAttribute("id");
            if (id !== null && id.match(/-mesh-positions/)) // id.endsWith("-mesh-positions") - lib: es2015
             {
                dataVertPosArray = meshChildren[i].getElementsByTagName("float_array")[0]
                    .childNodes[0].nodeValue.trim().split(" ").map(function (value) { return parseFloat(value); });
            }
            else if (id !== null && id.match(/-mesh-normals/)) {
                dataNormalArray = meshChildren[i].getElementsByTagName("float_array")[0]
                    .childNodes[0].nodeValue.trim().split(" ").map(function (value) { return parseFloat(value); });
            }
            else if (id !== null && id.match(/-mesh-map-0/)) {
                dataTexCoordArray = meshChildren[i].getElementsByTagName("float_array")[0]
                    .childNodes[0].nodeValue.trim().split(" ").map(function (value) { return parseFloat(value); });
            }
            else if (meshChildren[i].tagName == "triangles" || meshChildren[i].tagName == "polylist") {
                amountOfAttributes = meshChildren[i].getElementsByTagName("input").length;
                dataIndexArrray = meshChildren[i].getElementsByTagName("p")[0]
                    .childNodes[0].nodeValue.trim().split(" ").map(function (value) { return parseInt(value); });
            }
        }
        // console.log("amountOfAttributes = " + amountOfAttributes);
        // console.log("dataIndexArrray = " + dataIndexArrray);
        // console.log("dataVertPosArray = " + dataVertPosArray);
        // console.log("dataNormalArray = " + dataNormalArray);
        // console.log("dataTexCoordArray = " + dataTexCoordArray);
        var v = [];
        var n = [];
        var t = [];
        var vertPosIndex, normalIndex, texCoordIndex;
        for (var i = 0; i < dataIndexArrray.length; i += amountOfAttributes) {
            vertPosIndex = dataIndexArrray[i + 0];
            v.push(dataVertPosArray[vertPosIndex * 3 + 0]);
            v.push(dataVertPosArray[vertPosIndex * 3 + 1]);
            v.push(dataVertPosArray[vertPosIndex * 3 + 2]);
            normalIndex = dataIndexArrray[i + 1];
            n.push(dataNormalArray[normalIndex * 3 + 0]);
            n.push(dataNormalArray[normalIndex * 3 + 1]);
            n.push(dataNormalArray[normalIndex * 3 + 2]);
            texCoordIndex = dataIndexArrray[i + 2];
            t.push(dataTexCoordArray[texCoordIndex * 2 + 0]);
            t.push(dataTexCoordArray[texCoordIndex * 2 + 1]);
        }
        var vertPosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertPosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
        var normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(n), gl.STATIC_DRAW);
        var texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(t), gl.STATIC_DRAW);
        var vertexBuffers = new VertexBuffersCollection_1.default();
        vertexBuffers.vertexPosBuffer = vertPosBuffer;
        vertexBuffers.normalBuffer = normalBuffer;
        vertexBuffers.textureCoordBuffer = texCoordBuffer;
        vertexBuffers.amountOfVertices = v.length / 3;
        return vertexBuffers;
    }
    exports.initVertexBuffers = initVertexBuffers;
});
//# sourceMappingURL=VertexBuffers.js.map