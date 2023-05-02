import SortingView from '../view/sorting-view.js';
import EventsListView from '../view/events-list-view.js';
import AddPointFormView from '../view/add-point-form-view.js';
import EventView from '../view/event-view.js';

import { render } from '../render.js';

export default class AppPresenter {
  eventListComponent = new EventsListView();

  constructor({eventContainer}) {
    this.eventContainer = eventContainer;
  }

  init() {
    render(new SortingView(), this.eventContainer);
    render(this.eventListComponent, this.eventContainer);
    render(new AddPointFormView(), this.eventListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new EventView(), this.eventListComponent.getElement());
    }
  }
}

