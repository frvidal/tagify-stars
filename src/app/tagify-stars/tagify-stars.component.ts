import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import Tagify from '@yaireo/tagify';
import { TagStar } from '../tag-star';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { mapToMapExpression } from '@angular/compiler/src/render3/util';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-tagify-stars',
  templateUrl: './tagify-stars.component.html',
  styleUrls: ['./tagify-stars.component.css']
})
export class TagifyStarsComponent implements AfterViewInit {

  @Input() whitelist = [];

  @Input() blacklist;

  /**
   * First values to put inside the component.
   */
  @Input() originalValues;

  /**
   * New values to replace the current content inside the component.
   */
  @Input() values$: Subject<TagStar[]>;

  /**
   * Additional data to be added in the component.
   */
  @Input() additionalValues$: Subject<TagStar[]>;

  @Input() readOnly$: BehaviorSubject<boolean>;

  @Input() placeholder;

  @Input() colorON;

  @Input() colorOFF;

  @Output() addTagEvent = new EventEmitter<TagStar>();

  @Output() editTagEvent = new EventEmitter<TagStar>();

  @Output() removeTagEvent = new EventEmitter<string>();

  tagify: Tagify;

  boundOnAddTag: any;
  boundOnRemoveTag: any;

  input: any;

  readOnly = false;

  // Array of eventHandler bound the the tagigy-stars component.
  // The goal of these eventHandler is to catch & save the selected star.
  boundOnClick = new Array(5);

  // The selected star
  public star: number;

  ngAfterViewInit() {

    this.input = document.getElementById('tagify-stars');

    this.tagify = new Tagify(this.input, {
      enforceWhitelist: true,
      placeholder: this.placeholder,
      readOnly: true,
      templates: {
        wrapper(input, settings) {
          return `<tags
                class="tagify ${settings.mode ? 'tagify--mix' : ''} ${input.className}" ${settings.readonly ? 'readonly' : ''}
                style="min-height:40px">
                <span id="tag-input" contenteditable data-placeholder="${settings.placeholder}" class="tagify__input"></span></tags>`;
        },
        tag(v, tagData) {
          return `<tag title='${v}' contenteditable='false' spellcheck="false" class='tagify__tag
              ${tagData.class ? tagData.class : ''}' ${this.getAttributes(tagData)}>
                <x title='' class='tagify__tag__removeBtn'></x>
                <div style="background-color:lightGrey" ><span class='tagify__tag-text'>
                  ${v}
                  <i class="fas fa-star" id='tag-star-${v}-0'></i>
                  <i class="fas fa-star" id='tag-star-${v}-1'></i>
                  <i class="fas fa-star" id='tag-star-${v}-2'></i>
                  <i class="fas fa-star" id='tag-star-${v}-3'></i>
                  <i class="fas fa-star" id='tag-star-${v}-4'></i>
                  </span>
                </div>
                </tag>`;
        }
      }
    }
    );

    this.tagify.settings.whitelist = [];
    this.whitelist.forEach(element => this.tagify.settings.whitelist.push(element));
    this.tagify.settings.blacklist = [];
    this.blacklist.forEach(element => this.tagify.settings.blacklist.push(element));
    this.tagify.settings.placeholder = '';

    this.boundOnClick[0] = this.onClick_0.bind(this);
    this.boundOnClick[1] = this.onClick_1.bind(this);
    this.boundOnClick[2] = this.onClick_2.bind(this);
    this.boundOnClick[3] = this.onClick_3.bind(this);
    this.boundOnClick[4] = this.onClick_4.bind(this);

    this.addValues(this.originalValues);

    this.boundOnAddTag = this.onAddTag.bind(this);
    this.boundOnRemoveTag = this.onRemoveTag.bind(this);

    // Chainable event listeners
    this.tagify.on('add', this.boundOnAddTag)
      .on('remove', this.onRemoveTag.bind(this))
      .on('click', this.onTagClick.bind(this));

    this.updateEventHandlerStars(this.originalValues);

    this.additionalValues$.subscribe(addedValues => {
      this.addValues(addedValues);
      this.updateEventHandlerStars(addedValues);
    });

    this.values$.subscribe(values => {
      this.removeValues();
      this.addValues(values);
      this.updateEventHandlerStars(values);
    });

    this.readOnly$.subscribe(readOnly => {
      this.readOnly = readOnly;

      const tagInput = document.getElementById('tag-input');
      tagInput.contentEditable = readOnly ? 'false' : 'true';

      document.querySelectorAll('.tagify__tag__removeBtn').forEach(elt =>
        elt.setAttribute('style', (readOnly ? 'visibility:hidden' : 'visibility:visible'))
      );

    });
  }

