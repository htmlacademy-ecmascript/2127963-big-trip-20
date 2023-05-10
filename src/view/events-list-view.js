//import {createElement} from '../render.js';
import AbstractView from '../framework/view/abstract-view.js';

function createEventsListTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class EventsListView extends AbstractView {
  get template() {
    return createEventsListTemplate();
  }
}

/*export default class EventsListView {
  getTemplate() {
    return createEventsListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}*/
