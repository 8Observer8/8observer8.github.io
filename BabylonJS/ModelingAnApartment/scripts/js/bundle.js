/// <reference path="../libs/babylon.d.ts" />
var Game = (function () {
    //private _canvas: HTMLCanvasElement;
    //private _engine: BABYLON.Engine;
    function Game(canvasElementName) {
        //this._canvas = document.getElementById(canvasElementName) as HTMLCanvasElement;
        //this._engine = new BABYLON.Engine(this._canvas, true);
        // Get the modal
        var modal = document.getElementById('myModal');
        // Get the image and insert it inside the modal - use its "alt" text as a caption
        var img = document.getElementById('imgPlan');
        var modalImg = document.getElementById("img01");
        var captionText = document.getElementById("caption");
        img.onclick = function () {
            modal.style.display = "block";
            modalImg.src = img.src; //this.src;
            captionText.innerHTML = img.alt; //this.alt;
        };
        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];
        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        };
    }
    return Game;
}());
/// <reference path="../libs/babylon.d.ts" />
/// <reference path="Game.ts" />
window.onload = function () {
    var game = new Game("renderCanvas");
};
//# sourceMappingURL=bundle.js.map