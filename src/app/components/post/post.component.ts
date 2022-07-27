import {
  Component,
  OnInit,
  OnChanges,
  Input,
  SimpleChanges,
} from '@angular/core';
import {
  faShareSquare,
  faThumbsDown,
  faThumbsUp,
} from '@fortawesome/free-regular-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
// Firebase
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit, OnChanges {
  @Input() post;

  faShareSquare = faShareSquare;
  faThumbsDown = faThumbsDown;
  faThumbsUp = faThumbsUp;

  uid = null;

  upvote = 0;
  downvote = 0;

  constructor(private db: AngularFirestore, private auth: AuthService) {
    auth.getUser().subscribe((user) => {
      this.uid = user?.uid;
    });
  }

  ngOnInit(): void {}
  // TODO: bug in updating the changes.
  ngOnChanges(): void {
    console.log('ON CHANGE');
    console.log(this.post);

    if (this.post.vote) {
      console.log('1 stage');

      Object.values(this.post.vote).map((val: any) => {
        if (val.upvote) {
          this.upvote += 1;
        }
        if (val.downvote) {
          this.downvote += 1;
        }
      });
    }
  }

  // ! Use real time database always in firebase Broo..
  upVotePost() {
    console.log('up voting');
    this.db.collection('posts').doc(`${this.post.id}/vote/${this.uid}`).set({
      upvote: 1,
    });
  }
  downVotePost() {
    console.log('down voting');
    this.db.collection('posts').doc(`${this.post.id}/vote/${this.uid}`).set({
      downvote: 1,
    });
  }

  getInstaUrl() {
    return `https://instagram.com/${this.post.instaId}`;
  }
}
