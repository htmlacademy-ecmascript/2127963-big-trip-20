import SortingView from '../view/sorting-view.js';
import EventsListView from '../view/events-list-view.js';
import EventsItemView from '../view/events-item.view.js';
import AddPointFormView from '../view/add-point-form-view.js';
import EventView from '../view/event-view.js';

import { render } from '../render.js';

const tripEventsElement = document.querySelector('.trip-events');

export default class AppPresenter {
  eventListComponent = new EventsListView();
  addPointFormItemComponent = new EventsItemView();

  init() {
    render(new SortingView(), tripEventsElement);
    render(this.eventListComponent, tripEventsElement);
    render(this.addPointFormItemComponent, this.eventListComponent.getElement());
    render(new AddPointFormView(), this.addPointFormItemComponent.getElement());

    for (let i = 0; i < 3; i++) {
      const eventItemComponent = new EventsItemView();
      render(eventItemComponent, this.eventListComponent.getElement());
      render(new EventView(), eventItemComponent.getElement());
    }
  }
}