  private removeValues() {
    this.tagify.off('remove', this.boundOnRemoveTag);
    this.tagify.removeAllTags();
    this.tagify.on('remove', this.boundOnRemoveTag);
  }

  private addValues(values: TagStar[]) {
    this.tagify.off('add', this.boundOnAddTag);
    this.tagify.addTags(values.map(tagStar => tagStar.tag));
    values.forEach(tagStar => {
      for (let i = 0; i <= tagStar.star; i++) {
        this.setColor(tagStar.tag, i, this.colorON);
      }
      for (let i = tagStar.star + 1; i < 5; i++) {
        this.setColor(tagStar.tag, i, this.colorOFF);
      }
    });
    this.tagify.on('add', this.boundOnAddTag);
  }

  /**
   * Generate the key for a specific tag.
   * @param tag the searched tag
   * @param ind the associated level for the tag
   */
  private idStar(tag: string, ind: number) {
    return 'tag-star-' + tag + '-' + ind;
  }

  /**
   * Register an event handler for each star in the component.
   */
  updateEventHandlerStars(tagStars: TagStar[]) {
    tagStars.forEach(tagstar => {
      for (let i = 0; i < 5; i++) {
        const id = this.idStar(tagstar.tag, i);
        document.getElementById(id).onclick = this.boundOnClick[i];
      }
    });
  }

  /**
   * A new tag has been added in the list
   * @param e the associated tag
   */
  onAddTag(e: CustomEvent) {
    for (let i = 0; i < 5; i++) {
      const id = this.idStar(e.detail.data.value, i);
      document.getElementById(id).onclick = this.boundOnClick[i];
    }
    this.setColor(e.detail.data.value, 0, this.colorON);
    this.addTagEvent.emit(new TagStar(e.detail.data.value, 0));
  }

  /**
   * An existing tag has been removed from the list
   * @param e the associated tag
   */
  onRemoveTag(e: CustomEvent) {

    for (let i = 0; i < 5; i++) {
      const id = this.idStar(e.detail.data.value, i);
      document.getElementById(id).onclick = null;
    }
    this.removeTagEvent.emit(e.detail.data.value);
  }

  onTagClick(e: CustomEvent) {

    /**
     * If we are in a readonly mode, we cancel this treatment.
     */
    if (this.readOnly) {
      return;
    }

    const tag = e.detail.data.value;
    for (let i = 0; i <= this.star; i++) {
      this.setColor(tag, i, this.colorON);
    }
    for (let i = this.star + 1; i < 5; i++) {
      this.setColor(tag, i, this.colorOFF);
    }
    this.editTagEvent.emit(new TagStar(tag, this.star));
    this.star = 0;
  }

  /**
   * Set the color for a specific star of a tag
   * @param tag the tag
   * @param star the rank star inside the tag
   * @param color  the color to be set
   */
  setColor(tag: string, star: number, color: string) {
    document.getElementById(this.idStar(tag, star)).style.color = color;
  }

  /**
   * Save the number of the rank 'star'.
   */
  public onClick_0() {
    this.star = 0;
  }

  /**
   * Save the number of the rank 'star'.
   */
  public onClick_1() {
    this.star = 1;
  }

  /**
   * Save the number of the rank 'star'.
   */
  public onClick_2() {
    this.star = 2;
  }

  /**
   * Save the number of the rank 'star'.
   */
  public onClick_3() {
    this.star = 3;
  }

  /**
   * Save the number of the rank 'star'.
   */
  public onClick_4() {
    this.star = 4;
  }

}
