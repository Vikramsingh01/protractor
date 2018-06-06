import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { Confirmation } from './confirmation';

@Injectable()
export class ConfirmService {

  private requireConfirmationSource = new EventEmitter<Confirmation>();
    private acceptConfirmationSource = new EventEmitter<Confirmation>();

    requireConfirmation = this.requireConfirmationSource.asObservable();
    accept = this.acceptConfirmationSource.asObservable();

    confirm(confirmation: Confirmation) {
        this.requireConfirmationSource.next(confirmation);
        return this;
    }

    onAccept() {
        this.acceptConfirmationSource.next();
    }

}
