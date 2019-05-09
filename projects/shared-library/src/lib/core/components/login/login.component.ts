import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { CoreState, UIStateActions } from '../../store';
import { Store } from '@ngrx/store';
import { FirebaseAuthService } from './../../auth/firebase-auth.service';
import { Login } from './login';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import { TermsAndPrivacyUrlConstant } from 'shared-library/shared/model';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class LoginComponent extends Login implements OnInit, OnDestroy {
  windowRef: any;
  ui: any;
  uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        // used this function to return false for do not redirect after success
        return false;
    }},
    autoUpgradeAnonymousUsers: false,
    signInOptions: [
      firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    ],
    signInFlow: 'popup',
    tosUrl: TermsAndPrivacyUrlConstant.TERMSANDCONDITIONSURL,
    privacyPolicyUrl: function() {
      window.location.assign(TermsAndPrivacyUrlConstant.PRIVACYURL);
    }
  };

  constructor(public fb: FormBuilder,
    public store: Store<CoreState>,
    public dialogRef: MatDialogRef<LoginComponent>,
    private uiStateActions: UIStateActions,
    private firebaseAuthService: FirebaseAuthService,
    public cd: ChangeDetectorRef) {
    super(fb, store, cd);
  }

  ngOnInit() {


  }


  phoneSignIn() {
    super.phoneSignIn();
      if (!this.ui) {
        this.ui = new firebaseui.auth.AuthUI(firebase.auth());
      }
      this.ui.start('#firebaseui-auth-container', this.uiConfig);
  }

  emailSignIn() {
    if ( this.ui  && this.signInMethod === 'phone') {
      this.ui.reset();
    }
    super.emailSignIn();
  }
  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }
    switch (this.mode) {
      case 0:
        // Login
        this.firebaseAuthService.signInWithEmailAndPassword(
          this.loginForm.get('email').value,
          this.loginForm.get('password').value
        ).then((user: any) => {
          // Success
          this.dialogRef.close();
        }, (error: Error) => {
          // Error
          this.notificationMsg = error.message;
          this.errorStatus = true;
        }).catch((error: Error) => {
          this.notificationMsg = error.message;
          this.errorStatus = true;
        },
       ).finally( () => {
          this.cd.detectChanges();
        });
        break;
      case 1:
        // Sign up
        this.firebaseAuthService.createUserWithEmailAndPassword(
          this.loginForm.get('email').value,
          this.loginForm.get('password').value
        ).then((user: any) => {
          // Success
          this.dialogRef.close();
          if (user && !user.emailVerified) {
            this.firebaseAuthService.sendEmailVerification(user).then(() => {
              this.notificationMsg = `email verification sent to ${this.loginForm.get('email').value}`;
              this.errorStatus = false;
            }, (error: Error) => {
              // Error
              this.notificationMsg = error.message;
              this.errorStatus = true;
            });
          }
        }, (error: Error) => {
          // Error
          this.notificationMsg = error.message;
          this.errorStatus = true;
        }).catch((error: Error) => {
          this.notificationMsg = error.message;
          this.errorStatus = true;
        }).finally( () => {
          this.cd.detectChanges();
        });
        break;
      case 2:
        // Forgot Password
        this.firebaseAuthService.sendPasswordResetEmail(this.loginForm.get('email').value)
          .then((a: any) => {
            this.notificationMsg = `email sent to ${this.loginForm.get('email').value}`;
            this.errorStatus = false;
            this.notificationLogs.push(this.loginForm.get('email').value);
            this.store.dispatch(this.uiStateActions.saveResetPasswordNotificationLogs(this.notificationLogs));
            this.cd.detectChanges();
          }, (error: Error) => {
            // Error
            this.notificationMsg = error.message;
            this.errorStatus = true;
            this.cd.detectChanges();
          }).catch((error: Error) => {
            this.notificationMsg = error.message;
            this.errorStatus = true;
            this.cd.detectChanges();
          });
    }
  }

  googleLogin() {
    this.firebaseAuthService.googleLogin().catch((error: Error) => {
      this.notificationMsg = error.message;
      this.errorStatus = true;
      this.cd.detectChanges();
    });
  }

  fbLogin() {
    this.firebaseAuthService.facebookLogin()
      .catch((error: Error) => {
        this.notificationMsg = error.message;
        this.errorStatus = true;
         this.cd.detectChanges();
      });
  }

  twitterLogin() {
    this.firebaseAuthService.twitterLogin()
      .catch((error: Error) => {
        this.notificationMsg = error.message;
        this.errorStatus = true;
        this.cd.detectChanges();
      });
  }

  githubLogin() {
    this.firebaseAuthService.githubLogin()
      .catch((error: Error) => {
        this.notificationMsg = error.message;
        this.errorStatus = true;
        this.cd.detectChanges();
      });
  }

  validateLogs() {
    if (this.notificationLogs.indexOf(this.loginForm.get('email').value) !== -1) {
      this.notificationMsg = `Password is sent on your email ${this.loginForm.get('email').value}`;
      return true;
    }
    this.notificationMsg = '';
    return false;
  }

  ngOnDestroy() {

  }

}

