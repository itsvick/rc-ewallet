import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClaimGrievanceService } from '../services/claim-grievance.service';
import { CredentialService } from '../services/credential/credential.service';
import { GeneralService } from '../services/general/general.service';
import { ToastMessageService } from '../services/toast-message/toast-message.service';
import { UtilService } from '../services/util/util.service';

@Component({
  selector: 'app-raise-claims',
  templateUrl: './raise-claims.component.html',
  styleUrls: ['./raise-claims.component.scss']
})
export class RaiseClaimsComponent implements OnInit {

  claimForm: FormGroup;
  credSchemaId: string = "";
  schemas: any[] = [];
  schemaDetails: any;
  fields = [];
  isLoading = false;
  isClaimRaised = false;
  showSuccessMessage = false;

  constructor(
    private readonly credentialService: CredentialService,
    private readonly toastMsg: ToastMessageService,
    private readonly generalService: GeneralService,
    private readonly utilService: UtilService,
    private readonly claimGrievanceService: ClaimGrievanceService
  ) { }

  ngOnInit(): void {
    this.getSchemaList();
  }

  getSchemaList() {
    this.credentialService.getSchemaList().subscribe((schemas: any) => {
      console.log(schemas);
      this.schemas = schemas.filter(item => item.schema_name === 'Enrollment Credentials'); //TODO: Remove this hard coded
    }, error => {
      console.log(error);
    });
  }

  onSchemaChange() {
    this.isLoading = true;
    this.fields = [];
    if (this.claimForm) {
      this.claimForm = undefined;
    }
    this.credentialService.getSchemaFields(this.credSchemaId).subscribe((schemaDetails: any) => {
      console.log(schemaDetails);
      this.schemaDetails = schemaDetails;
      this.showSingleCredentialForm();
      this.isLoading = false;
    }, error => {
      console.log(error);
      this.toastMsg.error('', this.generalService.translateString('SOMETHING_WENT_WRONG'));
      this.isLoading = false;
    });
  }

  showSingleCredentialForm() {
    if (this.credSchemaId) {
      if (this.credSchemaId === this.schemaDetails?.id) {
        let columnFields = [...this.schemaDetails.register_required, ...this.schemaDetails.required, ...this.schemaDetails.optional];
        columnFields = [...new Set(columnFields.map(item => item.trim()))]; //Remove spaces and duplicates
        console.log("columnFields", columnFields);
        const formGroupFields = this.getFormControlsFields(columnFields);
        console.log("formGroupFields", formGroupFields);
        this.claimForm = new FormGroup(formGroupFields);
      }
    } else {
      this.toastMsg.warning('', this.generalService.translateString('PLEASE_SELECT_SCHEMA_FIRST'));
    }
  }

  getFormControlsFields(formFields) {
    const formGroupFields = {};
    formFields.forEach(element => {
      const isRequired = this.schemaDetails.required.includes(element) || this.schemaDetails.register_required.includes(element);
      formGroupFields[element] = isRequired ? new FormControl("", Validators.required) : new FormControl("");
      this.fields.push({
        key: element,
        type: 'input',
        isRequired,
        label: this.utilService.variableNameToReadableString(element)
      });
    });
    return formGroupFields;
  }

  onSubmit(event) {
    console.log(event);
    console.log("singleIssueForm", this.claimForm.valid);
    console.log("value", this.claimForm.value);

    if (this.claimForm.valid) {
      this.isClaimRaised = true;
    }
  }

  raiseClaim() {
    this.isLoading = true;
    const payload = {
      credential_schema_id: this.credSchemaId,
      credentialSubject: this.claimForm.value
    }
    this.claimGrievanceService.raiseClaim(payload).subscribe(res => {
      this.isLoading = false;
      console.log("res", res);
      this.showSuccessMessage = true;
    }, error => {
      this.isLoading = false;
      console.log("error", error);
      this.toastMsg.error('', this.generalService.translateString('ERROR_WHILE_RAISING_CLAIM'));
    });
  }
}
