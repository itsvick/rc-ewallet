import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CredentialService } from '../services/credential/credential.service';
import { ToastMessageService } from '../services/toast-message/toast-message.service';
import { GeneralService } from '../services/general/general.service';
import { UtilService } from '../services/util/util.service';
import { ClaimGrievanceService } from '../services/claim-grievance.service';
import { IBlock, IDistrict, ISchool, IState } from '../app-interface';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { race } from 'rxjs';

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

  // stateList: IState[];
  // districtList: IDistrict[];
  // blockList: IBlock[];
  // schoolList: any[];
  // schoolCount: number = 1;

  // selectedState: IState;
  // selectedDistrict: IDistrict;
  // selectedBlock: IBlock;
  // selectedSchool: ISchool;

  // step = 1;


  // basicClaimForm = new FormGroup({
  //   schemaId: new FormControl('', [Validators.required]),
  //   state: new FormControl('', [Validators.required]),
  //   district: new FormControl('', [Validators.required]),
  //   block: new FormControl('', [Validators.required]),
  //   school: new FormControl('', [Validators.required])
  // });
  successModalRef: NgbModalRef;
  @ViewChild('successModal') successModal: TemplateRef<any>;

  constructor(
    private readonly credentialService: CredentialService,
    private readonly toastMsg: ToastMessageService,
    private readonly generalService: GeneralService,
    private readonly utilService: UtilService,
    private readonly claimGrievanceService: ClaimGrievanceService,
    private readonly modalService: NgbModal,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.getSchemaList();
    // this.getStateList();
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
    this.fields = [];
    if (this.claimForm) {
      this.claimForm = undefined;
    }
    this.credentialService.getSchemaFields(this.credSchemaId).subscribe((schemaDetails: any) => {
      console.log(schemaDetails);
      this.schemaDetails = schemaDetails;
      this.showSingleCredentialForm();
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
    //TODO: Add confirmation page here
    console.log(event);
    console.log("singleIssueForm", this.claimForm.valid);
    console.log("value", this.claimForm.value);

    if (this.claimForm.valid) {
      const payload = {
        credential_schema_id: this.credSchemaId,
        credentialSubject: this.claimForm.value
      }
      this.claimGrievanceService.raiseClaim(payload).subscribe(res => {
        console.log("res", res);
        this.successModalRef = this.modalService.open(this.successModal);
        race(this.successModalRef.closed, this.successModalRef.dismissed).subscribe(() => {
          this.router.navigate(['/home']);
        });
      }, error => {
        console.log("error", error);
        //TODO: Add error handling toast or modal
      });
    }
  }

  // getStateList() {
  //   this.claimGrievanceService.getStateList().subscribe((res) => {
  //     if (res.status) {
  //       this.stateList = res.data;
  //       this.basicClaimForm.controls.state.setValue('09'); //PS Hard coded to Uttar Pradesh
  //       this.onStateChange(this.basicClaimForm.controls.state.value);
  //     }
  //   });
  // }

  // onStateChange(selectedStateCode: string) {
  //   this.selectedState = this.stateList.find(item => item.stateCode === selectedStateCode);
  //   this.districtList = [];
  //   this.blockList = [];
  //   this.schoolList = [];
  //   this.basicClaimForm.controls.district.setValue('');
  //   this.basicClaimForm.controls.block.setValue('');
  //   this.basicClaimForm.controls.school.setValue('');
  //   this.isLoading = true;

  //   this.claimGrievanceService.getDistrictList({ stateCode: selectedStateCode }).subscribe((res) => {
  //     this.isLoading = false;
  //     if (res.status) {
  //       this.districtList = res.data;
  //     }
  //   }, error => {
  //     this.isLoading = false;
  //   })
  // }

  // onDistrictChange(selectedDistrictCode: string) {
  //   this.selectedDistrict = this.districtList.find(item => item.districtCode === selectedDistrictCode);
  //   this.blockList = [];
  //   this.schoolList = [];
  //   this.basicClaimForm.controls.block.setValue('');
  //   this.basicClaimForm.controls.school.setValue('');
  //   this.isLoading = true;
  //   this.claimGrievanceService.getBlockList({ districtCode: selectedDistrictCode }).subscribe((res) => {
  //     this.isLoading = false;
  //     if (res.status) {
  //       this.blockList = res.data;
  //     }
  //   }, error => {
  //     this.isLoading = false;
  //   });
  // }

  // onBlockChange(selectedBlockCode: string) {
  //   this.selectedBlock = this.blockList.find(item => item.blockCode === selectedBlockCode);
  //   this.schoolList = [];
  //   this.basicClaimForm.controls.school.setValue('');

  //   this.isLoading = true;
  //   this.getSchools();
  // }

  // getSchools() {
  //   const payload = {
  //     "regionType": "2",
  //     "regionCd": this.basicClaimForm.controls.district.value,
  //     "sortBy": "schoolName",
  //     "pageSize": "2",
  //     "pageNo": this.schoolCount
  //   }
  //   this.claimGrievanceService.getSchoolList(payload).subscribe((res) => {
  //     if (res.status) {
  //       this.schoolList = [...this.schoolList, ...res.data.pagingContent.filter(item => item.eduBlockCode === this.basicClaimForm.controls.block.value)];
  //       // this.schoolCount++;
  //       // this.getSchools();
  //     } else {
  //       this.isLoading = false;
  //     }
  //   }, error => {
  //     this.isLoading = false;
  //   });
  // }

  // onSchoolChange(selectedSchoolCode: string) {
  //   this.selectedSchool = this.schoolList.find(item => item.udiseCode === selectedSchoolCode);
  // }

  // onBasicClaimFormSubmit() {
  //   this.step = 2;
  // }


  closeModal() {
    if (this.successModalRef) {
      this.successModalRef.close();
    }
  }

}
