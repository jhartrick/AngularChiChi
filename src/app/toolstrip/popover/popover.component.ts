import { ComponentFactoryResolver, AfterViewInit, Input, ViewChild, Component,
    ComponentRef, EventEmitter, Output, ChangeDetectorRef, ContentChildren, QueryList, ViewChildren } from '@angular/core';
import { PopoverDirective } from './popover.directive';
import { PopoverContent } from './popover.content';
import { ContentChild } from '@angular/core/src/metadata/di';
import { PopoverSegmentComponent } from './popover.segment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime'
import {
    trigger,
    state,
    style,
    animate,
    transition,
    keyframes
  } from '@angular/animations';

@Component({
    selector: 'chichi-popover',
    templateUrl: './popover.component.html',
    styleUrls: ['./popover.component.css'],
    animations: [
        trigger('hoverAnimation', [
        state('*',   style({
            transform: 'translateX(-32px)'
        })),
        state('hover',   style({
            transform: 'translateX(0%)'
        })),
          transition('* => hover', animate('400ms 200ms ease-in', keyframes ([
            style({ transform: 'translateX(-32px)', offset: 0 }),
            style({ transform: 'translateX(36px)', offset: 0.5 }),
            style({ transform: 'translateX(0%)', offset: 1.0 })
            ])
          )),
          transition('hover => *', animate('500ms 100ms ease-out'))
        ])
      ]
})
export class PopoverComponent{
    
    @Input() icon: string;

   

    hoverState = '';
    constructor() {

    }



}
