import {Shape, DrawableShape} from './shapes';
import {Model} from './model';

export class View {
    readonly textBox = <HTMLInputElement>$('#text-view textarea')[0];
    readonly updateButton = $('#text-view button')[0];
    private action:string;

    constructor(private model:Model, private controller:TextController) {
        this.updateButton.addEventListener('click', (e) => {this.UpdateTextButton()});
        this.model.registerView(this);
        this.controller.setView(this);
    }

    display() {
        if(this.textBox === document.activeElement) {
            return;
        }
        this.textBox.value = '';
        let shapes = <DrawableShape[]>this.model.getShapes();
        for(let i = 0; i < shapes.length; i++) {
            this.textBox.value += JSON.stringify(shapes[i], null) + "\n";
        }
    }

    //updates shape according to changed text values
    UpdateTextButton() {
        this.controller.updateShape(this.textBox.value);
    }
}

//controller for textual view
export class TextController {
    private view:View;
    constructor(private model:Model){
    }

    //takes in a view and registers the 
    //view with the controller
    setView(view:View) {
        this.view = view;
    }

    updateDisplay() {
        this.view.display();
    }

    //takes in text to update shape information according
    //to changes made in textbox
    updateShape(text:string) {
        try {
            //splitting displated values/shapes
            let lines = text.split('\n');
            let newValues = [];
            for(let i = 0; i < lines.length - 1; i++) {
                //parse text into JSON format
                newValues[i] = (JSON.parse(lines[i]));
            }
            //allow updates to each shape in array according
            //to any new text values in text box
            let shapes = <Shape[]>this.model.getShapes();
            for(let i = 0; i < shapes.length; i++) {
                this.model.updateShapeValues(i, newValues[i]);
            }
            this.model.notifyChanges();
        } catch (e) {
            console.log;
            return;
        }
    }

}