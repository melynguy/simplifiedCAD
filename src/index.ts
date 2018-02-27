import 'bootstrap'; //bootstrap.js for button toggling

import {Model} from './model';
import {View as CanvasView, CanvasController} from './view-canvas';
import {View as TextView, TextController} from './view-text';


let model = new Model();

let canvasController = new CanvasController(model);
let canvasView = new CanvasView(model, canvasController);

let textcontroller = new TextController(model);
let textView = new TextView(model, textcontroller);