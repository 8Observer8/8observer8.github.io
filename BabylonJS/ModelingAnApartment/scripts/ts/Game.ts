/// <reference path="../libs/babylon.d.ts" />

class Game
{
    //private _canvas: HTMLCanvasElement;
    //private _engine: BABYLON.Engine;

    constructor(canvasElementName: string)
    {
        //this._canvas = document.getElementById(canvasElementName) as HTMLCanvasElement;
        //this._engine = new BABYLON.Engine(this._canvas, true);

        // Get the modal
        let modal = document.getElementById('myModal');

        // Get the image and insert it inside the modal - use its "alt" text as a caption
        let img = document.getElementById('imgPlan') as HTMLImageElement;
        let modalImg = document.getElementById("img01") as HTMLImageElement;
        let captionText = document.getElementById("caption");
        img.onclick = () =>
        {
            modal.style.display = "block";
            modalImg.src = img.src; //this.src;
            captionText.innerHTML = img.alt; //this.alt;
        }

        // Get the <span> element that closes the modal
        let span = document.getElementsByClassName("close")[0] as HTMLSpanElement;

        // When the user clicks on <span> (x), close the modal
        span.onclick = () =>
        {
            modal.style.display = "none";
        }
    }
}
