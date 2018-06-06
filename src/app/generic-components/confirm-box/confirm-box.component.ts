import { Component, ElementRef, OnDestroy, Input, EventEmitter, Renderer } from '@angular/core';
import { ConfirmService } from './confirm.service';
import { Confirmation } from './confirmation';
import { Subscription }   from 'rxjs/Subscription';

@Component({
    selector: 'tr-confirm-box',
    templateUrl: './confirm-box.component.html',
})
export class ConfirmBoxComponent implements OnDestroy {

    @Input() header: string;

    @Input() icon: string;

    @Input() message: string;

    @Input() acceptIcon: string = 'fa-check';

    @Input() acceptLabel: string = 'Yes';

    @Input() acceptVisible: boolean = true;

    @Input() rejectIcon: string = 'fa-close';

    @Input() rejectLabel: string = 'No';

    @Input() rejectVisible: boolean = true;

    @Input() width: any;

    @Input() height: any;

    @Input() closeOnEscape: boolean = true;

    @Input() rtl: boolean;

    @Input() closable: boolean = true;

    @Input() responsive: boolean = true;

    @Input() appendTo: any;

    @Input() key: string;


    confirmation: Confirmation;

    _visible: boolean;

    documentEscapeListener: any;

    documentResponsiveListener: any;

    mask: any;

    contentContainer: any;

    positionInitialized: boolean;

    subscription: Subscription;

    constructor(public el: ElementRef,
            public renderer: Renderer, private confirmationService: ConfirmService) {
        this.subscription = confirmationService.requireConfirmation.subscribe(confirmation => {
            if(confirmation.key === this.key) {
                this.confirmation = confirmation;
                this.message = this.confirmation.message || this.message;
                this.icon = this.confirmation.icon || this.icon;
                this.header = this.confirmation.header || this.header;
                this.rejectVisible = this.confirmation.rejectVisible == null ? this.rejectVisible : this.confirmation.rejectVisible;
                this.acceptVisible = this.confirmation.acceptVisible == null ? this.acceptVisible : this.confirmation.acceptVisible;

                if (this.confirmation.accept) {
                    this.confirmation.acceptEvent = new EventEmitter();
                    this.confirmation.acceptEvent.subscribe(this.confirmation.accept);
                }

                if (this.confirmation.reject) {
                    this.confirmation.rejectEvent = new EventEmitter();
                    this.confirmation.rejectEvent.subscribe(this.confirmation.reject);
                }

                this.visible = true;
            }
        });
    }

    @Input() get visible(): boolean {
        return this._visible;
    }

    set visible(val: boolean) {
        this._visible = val;

        if (this._visible) {
            if (!this.positionInitialized) {
                this.positionInitialized = true;
            }


        }

    }


    hide(event?: Event) {
        this.visible = false;

        if (event) {
            event.preventDefault();
        }
    }


    ngOnDestroy() {

        if (this.documentResponsiveListener) {
            this.documentResponsiveListener();
        }

        if (this.documentEscapeListener) {
            this.documentEscapeListener();
        }

        if (this.appendTo && this.appendTo === 'body') {
            document.body.removeChild(this.el.nativeElement);
        }

        this.subscription.unsubscribe();
    }

    accept() {
        if (this.confirmation.acceptEvent) {
            this.confirmation.acceptEvent.emit();
        }

        this.hide();
        this.confirmation = null;
    }

    reject() {
        if (this.confirmation.rejectEvent) {
            this.confirmation.rejectEvent.emit();
        }

        this.hide();
        this.confirmation = null;
    }
}
