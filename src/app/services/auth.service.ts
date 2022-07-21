import { Injectable } from '@angular/core';

// Firebase Auth Import
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: AngularFireAuth) {}

  // Functions
  signUp(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  signIn(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  getUser() {
    return this.auth.authState;
  }

  signOut() {
    return this.auth.signOut();
  }
}
