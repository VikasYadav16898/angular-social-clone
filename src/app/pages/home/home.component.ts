import { Component, OnInit } from '@angular/core';
//firebase
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  users = [];
  posts = [];

  isLoading = false;

  constructor(private db: AngularFirestore, private toastr: ToastrService) {
    this.isLoading = true;
    // getting all users
    this.db
      .collection('Users')
      .valueChanges()
      .subscribe((obj) => {
        if (obj) {
          //! way of converting an objects into user array.
          this.users = Object.values(obj);
          this.isLoading = false;
        } else {
          toastr.error('No user found.');
          this.users = [];
          this.isLoading = false;
        }
      });

    // getting all posts from firebase store
    db.collection('posts')
      .valueChanges()
      .subscribe((obj) => {
        if (obj) {
          this.posts = Object.values(obj).sort();
          // console.log('POSTS', obj);

          this.isLoading = false;
        } else {
          toastr.error('No Posts Found.');
          this.posts = [];
          this.isLoading = false;
        }
      });
  }

  ngOnInit(): void {}
}
