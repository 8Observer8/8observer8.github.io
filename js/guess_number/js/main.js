/* jshint node: true */
/* global document: false */

"use strict";

var prNum, num;

var input = document.getElementById('mynum');
var out = document.getElementById('out');

// var tempOut = document.getElementById('temp-out');
// tempOut.innerHTML = prNum;

reset();

function f1() {
    num = input.value;

    if (num == prNum) {
        out.innerHTML = 'Вы угадали';
    } else if (num > prNum) {
        out.innerHTML = 'Вы ввели число больше, чем нужно';
    } else {
        out.innerHTML = 'Вы ввели число меньше, чем нужно';
    }
}

function reset() {
    input.value = '';
    out.innerHTML = '';
    prNum = Math.floor((Math.random() * 10) + 1);
    // tempOut.innerHTML = prNum;
}