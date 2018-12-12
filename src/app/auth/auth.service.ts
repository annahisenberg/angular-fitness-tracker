import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject'; // an object that lets you emit events and subscribe to them in other parts of the app
import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable() // need to use this when you want to inject a service into another service i.e. the router
export class AuthService {
    authChange = new Subject<boolean>(); //boolean payload
    private isAuthenticated = false;

    constructor(private router: Router, private afAuth: AngularFireAuth) { }

    registerUser(authData: AuthData) {
        this.afAuth.auth
            .createUserWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                this.authSuccessfully();
            })
            .catch(error => {
                console.log(error);
            });
    }

    login(authData: AuthData) {
        this.afAuth.auth
            .signInWithEmailAndPassword(authData.email.trim(), authData.password)
            .then(result => {
                this.authSuccessfully();
            })
            .catch(error => {
                console.log(error);
            });
    }

    logout() {
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
    }

    isAuth() {
        return this.isAuthenticated;
    }

    private authSuccessfully() {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
    }
}