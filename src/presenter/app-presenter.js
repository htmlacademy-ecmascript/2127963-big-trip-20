import SortingView from '../view/sorting-view.js';
import EventsListView from '../view/events-list-view.js';
import { render } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/utils.js';
import { comparePrice, compareDuration } from '../utils/point.js';
import { SortType } from '../const.js';
import NoPointsView from '../view/no-points-view.js';

export default class AppPresenter {
  #eventContainer = null;
  #pointModel = null;
  #offerModel = null;
  #destinationModel = null;

  #eventListComponent = new EventsListView();
  #sortComponent = null;

  #tripPoints = [];
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #sourcedTripPoints = [];

  constructor({eventContainer, pointModel, offerModel, destinationModel}) {
    this.#eventContainer = eventContainer;
    this.#pointModel = pointModel;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;
  }

  init() {
    this.#tripPoints = [...this.#pointModel.points];
    this.#sourcedTripPoints = [...this.#pointModel.points];

    this.#renderBoard();
  }

  #getOffersByType(tripPoint, offers) {
    const offersByType = offers.find((offer) => offer.type === tripPoint.type);
    return offersByType.offers;
  }

  #renderTripPoint(tripPoint/*, tripOffers, tripDestination*/) {
    const pointPresenter = new PointPresenter({
      eventListContainer: this.#eventListComponent.element,

      tripOffers: this.#offerModel.offers, // из модели получаем все предложения для всех типов
      //tripOffers: this.#getOffersByType(tripPoint, this.#offerModel.offers), // предложения по типу отбираются в модели
      //tripOffers: this.#offerModel.getOffersByType(tripPoint),
      //tripOfferModel: this.#offerModel, // модель передается во вью
      //tripDestination: this.#destinationModel.getSelectedDestination(tripPoint),
      tripDestinations: this.#destinationModel.destinations,

      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(tripPoint/*, tripOffers, tripDestination*/); // если инициализация на основе tripPoint, tripOffers, tripDestination
    this.#pointPresenters.set(tripPoint.id, pointPresenter);
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#sourcedTripPoints = updateItem(this.#sourcedTripPoints, updatedPoint);
    //const offersForUpdatedPoint = this.#offerModel.getOffersByType(updatedPoint); // если инициализация на основе tripPoint, tripOffers, tripDestination
    //const destinationForUpdatedPoint = this.#destinationModel.getSelectedDestination(updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint/*, offersForUpdatedPoint, destinationForUpdatedPoint*/);
  };

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.PRICE:
        this.#tripPoints.sort(comparePrice);
        break;
      case SortType.TIME:
        this.#tripPoints.sort(compareDuration);
        break;
      default:
        this.#tripPoints = [...this.#sourcedTripPoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    this.#clearEventList();
    this.#renderEventList();
  };

  #renderSort() {
    this.#sortComponent = new SortingView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#eventContainer);
  }

  #renderEventList() {
    render(this.#eventListComponent, this.#eventContainer);

    if (!this.#tripPoints.length) {
      render(new NoPointsView(), this.#eventListComponent.element);
      return;
    }
    this.#renderEvents();
  }

  #renderEvents() {
    for (let i = 0; i < this.#tripPoints.length; i++) {
      const point = this.#tripPoints[i];
      //const offers = this.#offerModel.getOffersByType(this.#tripPoints[i]);
      //const destination = this.#destinationModel.getSelectedDestination(this.#tripPoints[i]);

      this.#renderTripPoint(
        point,
        /*offers,
        destination*/);
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
