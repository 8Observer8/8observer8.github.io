/* jshint node: true */
/* global document: false */

"use strict";

var prNum = Math.floor((Math.random() * 10) + 1);
// var tempOut = document.getElementById('temp-out');
// tempOut.innerHTML = prNum;

function f1() {
    var num = document.getElementById('mynum').value;
    var out = document.getElementById('out');

    if (num == prNum) {
        out.innerHTML = 'Вы угадали';
    } else if (num > prNum) {
        out.innerHTML = 'Вы ввели число больше, чем нужно';
    } else {
        out.innerHTML = 'Вы ввели число меньше, чем нужно';
    }
}