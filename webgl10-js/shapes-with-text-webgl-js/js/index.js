import{mat4,vec3,quat}from"gl-matrix";let gl=null;function initWebGLContext(canvasName){const canvas=document.getElementById(canvasName);if(canvas===null){console.log(`Failed to get a canvas element with the name "${canvasName}"`);return false}gl=canvas.getContext("webgl",{alpha:false,premultipliedAlpha:false});return true}async function createProgram(path,vertShaderFileName,fragShaderFileName){let response=await fetch(path+vertShaderFileName);const vertShaderSource=await response.text();response=await fetch(path+fragShaderFileName);const fragShaderSource=await response.text();const vShader=gl.createShader(gl.VERTEX_SHADER);gl.shaderSource(vShader,vertShaderSource);gl.compileShader(vShader);let ok=gl.getShaderParameter(vShader,gl.COMPILE_STATUS);if(!ok){console.log(`${fragShaderFileName}: ${gl.getShaderInfoLog(vShader)}`);return null}const fShader=gl.createShader(gl.FRAGMENT_SHADER);gl.shaderSource(fShader,fragShaderSource);gl.compileShader(fShader);ok=gl.getShaderParameter(vShader,gl.COMPILE_STATUS);if(!ok){console.log(`${vertShaderFileName}: ${gl.getShaderInfoLog(fShader)}`);return null}const program=gl.createProgram();gl.attachShader(program,vShader);gl.attachShader(program,fShader);gl.linkProgram(program);ok=gl.getProgramParameter(program,gl.LINK_STATUS);if(!ok){console.log(`Link error with shaders ${vertShaderFileName}`+` and ${fragShaderFileName}`);console.log(gl.getProgramInfoLog(program));return null}gl.useProgram(program);return program}class AnimationData{constructor(lengthSeconds,keyFrames){this.lengthSeconds=lengthSeconds;this.keyFrames=keyFrames}}class JointData{constructor(index,nameId,localBindTransform){this.index=index;this.nameId=nameId;this.localBindTransform=localBindTransform;this.children=[]}addChild(child){this.children.push(child)}}class JointTransformData{constructor(jointNameId,localBindTransform){this.jointNameId=jointNameId;this.localBindTransform=localBindTransform}}class KeyFrameData{constructor(time){this.time=time;this.jointTransforms=[]}addJointTransform(transform){this.jointTransforms.push(transform)}}async function initVertexBuffers(path,modelNames){const vertexBuffers={};for(let i=0;i<modelNames.length;i++){const contentResponse=await fetch(path+modelNames[i]+".dae");const content=await contentResponse.text();const parser=new DOMParser;const xmlDoc=parser.parseFromString(content,"text/xml");const expForIndexes="//*[local-name() = 'p']/text()";let nodes=xmlDoc.evaluate(expForIndexes,xmlDoc,null,XPathResult.ANY_TYPE,null);let result=nodes.iterateNext();if(!result){let animationData,animationTimes,headJoint,keyFrames;let jointCount=0;const boneNames=[];const initKeyFrames=times=>{const frames=[];for(let i=0;i<times.length;i++){frames.push(new KeyFrameData(times[i]))}return frames};const getDataId=jointDataElement=>{let data;for(let i=0;i<jointDataElement.children.length;i++){if(jointDataElement.children[i].tagName==="sampler"){const samplerElement=jointDataElement.children[i];for(let i=0;i<samplerElement.children.length;i++){const inputElement=samplerElement.children[i];if(inputElement.getAttribute("semantic")==="OUTPUT"){data=inputElement.getAttribute("source").substr(1)}}}}return data};const getJointName=jointDataElement=>{let data;for(let i=0;i<jointDataElement.children.length;i++){if(jointDataElement.children[i].tagName==="channel"){const channelElement=jointDataElement.children[i];data=channelElement.getAttribute("target")}}return data.split("/")[0]};const processTransforms=(jointName,data,keyFrames,root)=>{for(let i=0;i<keyFrames.length;i++){const transform=mat4.create();for(let j=0;j<16;j++){transform[j]=data[i*16+j]}mat4.transpose(transform,transform);if(root){const correction=mat4.create();mat4.fromRotation(correction,-Math.PI/2,[1,0,0]);mat4.mul(transform,correction,transform)}keyFrames[i].addJointTransform(new JointTransformData(jointName,transform))}};const loadJointTransforms=(frames,jointDataElement,rootNodeId)=>{const jointNameId=getJointName(jointDataElement);boneNames.push(jointNameId);const dataId=getDataId(jointDataElement);for(let i=0;i<jointDataElement.children.length;i++){if(jointDataElement.children[i].tagName==="source"){const sourceElement=jointDataElement.children[i];const id=sourceElement.getAttribute("id");if(id===dataId){for(let j=0;j<sourceElement.children.length;j++){if(sourceElement.children[j].tagName==="float_array"){const floatArrayElement=sourceElement.children[j];const data=floatArrayElement.textContent.trim().split(" ").map(value=>{return parseFloat(value)});processTransforms(jointNameId,data,frames,jointNameId===rootNodeId)}}}}}};const floatArrayElements=xmlDoc.getElementsByTagName("float_array");for(let i=0;i<floatArrayElements.length;i++){const id=floatArrayElements[i].getAttribute("id");if(id.match("_pose_matrix-input-array")){animationTimes=floatArrayElements[i].textContent.trim().split(" ").map(value=>{return parseFloat(value)});break}}const duration=animationTimes[animationTimes.length-1];keyFrames=initKeyFrames(animationTimes);const animationElements=xmlDoc.getElementsByTagName("library_animations")[0].children;for(let i=0;i<animationElements.length;i++){loadJointTransforms(keyFrames,animationElements[i],"part0")}animationData=new AnimationData(duration,keyFrames);const extractMainJointData=(jointElement,isRoot)=>{const nameId=jointElement.getAttribute("name").replace(".","_");const index=boneNames.indexOf(nameId);const correctionMatrix=mat4.create();mat4.fromXRotation(correctionMatrix,-Math.PI/2);let matrix;for(let i=0;i<jointElement.children.length;i++){if(jointElement.children[i].tagName=="matrix"){const matrixElement=jointElement.children[i];const matrixData=matrixElement.textContent.trim().split(" ").map(value=>{return parseFloat(value)});matrix=mat4.fromValues(matrixData[0],matrixData[4],matrixData[8],matrixData[12],matrixData[1],matrixData[5],matrixData[9],matrixData[13],matrixData[2],matrixData[6],matrixData[10],matrixData[14],matrixData[3],matrixData[7],matrixData[11],matrixData[15])}}if(isRoot){mat4.mul(matrix,correctionMatrix,matrix)}jointCount++;return new JointData(index,nameId,matrix)};const loadJointData=(jointElement,isRoot)=>{const joint=extractMainJointData(jointElement,isRoot);for(let i=0;i<jointElement.children.length;i++){if(jointElement.children[i].tagName==="node"){const nodeElement=jointElement.children[i];joint.addChild(loadJointData(nodeElement,false))}}return joint};const sceneChildren=xmlDoc.getElementsByTagName("visual_scene")[0].children;for(let i=0;i<sceneChildren.length;i++){const id=sceneChildren[i].getAttribute("id");if(id.match("Armature")){const armatureElement=sceneChildren[i];for(let j=0;j<armatureElement.children.length;j++){if(armatureElement.children[j].tagName=="node"){const headElement=armatureElement.children[j];headJoint=loadJointData(headElement,true)}}}}const buffers={animationData:animationData,animationTimes:animationTimes,headJoint:headJoint,jointCount:jointCount};vertexBuffers[modelNames[i]]=buffers;continue}const order=result.textContent.trim().split(" ").map(value=>{return parseInt(value)});const partOfPositionsId="mesh-positions-array";const expForPositions=`//*[local-name() = 'float_array'][substring(@id, string-length(@id) -`+`string-length('${partOfPositionsId}') + 1) = '${partOfPositionsId}']`;nodes=xmlDoc.evaluate(expForPositions,xmlDoc,null,XPathResult.ANY_TYPE,null);result=nodes.iterateNext();const positions=result.textContent.trim().split(" ").map(value=>{return parseFloat(value)});const partOfNormalsId="mesh-normals-array";const expForNormals=`//*[local-name() = 'float_array'][substring(@id, string-length(@id) -`+`string-length('${partOfNormalsId}') + 1) = '${partOfNormalsId}']`;nodes=xmlDoc.evaluate(expForNormals,xmlDoc,null,XPathResult.ANY_TYPE,null);result=nodes.iterateNext();const normals=result.textContent.trim().split(" ").map(value=>{return parseFloat(value)});const partOfTexCoordsId="mesh-map-0-array";const expForTexCoords=`//*[local-name() = 'float_array'][substring(@id, string-length(@id) -`+`string-length('${partOfTexCoordsId}') + 1) = '${partOfTexCoordsId}']`;nodes=xmlDoc.evaluate(expForTexCoords,xmlDoc,null,XPathResult.ANY_TYPE,null);result=nodes.iterateNext();const texCoords=result.textContent.trim().split(" ").map(value=>{return parseFloat(value)});const correctionMatrix=mat4.create();mat4.fromXRotation(correctionMatrix,-Math.PI/2);const vertPosResult=[];const normalsResult=[];const texCoordsResult=[];const amountOfTriangles=order.length/12;for(let i=0;i<amountOfTriangles;i++){for(let j=0;j<12;j++){if((i*12+j)%4===0){const vx=positions[order[i*12+j]*3+0];const vy=positions[order[i*12+j]*3+1];const vz=positions[order[i*12+j]*3+2];const oldPos=vec3.fromValues(vx,vy,vz);const newPos=vec3.create();vec3.transformMat4(newPos,oldPos,correctionMatrix);vertPosResult.push(newPos[0]);vertPosResult.push(newPos[1]);vertPosResult.push(newPos[2])}else if((i*12+j)%4===1){const nx=normals[order[i*12+j]*3+0];const ny=normals[order[i*12+j]*3+1];const nz=normals[order[i*12+j]*3+2];const oldNormal=vec3.fromValues(nx,ny,nz);const newNormal=vec3.create();vec3.transformMat4(newNormal,oldNormal,correctionMatrix);normalsResult.push(newNormal[0]);normalsResult.push(newNormal[1]);normalsResult.push(newNormal[2])}else if((i*12+j)%4===2){texCoordsResult.push(texCoords[order[i*12+j]*2+0]);texCoordsResult.push(texCoords[order[i*12+j]*2+1])}}}const vertPosBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vertPosBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertPosResult),gl.STATIC_DRAW);const normalBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,normalBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(normalsResult),gl.STATIC_DRAW);const texCoordBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,texCoordBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(texCoordsResult),gl.STATIC_DRAW);const buffers={vertPosBuffer:vertPosBuffer,normalBuffer:normalBuffer,texCoordBuffer:texCoordBuffer,amountOfVertices:vertPosResult.length/3};vertexBuffers[modelNames[i]]=buffers}return vertexBuffers}function loadImage(url){return new Promise(resolve=>{const image=new Image;image.onload=()=>{resolve(image)};image.src=url})}function loadTexture(url){return new Promise(resolve=>{const image=new Image;image.onload=()=>{const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);resolve(texture)};image.src=url})}class CameraRotator{constructor(canvas,drawCallback,viewDistance,rotX,rotY,panX,panY){this.canvas=canvas;this.xLimit=85;this.isPanning=false;this.panX=panX;this.panY=panY;this.prevXForPan=0;this.prevYForPan=0;this.m=mat4.create();this.canvas.oncontextmenu=event=>{event.preventDefault();return false};canvas.addEventListener("mousedown",event=>{if(event.button===0||event.button===1){this.doMouseDown(event)}else if(event.button===2){this.doMousePanDawn(event)}},false);canvas.addEventListener("wheel",event=>{this.doMouseWheel(event)},false);this.rotateX=rotX;this.rotateY=rotY;this.viewDistance=viewDistance;this.drawCallback=drawCallback;this.boundDoMouseDrag=this.doMouseDrag.bind(this);this.boundDoMouseUp=this.doMouseUp.bind(this);this.boundDoMousePanDrag=this.doMousePanDrag.bind(this);this.boundDoMousePanUp=this.doMousePanUp.bind(this)}getViewMatrix(event){const cosX=Math.cos(this.rotateX/180*Math.PI);const sinX=Math.sin(this.rotateX/180*Math.PI);const cosY=Math.cos(this.rotateY/180*Math.PI);const sinY=Math.sin(this.rotateY/180*Math.PI);this.m[0]=cosY,this.m[1]=sinX*sinY,this.m[2]=-cosX*sinY,this.m[3]=0;this.m[4]=0,this.m[5]=cosX,this.m[6]=sinX,this.m[7]=0;this.m[8]=sinY,this.m[9]=-sinX*cosY,this.m[10]=cosX*cosY,this.m[11]=0;this.m[12]=this.panX,this.m[13]=-this.panY,this.m[14]=-this.viewDistance,this.m[15]=1;return this.m}doMouseDown(event){this.isDraging=true;document.addEventListener("mousemove",this.boundDoMouseDrag,false);document.addEventListener("mouseup",this.boundDoMouseUp,false);const r=this.canvas.getBoundingClientRect();this.prevX=event.clientX-r.left;this.prevY=event.clientY-r.top}doMouseDrag(event){if(!this.isDraging){return}const r=this.canvas.getBoundingClientRect();const x=event.clientX-r.left;const y=event.clientY-r.top;const degreesPerPixelX=90/this.canvas.height;const degreesPerPixelY=180/this.canvas.width;let newRotX=this.rotateX+degreesPerPixelX*(y-this.prevY);const newRotY=this.rotateY+degreesPerPixelY*(x-this.prevX);newRotX=Math.max(-this.xLimit,Math.min(this.xLimit,newRotX));this.prevX=x;this.prevY=y;if(newRotX!=this.rotateX||newRotY!=this.rotateY){this.rotateX=newRotX;this.rotateY=newRotY;this.drawCallback()}}doMouseUp(event){if(!this.isDraging){return}this.isDraging=false;document.removeEventListener("mousedown",this.boundDoMouseDrag,false);document.removeEventListener("mouseup",this.boundDoMouseUp,false)}doMouseWheel(event){const delta=event.deltaY/100;this.viewDistance+=delta;if(this.viewDistance<1){this.viewDistance-=delta;return}this.drawCallback()}doMousePanDawn(event){if(this.isPanning){return}this.isPanning=true;document.addEventListener("mousemove",this.boundDoMousePanDrag,false);document.addEventListener("mouseup",this.boundDoMousePanUp,false);const r=this.canvas.getBoundingClientRect();this.prevXForPan=event.clientX-r.left;this.prevYForPan=event.clientY-r.top}doMousePanDrag(event){if(!this.isPanning){return}const r=this.canvas.getBoundingClientRect();const x=event.clientX-r.left;const y=event.clientY-r.top;this.panX=this.panX+(x-this.prevXForPan)/50;this.panY=this.panY+(y-this.prevYForPan)/50;this.prevXForPan=x;this.prevYForPan=y;this.drawCallback()}doMousePanUp(event){this.isPanning=false;document.removeEventListener("mousedown",this.boundDoMousePanDrag,false);document.removeEventListener("mouseup",this.boundDoMousePanUp,false)}}class Object3D{constructor(program,vertexBuffers,isLightMap=false,isAnimated=false){this.program=program;this.vertexBuffers=vertexBuffers;this.position=vec3.create();this.rotation=quat.create();this.scale=vec3.fromValues(1,1,1);this.mvpMatrix=mat4.create();this.modelMatrix=mat4.create();this.normalMatrix=mat4.create();gl.useProgram(program);this.aPositionLocation=gl.getAttribLocation(program,"aPosition");this.uMvpMatrixLocation=gl.getUniformLocation(program,"uMvpMatrix");this.isLightMap=isLightMap;if(!isLightMap){this.aNormalLocation=gl.getAttribLocation(program,"aNormal");this.uModelMatrixLocation=gl.getUniformLocation(program,"uModelMatrix");this.uNormalMatrixLocation=gl.getUniformLocation(program,"uNormalMatrix")}this.isAnimated=isAnimated}bind(){gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffers.vertPosBuffer);gl.vertexAttribPointer(this.aPositionLocation,3,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(this.aPositionLocation);if(!this.isLightMap){gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffers.normalBuffer);gl.vertexAttribPointer(this.aNormalLocation,3,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(this.aNormalLocation)}}draw(projViewMatrix){gl.useProgram(this.program);if(!this.isAnimated){mat4.fromRotationTranslationScale(this.modelMatrix,this.rotation,this.position,this.scale)}mat4.mul(this.mvpMatrix,projViewMatrix,this.modelMatrix);gl.uniformMatrix4fv(this.uMvpMatrixLocation,false,this.mvpMatrix);if(!this.isLightMap){gl.uniformMatrix4fv(this.uModelMatrixLocation,false,this.modelMatrix);mat4.invert(this.normalMatrix,this.modelMatrix);mat4.transpose(this.normalMatrix,this.normalMatrix);gl.uniformMatrix4fv(this.uNormalMatrixLocation,false,this.normalMatrix)}}}class Object3DWithLightMap extends Object3D{constructor(program,vertexBuffers,texture){super(program,vertexBuffers,true);this.texture=texture;gl.useProgram(program);this.aTexCoordLocation=gl.getAttribLocation(program,"aTexCoord")}bind(){gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffers.texCoordBuffer);gl.vertexAttribPointer(this.aTexCoordLocation,2,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(this.aTexCoordLocation);gl.bindTexture(gl.TEXTURE_2D,this.texture)}draw(projViewMatrix){gl.useProgram(this.program);super.bind();this.bind();super.draw(projViewMatrix);gl.drawArrays(gl.TRIANGLES,0,this.vertexBuffers.amountOfVertices)}}class CharData{constructor(){this.id=0;this.xAdvance=0;this.xOffset=0;this.yOffset=0;this.height=0;this.width=0;this.x=0;this.y=0}}const Language={English:0,Russian:1,Chinese:2};class Font{constructor(program,fontContent,fontImage,language){this._program=program;this._language=language;this._vertPosBuffer=null;this._texCoordBuffer=null;this._uMvpMatrixLocation=null;this._texture=null;this.charIndices={};this.charMap={};gl.useProgram(this._program);this._uMvpMatrixLocation=gl.getUniformLocation(this._program,"uMvpMatrix");this.charMap=this.parse(fontContent);const v=[];for(let i=0;i<Object.keys(this.charMap).length;i++){v.push(0,0,0);v.push(0,-1,0);v.push(1,0,0);v.push(1,-1,0)}this._vertPosBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this._vertPosBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.STATIC_DRAW);gl.bindAttribLocation(this._program,0,"aPosition");const t=[];let x,y,w,h;let cd={};let drawIndex=0;for(const char in this.charMap){this.charIndices[char]=drawIndex;drawIndex+=4;cd=this.charMap[char];x=cd.x/512;y=cd.y/512;w=cd.width/512;h=cd.height/512;t.push(x,y);t.push(x,y+h);t.push(x+w,y);t.push(x+w,y+h)}this._texCoordBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this._texCoordBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(t),gl.STATIC_DRAW);gl.bindAttribLocation(this._program,1,"aTexCoord");this._texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,this._texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,fontImage);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)}bind(){gl.useProgram(this._program);gl.bindBuffer(gl.ARRAY_BUFFER,this._vertPosBuffer);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(0);gl.bindBuffer(gl.ARRAY_BUFFER,this._texCoordBuffer);gl.vertexAttribPointer(1,2,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(1);gl.bindTexture(gl.TEXTURE_2D,this._texture)}setMvpMatrix(matrix){gl.uniformMatrix4fv(this._uMvpMatrixLocation,false,matrix)}parse(fileContent){const charMap={};const lines=fileContent.split("\n");const count=this.getValue(lines[3].split(" ")[1]);const englishChars={};englishChars[32]=" ";englishChars[33]="!";englishChars[34]='"';englishChars[35]="#";englishChars[36]="$";englishChars[37]="%";englishChars[38]="&";englishChars[39]="'";englishChars[40]="(";englishChars[41]=")";englishChars[42]="*";englishChars[43]="+";englishChars[44]=",";englishChars[45]="-";englishChars[46]=".";englishChars[47]="/";englishChars[48]="0";englishChars[49]="1";englishChars[50]="2";englishChars[51]="3";englishChars[52]="4";englishChars[53]="5";englishChars[54]="6";englishChars[55]="7";englishChars[56]="8";englishChars[57]="9";englishChars[58]=":";englishChars[59]=";";englishChars[60]="<";englishChars[61]="=";englishChars[62]=">";englishChars[63]="?";englishChars[64]="@";englishChars[65]="A";englishChars[66]="B";englishChars[67]="C";englishChars[68]="D";englishChars[69]="E";englishChars[70]="F";englishChars[71]="G";englishChars[72]="H";englishChars[73]="I";englishChars[74]="J";englishChars[75]="K";englishChars[76]="L";englishChars[77]="M";englishChars[78]="N";englishChars[79]="O";englishChars[80]="P";englishChars[81]="Q";englishChars[82]="R";englishChars[83]="S";englishChars[84]="T";englishChars[85]="U";englishChars[86]="V";englishChars[87]="W";englishChars[88]="X";englishChars[89]="Y";englishChars[90]="Z";englishChars[91]="[";englishChars[92]="\\";englishChars[93]="]";englishChars[94]="^";englishChars[95]="_";englishChars[96]="`";englishChars[97]="a";englishChars[98]="b";englishChars[99]="c";englishChars[100]="d";englishChars[101]="e";englishChars[102]="f";englishChars[103]="g";englishChars[104]="h";englishChars[105]="i";englishChars[106]="j";englishChars[107]="k";englishChars[108]="l";englishChars[109]="m";englishChars[110]="n";englishChars[111]="o";englishChars[112]="p";englishChars[113]="q";englishChars[114]="r";englishChars[115]="s";englishChars[116]="t";englishChars[117]="u";englishChars[118]="v";englishChars[119]="w";englishChars[120]="x";englishChars[121]="y";englishChars[122]="z";englishChars[123]="{";englishChars[124]="|";englishChars[125]="}";englishChars[126]="~";const russianChars={};russianChars[0]="0";russianChars[32]=" ";russianChars[33]="!";russianChars[34]='"';russianChars[35]="#";russianChars[36]="$";russianChars[37]="%";russianChars[38]="я";russianChars[39]="'";russianChars[40]="(";russianChars[41]=")";russianChars[42]="*";russianChars[43]="+";russianChars[44]=",";russianChars[45]="-";russianChars[46]=".";russianChars[47]="/";russianChars[48]="0";russianChars[49]="1";russianChars[50]="2";russianChars[51]="3";russianChars[52]="4";russianChars[53]="5";russianChars[54]="6";russianChars[55]="7";russianChars[56]="8";russianChars[57]="9";russianChars[58]=":";russianChars[59]=";";russianChars[60]="Ё";russianChars[61]="=";russianChars[62]="ё";russianChars[63]="?";russianChars[64]="А";russianChars[65]="Б";russianChars[66]="В";russianChars[67]="Г";russianChars[68]="Д";russianChars[69]="Е";russianChars[70]="Ж";russianChars[71]="З";russianChars[72]="И";russianChars[73]="Й";russianChars[74]="К";russianChars[75]="Л";russianChars[76]="М";russianChars[77]="Н";russianChars[78]="О";russianChars[79]="П";russianChars[80]="Р";russianChars[81]="С";russianChars[82]="Т";russianChars[83]="У";russianChars[84]="Ф";russianChars[85]="Х";russianChars[86]="Ц";russianChars[87]="Ч";russianChars[88]="Ш";russianChars[89]="Щ";russianChars[90]="Ъ";russianChars[91]="Ы";russianChars[92]="\\";russianChars[93]="Э";russianChars[94]="Ю";russianChars[95]="Я";russianChars[96]="а";russianChars[97]="б";russianChars[98]="в";russianChars[99]="г";russianChars[100]="д";russianChars[101]="е";russianChars[102]="ж";russianChars[103]="з";russianChars[104]="и";russianChars[105]="й";russianChars[106]="к";russianChars[107]="л";russianChars[108]="м";russianChars[109]="н";russianChars[110]="о";russianChars[111]="п";russianChars[112]="р";russianChars[113]="с";russianChars[114]="т";russianChars[115]="у";russianChars[116]="ф";russianChars[117]="х";russianChars[118]="ц";russianChars[119]="ч";russianChars[120]="ш";russianChars[121]="щ";russianChars[122]="ъ";russianChars[123]="ы";russianChars[124]="ь";russianChars[125]="э";russianChars[126]="ю";const str="立方体锥体领域圆柱";const arr=str.split("");const uniq=[...new Set(arr)];const chineseChars={};for(let i=0;i<uniq.length;i++){chineseChars[uniq[i].charCodeAt(0)]=uniq[i]}for(let i=4;i<count+4;i++){if(lines[i]==="")break;let firstLine=lines[i];let typesAndValues=firstLine.split(/(\s+)/).filter(el=>{return el.trim().length>0});let charData=new CharData;charData.id=this.getValue(typesAndValues[1]);charData.x=this.getValue(typesAndValues[2]);charData.y=this.getValue(typesAndValues[3]);charData.width=this.getValue(typesAndValues[4]);charData.height=this.getValue(typesAndValues[5]);charData.xOffset=this.getValue(typesAndValues[6]);charData.yOffset=this.getValue(typesAndValues[7]);charData.xAdvance=this.getValue(typesAndValues[8]);if(this._language===Language.English){charMap[englishChars[charData.id]]=charData}else if(this._language===Language.Russian){charMap[russianChars[charData.id]]=charData}else if(this._language===Language.Chinese){charMap[chineseChars[charData.id]]=charData}}return charMap}getValue(s){let value=s.substr(s.indexOf("=")+1);return parseInt(value)}}class Text{constructor(font,text){this._font=font;this._text=text;this._position=[0,0,0];this._size=100;this._mvpMatrix=mat4.create();this._modelMatrix=mat4.create();this.width=0;this.height=0;for(let i=0;i<this.text.length;i++){const cd=this._font.charMap[this.text[i]];this.width=this.width+cd.xOffset/this.size;this.width=this.width+cd.xAdvance/this.size*.85;const h=cd.yOffset/this.size+cd.height/this.size;if(Math.abs(h)>this.height){this.height=Math.abs(h)}}}draw(projViewMatrix){this._font.bind();let x=0,y,w,h;let cd={};for(let i=0;i<this.text.length;i++){cd=this._font.charMap[this.text[i]];x=x+cd.xOffset/this.size;y=cd.yOffset/this.size;w=cd.width/this.size;h=cd.height/this.size;cd.width/cd.height;mat4.identity(this._modelMatrix);mat4.fromTranslation(this._modelMatrix,[this.position[0]+x,this.position[1]-y,this.position[2]]);mat4.scale(this._modelMatrix,this._modelMatrix,[w,h,1]);mat4.identity(this._mvpMatrix);mat4.mul(this._mvpMatrix,projViewMatrix,this._modelMatrix);this._font.setMvpMatrix(this._mvpMatrix);gl.drawArrays(gl.TRIANGLE_STRIP,this._font.charIndices[this.text[i]],4);x=x+cd.xAdvance/this.size*.85}}get position(){return this._position}set position(v){this._position=v}get text(){return this._text}set text(v){this._text=v}get size(){return this._size}set size(v){this._size=v}}class Skybox{constructor(size,program,skyboxImages){this.program=program;gl.useProgram(this.program);this.modelMatrix=mat4.create();this.mvpMatrix=mat4.create();const skyboxLocation=gl.getUniformLocation(program,"uSkyboxSampler");gl.uniform1i(skyboxLocation,0);const vertexArrays=this.cube(size);this.vertexPositionBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexPositionBuffer);gl.bufferData(gl.ARRAY_BUFFER,vertexArrays.vertexPositions,gl.STATIC_DRAW);this.aPositionLocation=gl.getAttribLocation(program,"aPosition");this.uMvpMatrixLocation=gl.getUniformLocation(program,"uMvpMatrix");this.elementIndexBuffer=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.elementIndexBuffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,vertexArrays.indices,gl.STATIC_DRAW);this.amountOfVertices=vertexArrays.indices.length;this.texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_CUBE_MAP,this.texture);gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,skyboxImages.nx);gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,skyboxImages.py);gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,skyboxImages.pz);gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,skyboxImages.px);gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,skyboxImages.ny);gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,skyboxImages.nz);gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.generateMipmap(gl.TEXTURE_CUBE_MAP)}draw(projViewMatrix){gl.useProgram(this.program);gl.depthMask(false);gl.enableVertexAttribArray(this.aPositionLocation);gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexPositionBuffer);gl.vertexAttribPointer(this.aPositionLocation,3,gl.FLOAT,false,0,0);mat4.mul(this.mvpMatrix,projViewMatrix,this.modelMatrix);gl.uniformMatrix4fv(this.uMvpMatrixLocation,false,this.mvpMatrix);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.elementIndexBuffer);gl.drawElements(gl.TRIANGLES,this.amountOfVertices,gl.UNSIGNED_SHORT,0);gl.disableVertexAttribArray(this.aPositionLocation);gl.depthMask(true)}cube(size){const s=(size||1)/2;const coords=[];const indices=[];function face(xyz){const start=coords.length/3;let i;for(i=0;i<12;i++){coords.push(xyz[i])}indices.push(start,start+1,start+2,start,start+2,start+3)}face([-s,-s,s,s,-s,s,s,s,s,-s,s,s]);face([-s,-s,-s,-s,s,-s,s,s,-s,s,-s,-s]);face([-s,s,-s,-s,s,s,s,s,s,s,s,-s]);face([-s,-s,-s,s,-s,-s,s,-s,s,-s,-s,s]);face([s,-s,-s,s,s,-s,s,s,s,s,-s,s]);face([-s,-s,-s,-s,-s,s,-s,s,s,-s,s,-s]);return{vertexPositions:new Float32Array(coords),indices:new Uint16Array(indices)}}}let cameraRotator,scene,sceneTexture;let cubeTextEN,cubeTextRU,cubeTextCN;let cylinderTextEN,cylinderTextRU,cylinderTextCN;let coneTextEN,coneTextRU,coneTextCN;let sphereTextEN,sphereTextRU,sphereTextCN;let skybox;const projMatrix=mat4.create();let viewMatrix=mat4.create();const projViewMatrix=mat4.create();let currentLanguage;function testLangRadio(){if(this.id==="english"){currentLanguage=Language.English;draw()}else if(this.id==="russian"){currentLanguage=Language.Russian;draw()}else if(this.id==="chinese"){currentLanguage=Language.Chinese;draw()}else{console.log("unknown name")}}const langRadio=document.getElementsByName("language");for(let i=0;i<langRadio.length;i++){langRadio[i].onchange=testLangRadio;if(langRadio[i].checked){switch(langRadio[i].id){case"english":{currentLanguage=Language.English;break}case"russian":{currentLanguage=Language.Russian;break}case"chinese":{currentLanguage=Language.Chinese;break}default:{console.log("unknown name")}}}}function draw(){gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);mat4.mul(projViewMatrix,projMatrix,viewMatrix);scene.draw(projViewMatrix);skybox.draw(projViewMatrix);if(currentLanguage===Language.English){cubeTextEN.draw(projViewMatrix);cylinderTextEN.draw(projViewMatrix);coneTextEN.draw(projViewMatrix);sphereTextEN.draw(projViewMatrix)}else if(currentLanguage===Language.Russian){cubeTextRU.draw(projViewMatrix);cylinderTextRU.draw(projViewMatrix);coneTextRU.draw(projViewMatrix);sphereTextRU.draw(projViewMatrix)}else if(currentLanguage===Language.Chinese){cubeTextCN.draw(projViewMatrix);cylinderTextCN.draw(projViewMatrix);coneTextCN.draw(projViewMatrix);sphereTextCN.draw(projViewMatrix)}else{console.log("uknown name")}}async function init(){if(!initWebGLContext("renderCanvas")){return}gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.enable(gl.DEPTH_TEST);gl.clearColor(.2,.2,.2,1);gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);const fontProgram=await createProgram("./assets/shaders/","font.vert","font.frag");const englishFontImage=await loadImage("assets/fonts/candara.png");const englishFontResponse=await fetch("assets/fonts/candara.fnt");const englishFontContent=await englishFontResponse.text();const englishFont=new Font(fontProgram,englishFontContent,englishFontImage,Language.English);const russianFontImage=await loadImage("assets/fonts/cyrillic-sans.png");const russianFontResponse=await fetch("assets/fonts/cyrillic-sans.fnt");const russianFontContent=await russianFontResponse.text();const russianFont=new Font(fontProgram,russianFontContent,russianFontImage,Language.Russian);const chineseFontImage=await loadImage("assets/fonts/fireflysung.png");const chineseFontResponse=await fetch("assets/fonts/fireflysung.fnt");const chineseFontContent=await chineseFontResponse.text();const chineseFont=new Font(fontProgram,chineseFontContent,chineseFontImage,Language.Chinese);const cubeTextPosition=[-1.1,2.2,4];cubeTextEN=new Text(englishFont,"Cube");cubeTextEN.position=[...cubeTextPosition];cubeTextEN.position[0]=cubeTextEN.position[0]-cubeTextEN.width/2;cubeTextEN.position[1]=cubeTextEN.position[1]+cubeTextEN.height;cubeTextRU=new Text(russianFont,"Куб");cubeTextRU.position=[...cubeTextPosition];cubeTextRU.position[0]=cubeTextRU.position[0]-cubeTextRU.width/2;cubeTextRU.position[1]=cubeTextRU.position[1]+cubeTextRU.height;cubeTextCN=new Text(chineseFont,"立方体");cubeTextCN.position=[...cubeTextPosition];cubeTextCN.position[0]=cubeTextCN.position[0]-cubeTextCN.width/2;cubeTextCN.position[1]=cubeTextCN.position[1]+cubeTextCN.height;const coneTextPosition=[0,2.2,-4.36];coneTextEN=new Text(englishFont,"Cone");coneTextEN.position=[...coneTextPosition];coneTextEN.position[0]=coneTextEN.position[0]-coneTextEN.width/2;coneTextEN.position[1]=coneTextEN.position[1]+coneTextEN.height;coneTextRU=new Text(russianFont,"Конус");coneTextRU.position=[...coneTextPosition];coneTextRU.position[0]=coneTextRU.position[0]-coneTextRU.width/2;coneTextRU.position[1]=coneTextRU.position[1]+coneTextRU.height;coneTextCN=new Text(chineseFont,"锥体");coneTextCN.position=[...coneTextPosition];coneTextCN.position[0]=coneTextCN.position[0]-coneTextCN.width/2;coneTextCN.position[1]=coneTextCN.position[1]+coneTextCN.height;const cylinderTextPosition=[-3.6,2.2,0];cylinderTextEN=new Text(englishFont,"Cylinder");cylinderTextEN.position=[...cylinderTextPosition];cylinderTextEN.position[0]=cylinderTextEN.position[0]-cylinderTextEN.width/2;cylinderTextEN.position[1]=cylinderTextEN.position[1]+cylinderTextEN.height;cylinderTextRU=new Text(russianFont,"Цилиндр");cylinderTextRU.position=[...cylinderTextPosition];cylinderTextRU.position[0]=cylinderTextRU.position[0]-cylinderTextRU.width/2;cylinderTextRU.position[1]=cylinderTextRU.position[1]+cylinderTextRU.height;cylinderTextCN=new Text(chineseFont,"圆柱");cylinderTextCN.position=[...cylinderTextPosition];cylinderTextCN.position[0]=cylinderTextCN.position[0]-cylinderTextCN.width/2;cylinderTextCN.position[1]=cylinderTextCN.position[1]+cylinderTextCN.height;const sphereTextPosition=[-2.5,2.2,-3.3];sphereTextEN=new Text(englishFont,"Sphere");sphereTextEN.position=[...sphereTextPosition];sphereTextEN.position[0]=sphereTextEN.position[0]-sphereTextEN.width/2;sphereTextEN.position[1]=sphereTextEN.position[1]+sphereTextEN.height;sphereTextRU=new Text(russianFont,"Сфера");sphereTextRU.position=[...sphereTextPosition];sphereTextRU.position[0]=sphereTextRU.position[0]-sphereTextRU.width/2;sphereTextRU.position[1]=sphereTextRU.position[1]+sphereTextRU.height;sphereTextCN=new Text(chineseFont,"领域");sphereTextCN.position=[...sphereTextPosition];sphereTextCN.position[0]=sphereTextCN.position[0]-sphereTextCN.width/2;sphereTextCN.position[1]=sphereTextCN.position[1]+sphereTextCN.height;const vertexBuffers=await initVertexBuffers("assets/models/",["scene"]);sceneTexture=await loadTexture("assets/models/texture_without_built_in_ao.png");const skyboxProgram=await createProgram("assets/shaders/","skybox.vert","skybox.frag");const skybox_nx=await loadImage("assets/skybox/skybox_nx.jpg");const skybox_ny=await loadImage("assets/skybox/skybox_ny.jpg");const skybox_nz=await loadImage("assets/skybox/skybox_nz.jpg");const skybox_px=await loadImage("assets/skybox/skybox_px.jpg");const skybox_py=await loadImage("assets/skybox/skybox_py.jpg");const skybox_pz=await loadImage("assets/skybox/skybox_pz.jpg");const skyboxImages={nx:skybox_nx,ny:skybox_ny,nz:skybox_nz,px:skybox_px,py:skybox_py,pz:skybox_pz};skybox=new Skybox(400,skyboxProgram,skyboxImages);const lightmapProgram=await createProgram("./assets/shaders/","lightmap.vert","lightmap.frag");scene=new Object3DWithLightMap(lightmapProgram,vertexBuffers["scene"],sceneTexture);cameraRotator=new CameraRotator(gl.canvas,()=>{viewMatrix=cameraRotator.getViewMatrix();draw()},14,30,-48,0,2);viewMatrix=cameraRotator.getViewMatrix();window.onresize=()=>{const w=gl.canvas.clientWidth;const h=gl.canvas.clientHeight;gl.canvas.width=w;gl.canvas.height=h;gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);mat4.perspective(projMatrix,55*Math.PI/180,w/h,.1,500);draw()};window.onresize(null);draw()}init();