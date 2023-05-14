import SortingView from '../view/sorting-view.js';
import EventsListView from '../view/events-list-view.js';
import EditPointFormView from '../view/edit-point-form-view.js';
import EventView from '../view/event-view.js';
import { render, replace } from '../framework/render.js';

export default class AppPresenter {
  #eventContainer = null;
  #pointModel = null;
  #offerModel = null;
  #destinationModel = null;

  #eventListComponent = new EventsListView();
  #sortComponent = new SortingView();

  #tripPoints = [];

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
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormByPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const eventComponent = new EventView({
      tripPoint,
      tripOffers,
      tripDestination,
      onEditClick: () => {
        replacePointByForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditComponent = new EditPointFormView({
      tripPoint,
      tripOffers,
      tripDestination,
      onFormSubmit: () => {
        replaceFormByPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onEditClick: () => {
        replaceFormByPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointByForm() {
      replace(pointEditComponent, eventComponent);
    }

    function replaceFormByPoint() {
      replace(eventComponent, pointEditComponent);
    }
    render(eventComponent, this.#eventListComponent.element);
  }

  #renderSort() {
    render(this.#sortComponent, this.#eventContainer);
  }

  #renderEventList() {
    render(this.#eventListComponent, this.#eventContainer);

    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderTripPoint(
        this.#tripPoints[i],
        this.#offerModel.getOffersByType(this.#tripPoints[i]),
        this.#destinationModel.getSelectedDestination(this.#tripPoints[i]));
    }
  }

  #renderBoard() {
    this.#renderSort();
    this.#renderEventList();
    //render(new SortingView(), this.#eventContainer);
    /*render(this.#eventListComponent, this.#eventContainer);

    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderTripPoint(
        this.#tripPoints[i],
        this.#offerModel.getOffersByType(this.#tripPoints[i]),
        this.#destinationModel.getSelectedDestination(this.#tripPoints[i]));
    }*/
  }
}

