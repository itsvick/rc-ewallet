import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/data/data-request.service';
import { AuthConfigService } from '../authentication/auth-config.service';
import { ToastMessageService } from '../services/toast-message/toast-message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  isLoading: boolean = false;
  registerForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    dob: new FormControl(null, [Validators.required]),
    gender: new FormControl(null, [Validators.required]),
    aadharId: new FormControl(null, [Validators.required]),
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
  });

  constructor(
    private readonly dataService: DataService,
    private readonly authConfigService: AuthConfigService,
    private readonly toasterService: ToastMessageService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
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
        this.toasterService.success("", "User registered successfully");
        this.router.navigate(['']);
      }, error  => {
        this.isLoading = false;
        this.toasterService.success("", "User registration failed! Please try again");
      })
    }

  }

}
