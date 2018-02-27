import {Shape, Circle, Rectangle, Triangle} from './shapes';
import {View} from './view-canvas';

/**
 * The CAD drawing model currently being created
 */
export class Model {
  private shapes:Shape[] = [];
  private views:any[] = [];

  constructor() {}

  //returns shapes in Shape array (that keeps track
  //of all shapes on canvas)
  getShapes():Shape[] {
    return this.shapes;    
  }

  //takes in coordinates (x, y values) and 
  //returns shape over specified coordinates
  getShapeAt(x:number, y:number):Shape{
    let found:Shape;
    for(let shape of this.shapes){
      if(shape.contains(x,y)){
        found = shape;
      }
    }
    return found; //return last shape
  }

  //returns shape index over specified coordinates
  getShapeIndexAt(x:number, y:number):number {
    let index = 0;
    for(let shape of this.shapes){
      if(shape.contains(x,y)){
        break;
      }
      index++;
    }
    return index; //return last shape
  }

  //takes in an action and x, y coordinates,
  //adds new shape (according to selected action) to 
  //shape array and draws it on canvas view
  drawShape(action:string, x:number, y:number) {
    let shape;
    if(action === 'rectangle') {
      shape = new Rectangle(x, y, 60, 30);
    } else if (action === 'circle') {
      shape = new Circle(x, y, 25);
    } else if(action === 'triangle') {
      shape = new Triangle(x, y, x + 30, y - 30, x  + 60, y);
    }
    let canvas = <HTMLCanvasElement>$('#graphics-view canvas')[0];
    let brush = canvas.getContext('2d');
    shape.draw(brush);
    //saves shape into array to access later
    this.shapes.push(shape);
  }

  //displays shapes information in text box view
  showText() {
    let textArea = document.getElementsByClassName('form-control');
    textArea[0].innerHTML = '';
     for(let i = 0; i < this.shapes.length; i++) {
        textArea[0].innerHTML += JSON.stringify(this.shapes[i]) + '\n';  
     }
  }

  //takes in x, y coordinates and the type of
  //selected shape to update the shape's position
  updateShape(x: number, y:number, selected:Shape) {
    selected.setPosition(x, y);
  }

  //takes in the index value of the selected shape
  //in the Shape array to delete shape from Array
  deleteShape(index:number) {
    this.shapes.splice(index, 1);
  }

  //takes in a number and new number values to
  //updates shape properties
  updateShapeValues(x:number, newValues:{[index:string]: any}) {
    this.shapes[x].updateProperties(newValues);
  }

  //takes in a view to register the view with the model
  registerView(view) {
    if(this.views.indexOf(view)) {
      this.views.push(view);
    }
  }

  //notifies controller of changes
  notifyChanges() {
    let updatedViews = this.views.filter(function(i) {
      return i !== null;
    });
    for (let i = 0; i < this.views.length; i++) {
      this.views[i].controller.updateDisplay();
    }
  }

}
