import {Shape, DrawableShape} from './shapes';
import {Model} from './model';

/**
 * A class to represent the Canvas View. Contains control buttons and an HTML5 canvas.
 */
export class View {
  //constants for access
  readonly canvas = <HTMLCanvasElement>$('#graphics-view canvas')[0];
  readonly brush = this.canvas.getContext('2d'); //will be correctly typed!

  private selected:DrawableShape; //selected state is handled by View
  private action:string; //what action we are doing (handled by View)


  constructor(private model:Model, private controller:CanvasController){
    //event listeners (DOM for readability/speed)
    this.canvas.addEventListener('mousedown', (e) => {this.handleMouseDown(e)});
    this.canvas.addEventListener('mouseup', (e) => {this.handleMouseUp(e)});
    this.canvas.addEventListener('mousemove', (e) => {this.handleMove(e)});

    let optionButtons = $("#graphics-view input:radio");
    this.action = optionButtons.val(); //current (initial) selection    
    optionButtons.change((e) => { this.action = $(e.target).val();  console.log(this.action); }); //update action

    //responsive canvas
    $(window).resize(() => {this.resizeCanvas()}); //call function on window resize
    this.resizeCanvas(); //initial sizing
    this.model.registerView(this);
    this.controller.setView(this);
  }

  //draws canvas and shapes
  display() {
    //erase canvas
    this.brush.clearRect(0,0, this.canvas.width, this.canvas.height);

    let shapes = <DrawableShape[]>this.model.getShapes(); //read from the model

    //draw all the shapes!
    for(let shape of shapes){
      shape.draw(this.brush);
    }
    //when shapes are drawn, their textual information
    //is able to be displayed on textual view
    this.model.showText();
  }

  //takes in a mouse event and according to selected
  //action, allows user to manipulate shape
  handleMouseDown(event:MouseEvent){
    let x = event.offsetX;
    let y = event.offsetY;
    if(this.action === 'move') { 
      this.selected = <DrawableShape>this.model.getShapeAt(x,y);
    }
    else if(this.action === 'delete') {
      let index = this.model.getShapeIndexAt(x,y);
      this.model.deleteShape(index);
      this.model.notifyChanges();
    }
    else {
      this.model.drawShape(this.action, x, y);
      this.model.notifyChanges();
    }
  }  

  handleMouseUp(event:MouseEvent){
    this.selected = undefined;    
  }

  //takes in a mouse event to handle updated movement
  //or changes to shape
  handleMove(event:MouseEvent){
    let x = event.offsetX;
    let y = event.offsetY;

    if(this.selected){
      this.model.updateShape(x, y, this.selected);
      this.model.notifyChanges();
    }
  }

  //make Canvas responsive (adapted from http://ameijer.nl/2011/08/resizable-html5-canvas/)
  resizeCanvas() {
    const ratio = 1; //4/3;
    let canvasElem = $(this.canvas);
    canvasElem.attr('width', canvasElem.parent().width());
    canvasElem.attr('height', ratio*canvasElem.width());
    this.display();
  }
}

//controller for canvas view
export class CanvasController {
  private view:View;
  constructor(private model:Model){}

  //registers controller with view
  setView(view:View) {
    this.view = view;
  }

  updateDisplay(){
    this.view.display();
  }
}
