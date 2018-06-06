import {NgModule,Component,ElementRef,AfterContentInit,Input,Output,EventEmitter,ContentChildren,QueryList,
trigger,state,transition,style,animate} from '@angular/core';
import {CommonModule} from '@angular/common';
import { AccordionHeaderComponent } from './accordion-header/accordion-header.component';

@Component({
    selector: 'tr-accordion',
    template: `
        <div [ngClass]="'ui-accordion ui-widget ui-helper-reset'" [ngStyle]="style" [class]="styleClass">
            <ng-content></ng-content>
        </div>
    `,
})
export class AccordionComponent implements BlockableUI {
    
    @Input() multiple: boolean;
    
    @Output() onClose: EventEmitter<any> = new EventEmitter();

    @Output() onOpen: EventEmitter<any> = new EventEmitter();

    @Input() style: any;
    
    @Input() styleClass: string;
    
    @Input() lazy: boolean;

    @Input() child: boolean = false;
    
    public tabs: AccordionTab[] = [];

    constructor(public el: ElementRef) {}

    addTab(tab: AccordionTab) {
        this.tabs.push(tab);
    }   
    
    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    } 
}

@Component({
    selector: 'tr-accordionTab',
    template: `
        <div role="tablist" class="ui-accordion-header ui-state-default ui-corner-all" [ngClass]="{'ui-state-active': selected,'ui-state-disabled':disabled}"
            (click)="toggle($event)">
            <div class="arrow-div"><span class="glyphicon" [ngClass]="{'glyphicon-chevron-down': selected, 'glyphicon-chevron-right': !selected}"></span></div>
            <a href="#" *ngIf="!hasHeaderFacet" role="tab" [attr.aria-expanded]="selected" id="{{header}}{{name}}" [attr.aria-selected]="selected">{{header}}</a>
            <a href="#" *ngIf="hasHeaderFacet" role="tab" [attr.aria-expanded]="selected" id="{{header}}{{name}}" [attr.aria-selected]="selected">
               {{header}} <ng-content select="tr-accordion-header"></ng-content>
            </a>
            
        </div>
        <div class="ui-accordion-content-wrapper" [@tabContent]="selected ? 'visible' : 'hidden'" 
            [ngClass]="{'ui-accordion-content-wrapper-overflown': !selected||animating}" role="tabpanel" [attr.aria-hidden]="!selected">
            <div class="ui-accordion-content ui-widget-content" *ngIf="lazy ? selected : true">
                <ng-content></ng-content>
            </div>
        </div>
    `,
    animations: [
        trigger('tabContent', [
            state('hidden', style({
                height: '0px'
            })),
            state('visible', style({
                height: '*'
            })),
            transition('visible => hidden', animate('0ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hidden => visible', animate('0ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AccordionTab {

    @Input() header: string;
    @Input() name: string;

    @Input() selected: boolean;

    @Input() disabled: boolean;
    
    @Output() selectedChange: EventEmitter<any> = new EventEmitter();

    @ContentChildren(AccordionHeaderComponent) headerFacet: QueryList<AccordionTab>;
    
    public animating: boolean;
    
    constructor(public accordion: AccordionComponent) {
        this.accordion.addTab(this);
    }

    toggle(event) {
        if(this.disabled) {
            return false;
        }
        
        this.animating = true;
        let index = this.findTabIndex();

        if(this.selected) {
            this.selected = false;
            this.accordion.onClose.emit({originalEvent: event, index: index});
        }
        else {
            if(!this.accordion.multiple) {
                for(var i = 0; i < this.accordion.tabs.length; i++) {
                    this.accordion.tabs[i].selected = false;
                    this.accordion.tabs[i].selectedChange.emit(false);
                }
            }

            this.selected = true;
            this.accordion.onOpen.emit({originalEvent: event, index: index});
        }
        
        this.selectedChange.emit(this.selected);
        
        //TODO: Use onDone of animate callback instead with RC6
        setTimeout(() => {
            this.animating = false;
        }, 0);

        event.preventDefault();
    }

    findTabIndex() {
        let index = -1;
        for(var i = 0; i < this.accordion.tabs.length; i++) {
            if(this.accordion.tabs[i] == this) {
                index = i;
                break;
            }
        }
        return index;
    }
    
    get lazy(): boolean {
        return this.accordion.lazy;
    }
    
    get hasHeaderFacet(): boolean {
        return this.headerFacet && this.headerFacet.length > 0;
    }
}

export interface BlockableUI {
    getBlockableElement(): HTMLElement;
}

