import { Component, AfterViewInit, OnInit } from '@angular/core';
import { TagStar } from './tag-star';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Main container for tagify-stars';

  private whitelist = ['java', 'javascript', 'C#', '.Net', 'Spring', 'JUnit'];

  private blacklist = [];

  public originalValues = [{tag : 'java', star: 3}, {tag : '.Net', star: 0}];

  public additionalValues$ = new Subject<TagStar[]>();

  public values$ = new Subject<TagStar[]>();

  public readOnly$ = new BehaviorSubject<boolean>(false);

  ngOnInit() {
    const tagStars = [{tag : 'Spring', star: 1}, {tag : 'JUnit', star: 0}];
    setTimeout( () => this.additionalValues$.next(tagStars), 5000);
    setTimeout( () => this.readOnly$.next(true), 10000);
    setTimeout( () => this.readOnly$.next(false), 15000);

    const tagStars2 = [{tag : 'Java', star: 3}];
    setTimeout( () => this.values$.next(tagStars2), 20000);
  }

  onAddTagEvent(tagStar: TagStar) {
    console.log ('Add event for ' + tagStar.tag + ' ' + tagStar.star);
  }

  onEditTagEvent(tagStar: TagStar) {
    console.log ('Edit event for ' + tagStar.tag + ' ' + tagStar.star);
  }

  onRemoveTagEvent(tag: string) {
    console.log ('Remove event for ' + tag);
  }

}
