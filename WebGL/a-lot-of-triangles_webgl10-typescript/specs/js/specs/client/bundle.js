(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Class1_1 = require("../../src/client/Class1");
describe("Class1Tests", function () {
    it("PropertyName_DefaultValue_ReturnsClass1", function () {
        var instance1 = new Class1_1.Class1();
        expect(instance1.Name).toEqual("Class1");
    });
});

},{"../../src/client/Class1":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Class2_1 = require("../../src/client/Class2");
describe("Class2Tests", function () {
    it("PropertyName_DefaultValue_ReturnsClass2", function () {
        var instance2 = new Class2_1.Class2();
        expect(instance2.Name).toEqual("Class2");
    });
});

},{"../../src/client/Class2":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Class1 = /** @class */ (function () {
    function Class1() {
        this._name = "Class1";
    }
    Object.defineProperty(Class1.prototype, "Name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    return Class1;
}());
exports.Class1 = Class1;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Class2 = /** @class */ (function () {
    function Class2() {
        this._name = "Class2";
    }
    Object.defineProperty(Class2.prototype, "Name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    return Class2;
}());
exports.Class2 = Class2;

},{}]},{},[1,2]);
