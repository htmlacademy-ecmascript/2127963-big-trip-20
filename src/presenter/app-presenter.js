import SortingView from '../view/sorting-view.js';
import EventsListView from '../view/events-list-view.js';
import { render } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils.js';

export default class AppPresenter {
  #eventContainer = null;
  #pointModel = null;
  #offerModel = null;
  #destinationModel = null;

  #eventListComponent = new EventsListView();
  #sortComponent = new SortingView();

  #tripPoints = [];
  #pointPresenters = new Map();

  constructor({eventContainer, pointModel, offerModel, destinationModel}) {
    this.#eventContainer = eventContainer;
    this.#pointModel = pointModel;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;
  }

  init() {
    this.#tripPoints = [...this.#pointModel.points];
    this.#renderBoard();
  }

  #renderTripPoint(tripPoint, tripOffers, tripDestination) {
    const pointPresenter = new PointPresenter({
      eventListContainer: this.#eventListComponent.element,
      onDataChange: this.#handlePointChange
    });
    pointPresenter.init(tripPoint, tripOffers, tripDestination);
    this.#pointPresenters.set(tripPoint.id, pointPresenter);
  }

  #handlePointChange = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    const offersForUpdatedPoint = this.#offerModel.getOffersByType(updatedPoint);
    const destinationForUpdatedPoint = this.#destinationModel.getSelectedDestination(updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint, offersForUpdatedPoint, destinationForUpdatedPoint);
  };

  #renderSort() {
    render(this.#sortComponent, this.#eventContainer);
  }

  #renderEventList() {
    render(this.#eventListComponent, this.#eventContainer);
    this.#renderEvents();
  }

  #renderEvents() {
    for (let i = 0; i < this.#tripPoints.length; i++) {
      const point = this.#tripPoints[i];
      const offers = this.#offerModel.getOffersByType(this.#tripPoints[i]);
      const destination = this.#destinationModel.getSelectedDestination(this.#tripPoints[i]);

      this.#renderTripPoint(
        point,
        offers,
        destination);
    }
  }

  #clearEventList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderBoard() {
    this.#renderSort();
    this.#renderEventList();
  }
}

