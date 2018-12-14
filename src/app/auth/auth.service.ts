import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject'; // an object that lets you emit events and subscribe to them in other parts of the app
import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { TrainingService } from '../training/training.service';
import { MatSnackBar } from '@angular/material';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../app.reducer';

@Injectable() // need to use this when you want to inject a service into another service i.e. the router
export class AuthService {
    authChange = new Subject<boolean>(); //boolean payload
    private isAuthenticated = false;

    constructor(
        private router: Router,
        private afAuth: AngularFireAuth,
        private trainingService: TrainingService,
        private snackbar: MatSnackBar,
        private uiService: UIService,
        private store: Store<{ ui: fromApp.State }>
    ) { }

    initAuthListener() {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.isAuthenticated = true;
                this.authChange.next(true);
                this.router.navigate(['/training']);
            } else {
                this.trainingService.cancelSubscriptions();
                this.authChange.next(false);
                this.router.navigate(['/login']);
                this.isAuthenticated = false;
            }
        })
    }

    registerUser(authData: AuthData) {
        // this.uiService.loadingStateChanged.next(true);
        this.store.dispatch({ type: 'START_LOADING' });
        this.afAuth.auth
            .createUserWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                // this.uiService.loadingStateChanged.next(false);
                this.store.dispatch({ type: 'STOP_LOADING' });
            })
            .catch(error => {
                // this.uiService.loadingStateChanged.next(false);
                this.store.dispatch({ type: 'STOP_LOADING' });
                this.uiService.showSnackbar(error.message, null, 3000);
            });
    }

    login(authData: AuthData) {
        // this.uiService.loadingStateChanged.next(true);
        this.store.dispatch({ type: 'START_LOADING' });
        this.afAuth.auth
            .signInWithEmailAndPassword(authData.email.trim(), authData.password)
            .then(result => {
                // this.uiService.loadingStateChanged.next(false);
                this.store.dispatch({ type: 'STOP_LOADING' });
            })
            .catch(error => {
                // this.uiService.loadingStateChanged.next(false);
                this.store.dispatch({ type: 'STOP_LOADING' });
                this.uiService.showSnackbar(error.message, null, 3000);
            });
    }

    logout() {
        this.afAuth.auth.signOut();
    }

    isAuth() {
        return this.isAuthenticated;
    }

}