"use strict";
var shapes_1 = require("./shapes");
/**
 * The CAD drawing model currently being created
 */
var Model = (function () {
    function Model() {
        this.shapes = [];
    }
    Model.prototype.getShapes = function () {
        return this.shapes;
    };
    Model.prototype.getShapeAt = function (x, y) {
        var found;
        for (var _i = 0, _a = this.shapes; _i < _a.length; _i++) {
            var shape = _a[_i];
            if (shape.contains(x, y)) {
                found = shape;
            }
        }
        return found; //return last shape
    };
    Model.prototype.drawShape = function (x, y) {
        var rekt = new shapes_1.Rectangle(x, y, x, y);
        var brush = new CanvasRenderingContext2D();
        rekt.draw(brush);
    };
    return Model;
}());
exports.Model = Model;
