/* jshint node: true */
/* global window: false, document: false, alert: false, Scene: false */

"use strict";

function main() {
    Scene.initialize("renderCanvas");

    var radio = document.getElementsByName("shapes");

    for (var i = 0; i < radio.length; i++) {
        radio[i].onchange = testRadio;
    }

    document.getElementById("one").onclick = checkRadio;
}
window.onload = main;

function testRadio() {
    Scene.setShape(this.value);
}

function checkRadio() {
    var m = document.getElementsByName("shapes");
    for (var i = 0; i < m.length; i++) {
        if (m[i].checked) {
            alert(m[i].value);
            break;
        }
    }
}