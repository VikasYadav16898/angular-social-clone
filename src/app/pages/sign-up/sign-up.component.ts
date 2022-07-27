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
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  picture: string = 'https://freesvg.org/img/abstract-user-flat-1.png';

  uploadPercent = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  onSubmit(f: NgForm) {
    const { email, password, name, username, country, bio } = f.form.value;
    //TODO: Any Check on fields

    this.auth
      .signUp(email, password)
      .then((res) => {
        console.log(res);
        const { uid } = res.user;
        // *firebase database
        this.db.collection('Users').doc(uid).set({
          id: uuidv4(),
          uid,
          name,
          email,
          instaUserName: username,
          country,
          bio,
          picture: this.picture,
        });
      })
      .then(() => {
        this.router.navigateByUrl('/');
        this.toastr.success('SignUp Success');
      })
      .catch((err) => {
        this.toastr.error('SignUp Failed');
      });
  }

  async uploadFile(event) {
    const file = event.target.files[0];
    // Compressing and processing image.
    let resizedImage = await readAndCompressImage(file, imageConfig);
    const filePath = uuidv4(); //TODO:rename the image with uuid.
    // sets where to store file, can drill folders here
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, resizedImage);
    task.percentageChanges().subscribe((percentage) => {
      this.uploadPercent = percentage;
    });

    // here we are setting picture var to uploaded url using finalize
    //* Subscribe needs to be added  in last cause without it rxjs pipes wont work....
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.picture = url;
            this.toastr.success('Image Upload Success');
          });
        })
      )
      .subscribe();
  }
}
