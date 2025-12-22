import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'dialog-template',
  imports: [DialogModule, ButtonModule],
  standalone: true,
  templateUrl: './dialog-template.html',
  styleUrl: './dialog-template.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogTemplate {

  promptInput: Array<any> = [];
  visibleInput= signal(false);

  @Input()
  headerDialogTitle: string="";
  @Input()
  set visible(value: boolean) {
      if (value !== undefined) {
          this.visibleInput.set(value);

      }
    }
  @Input()
  set selectedItem(value: any | undefined) {
      if (value !== undefined) {
          const array= Object.entries(value);
          this.promptInput= array;
      }
    }
  @Input()
  displayInfoInSelectedItem: Array<string>= [];
  @Input()
  actionButtonName: string=""

  @Output()
  submitActionButtonEmitter: EventEmitter<string>= new EventEmitter<string>();
  @Output() 
  visibleChange = new EventEmitter<boolean>();

  actionEvent($event: string){
    this.submitActionButtonEmitter.emit($event);
    this.visibleInput.set(false);
    this.visibleChange.emit(false);
  }

  onHideModal(){
    this.visibleInput.set(false);
    this.visibleChange.emit(false);
  }

  conditionToShowItem(item:Array<any>): boolean{
    return item.some(value => this.displayInfoInSelectedItem.includes(value));
  }
}
