import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/data/data-request.service';
import { AuthConfigService } from '../authentication/auth-config.service';
import { ToastMessageService } from '../services/toast-message/toast-message.service';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  isLoading: boolean = false;
  registerModalRef: NgbModalRef;
  @ViewChild('registerModal') registerModal: TemplateRef<any>;
  today: string;



  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'),]),
    dob: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    // aadharId: new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern('^[0-9]*$')]),
    aadharId: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  constructor(
    private readonly dataService: DataService,
    private readonly authConfigService: AuthConfigService,
    private readonly toasterService: ToastMessageService,
    private readonly router: Router,
    private readonly modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.today = new Date().toISOString().slice(0, 10);
  }

  get registerFormControl() {
    return this.registerForm.controls;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;

      const payload =
      {
        url: this.authConfigService.config.bffUrl + '/v1/sso/learner/register',
        data: {
          "aadhar_id": this.registerForm.value.aadharId,
          "name": this.registerForm.value.name,
          "gender": this.registerForm.value.gender,
          "dob": this.registerForm.value.dob,
          "username": this.registerForm.value.username,
          "password": this.registerForm.value.password,
        }
      }

      this.dataService.post(payload).subscribe((result: any) => {
        console.log("User registered successfully");
        this.isLoading = false;
        const options: NgbModalOptions = {
          backdrop: 'static',
          animation: true,
          centered: true,
        };
        this.registerModalRef = this.modalService.open(this.registerModal, options);
        // this.toasterService.success("", "User registered successfully");

      }, (error: any) => {
        console.log("error", error);
        this.isLoading = false;
        const message = error?.error?.message ? error?.error?.message : "User registration failed! Please try again";
        this.toasterService.error("", message);
      })
    }
  }

  gotoLoginPage() {
    this.registerModalRef.dismiss();
    this.router.navigate(['/login']);
  }

}
