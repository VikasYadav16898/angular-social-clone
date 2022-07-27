import { Component, OnInit } from '@angular/core';
// imports
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
//services
import { AuthService } from 'src/app/services/auth.service';

//new Imports
import { finalize } from 'rxjs';
//firebase
import { AngularFireModule } from '@angular/fire/compat';
import {
  AngularFireStorage,
  AngularFireStorageModule,
} from '@angular/fire/compat/storage';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
// browser image resizer
import { readAndCompressImage } from 'browser-image-resizer';
import { imageConfig } from 'src/utils/config';
//UUid
import { uuidv4 } from '@firebase/util';

@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.css'],
})
export class AddpostComponent implements OnInit {
  locationName: string;
  description: string;
  picture: string = null;

  user = null;
  uploadPercent: number = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private toastr: ToastrService
  ) {
    //! Tricky
    auth.getUser().subscribe((user) => {
      console.log('USER', user);

      this.db
        .collection('Users')
        .doc(user.uid)
        .valueChanges()
        .subscribe((user) => {
          this.user = user;
        });
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    const uid = uuidv4();
    this.db
      .collection('posts')
      .doc(uid)
      .set({
        id: uid,
        locationName: this.locationName,
        description: this.description,
        picture: this.picture,
        by: this.user.name,
        instaId: this.user.instaUserName,
        date: Date.now(),
      })
      .then(() => {
        this.toastr.success('Posted Successfully.');
        this.router.navigateByUrl('/');
      })
      .catch((err) => {
        this.toastr.error(err.message);
      });
  }

  async uploadFile(event) {
    const file = event.target.files[0];
    let resizedImage = await readAndCompressImage(file, imageConfig);

    const filePath = uuidv4();
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, resizedImage);

    task.percentageChanges().subscribe((percentage) => {
      this.uploadPercent = percentage;
    });

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.picture = url;
            this.toastr.success('Image upload Success.');
          });
        })
      )
      .subscribe();
  }
}
