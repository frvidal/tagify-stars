import { Component, AfterViewInit, OnInit } from '@angular/core';
import { TagStar } from './tag-star';
import { Subject } from 'rxjs';

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

  ngOnInit() {
    const tagStars = [{tag : 'Spring', star: 1}, {tag : 'JUnit', star: 0}];
    setTimeout( () => this.additionalValues$.next(tagStars), 10000);
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
