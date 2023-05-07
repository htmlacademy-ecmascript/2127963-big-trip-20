import SortingView from '../view/sorting-view.js';
import EventsListView from '../view/events-list-view.js';
import EditPointFormView from '../view/edit-point-form-view.js';
import EventView from '../view/event-view.js';
import { render } from '../render.js';

export default class AppPresenter {
  eventListComponent = new EventsListView();

  constructor({eventContainer, pointModel, offerModel, destinationModel}) {
    this.eventContainer = eventContainer;
    this.pointModel = pointModel;
    this.offerModel = offerModel;
    this.destinationModel = destinationModel;
  }

  init() {
    this.tripPoints = [...this.pointModel.getPoints()];
    this.tripOffers = [...this.offerModel.getOffersByType(this.tripPoints[0])];
    this.tripDestination = this.destinationModel.getSelectedDestination(this.tripPoints[0]);

    render(new SortingView(), this.eventContainer);
    render(this.eventListComponent, this.eventContainer);
    render(new EditPointFormView(this.tripPoints[0], this.tripOffers, this.tripDestination), this.eventListComponent.getElement());
    for (let i = 0; i < this.tripPoints.length; i++) {
      render(new EventView(this.tripPoints[i], this.offerModel.getOffersByType(this.tripPoints[i]), this.destinationModel.getSelectedDestination(this.tripPoints[i])), this.eventListComponent.getElement());
    }
  }
}

