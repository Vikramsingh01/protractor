import { Component, OnInit,  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Observable } from 'rxjs/Observable';
import { FormGroup,NgForm, FormControl, FormBuilder,Validators} from '@angular/forms';
import { RegistrationReviewService } from "../../registration-review/registration-review.service";
import { RegistrationReview } from "../../registration-review/registration-review";
import { HeaderService } from '../../../views/header/header.service';
import { AddressDetailPendingTransferComponent } from "../../address/address-detail-pending-transfer/address-detail-pending-transfer.component";
import { PendingTransferService } from "../pending-transfer.service";
import { PendingTransfer } from "../pending-transfer";
import {Title} from "@angular/platform-browser";
@Component({
    selector: 'tr-pending-transfer-allocation',
    templateUrl: 'pending-transfer-allocation.component.html',
})
export class PendingTransferAllocationComponent implements OnInit {
    pendingTransferForm: FormGroup;
    private pendingTransfer: PendingTransfer = new PendingTransfer();
    pendingTransfr: PendingTransfer;
    constructor(private _fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private pendingTransferService:PendingTransferService,
        private _titleService: Title
    ) { 
        
    }

    ngOnInit() {
        this._titleService.setTitle('Allocation');
      this.route.params.subscribe((params: any) => {
          
      this.pendingTransfer.transferRequestId = params['transferRequestId'];
      });
       this.pendingTransferService.getPendingTransferDate(this.pendingTransfer.transferRequestId).subscribe(data => {
          //this.router.navigate(['../../..'], { relativeTo: this.route });
          this.pendingTransfer=data;
      })
      this.initForm();
    }

    isAuthorized(action) {
        return true;
    }
    isFeildAuthorized(field) {
        if (field == 'spgVersion' || field == 'spgUpdateUser') {
            return false;
        }
        //return this.authorizationService.isFeildAuthorized(OffenderProfileConstants.featureId, field, "Read");
        return true;
    }
      initForm() {
        this.pendingTransferForm = this._fb.group({
            profileId: [this.pendingTransfer.profileId],
            transferRequestId: [this.pendingTransfer.transferRequestId],
            pendingTransferId: [this.pendingTransfer.pendingTransferId],
            dateReceived: [this.pendingTransfer.dateReceived],
      
        });
    }
}
