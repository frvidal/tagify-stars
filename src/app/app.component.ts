import { Component, AfterViewInit } from '@angular/core';
import { TagStar } from './tag-star';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {

  title = 'Main container for tagify-stars';

  private whitelist = ['java', 'javascript', 'C#', '.Net'];

  private blacklist = [];

  public originalValues = [{tag : 'java', star: 3}, {tag : '.Net', star: 0}];

  onAddTagEvent(tagStar: TagStar) {
    console.log ('Add event for ' + tagStar.tag + ' ' + tagStar.star);
  }

  onRemoveTagEvent(tag: string) {
    console.log ('Remove event for ' + tag);
  }

}
