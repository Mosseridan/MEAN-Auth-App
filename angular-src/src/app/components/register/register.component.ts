import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: String;
  username: String;
  email: String;
  password: String;

  constructor(
    private router: Router,
    private validateService: ValidateService,
    private authService: AuthService,
    private flashMessage:FlashMessagesService) { }

  ngOnInit() {
  }

  onRegisterSubmit(){
    const user = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password
    }

    // Require Fields
    if(!this.validateService.validateRegister(user)){
      this.flashMessage.show('Please fill in all fields.', {cssClass: 'alert-danger', timeout: 5000});
      return false;
    }

    // Validate Email
    if(!this.validateService.validateEmail(user.email)){
      this.flashMessage.show('Please use a valid email.', {cssClass: 'alert-danger', timeout: 5000});
      return false;
    }

    // Register User
    this.authService.registerUser(user).subscribe((data) => {
      if(data.success){
        this.flashMessage.show('Congratulations! You are now registered and can log in.', {cssClass: 'alert-success', timeout: 5000});
        this.router.navigate(['/login']);
      }else{
        this.flashMessage.show('Somthing went wrong while trying to regiser you in the server.', {cssClass: 'alert-danger', timeout: 5000});
        this.router.navigate(['/register']);
      }
    });
    
  }

}
