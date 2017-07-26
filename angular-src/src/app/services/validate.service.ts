import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  validateName(name){
    return (typeof name === 'string' && name != '');
  }

  validateEmail(email) {
    const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegExp.test(email);
  }

  validateUsername(username){
    return (typeof username === 'string' && username != '');
  }

  validatePassword(password){
    return (typeof password === 'string' && password != '');
  }
  
  validateRegister(user){
    if(!this.validateName(user.name))
      return {success: false, msg:'Please enter a valid name.'};
    if(!this.validateEmail(user.email))
      return {success: false, msg:'Please enter a valid email.'};
    if(!this.validateUsername(user.username))
      return {success: false, msg:'Please enter a valid username.'};
    if(!this.validatePassword(user.password))
      return {success: false, msg:'Please enter a valid password.'};
    return {success: true, msg:'All good.'};
  }

  validateLogin(user){
    if(!this.validateUsername(user.username))
      return {success: false, msg:'Please enter a valid username.'};
    if(!this.validatePassword(user.password))
      return {success: false, msg:'Please enter a valid password.'};
    return {success: true, msg:'All good.'};
  }
  
}
