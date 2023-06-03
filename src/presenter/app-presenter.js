import SortingView from '../view/sorting-view.js';
import EventsListView from '../view/events-list-view.js';
import { render, remove } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
//import { updateItem } from '../utils/utils.js';
import { comparePrice, compareDuration } from '../utils/point.js';
import {filter} from '../utils/filter-util.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import NoPointsView from '../view/no-points-view.js';

export default class AppPresenter {
  #eventContainer = null;
  #pointModel = null;
  #offerModel = null;
  #destinationModel = null;
  #filterModel = null;

  #eventListComponent = new EventsListView();
  #sortComponent = null;
  #noPointsComponent = null;

  //#tripPoints = [];
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  //#sourcedTripPoints = [];

  constructor({eventContainer, pointModel, offerModel, destinationModel, filterModel}) {
    this.#eventContainer = eventContainer;
    this.#pointModel = pointModel;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;
    this.#filterModel = filterModel;

    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.PRICE:
        //return [...this.#pointModel.points].sort(comparePrice);
        return filteredPoints.sort(comparePrice);
      case SortType.TIME:
        //return [...this.#pointModel.points].sort(compareDuration);
        return filteredPoints.sort(compareDuration);
    }
    return filteredPoints;
  }

  init() {
    //this.#tripPoints = [...this.#pointModel.points];
    //this.#sourcedTripPoints = [...this.#pointModel.points];

    this.#renderBoard();
  }

  /*#getOffersByType(tripPoint, offers) {
    const offersByType = offers.find((offer) => offer.type === tripPoint.type);
    return offersByType.offers;
  }*/

  //#renderTripPoint(tripPoint) {
  #renderTripPoint(point) {
    const pointPresenter = new PointPresenter({
      eventListContainer: this.#eventListComponent.element,

      tripOffers: this.#offerModel.offers,
      tripDestinations: this.#destinationModel.destinations,

      //onDataChange: this.#handlePointChange,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    /*pointPresenter.init(tripPoint);
    this.#pointPresenters.set(tripPoint.id, pointPresenter);*/

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  //#handlePointChange = (updatedPoint) => {
  //this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
  //this.#sourcedTripPoints = updateItem(this.#sourcedTripPoints, updatedPoint);
  //this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  //};
  #handleViewAction = (actionType, updateType, update) => {
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {

    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  /*#sortPoints(sortType) {
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
  }*/

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    //this.#sortPoints(sortType);
    this.#currentSortType = sortType;
    //this.#clearEventList();
    //this.#renderEventList();
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new SortingView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#eventContainer);
  }

  #renderEvents(points) {
    /*for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderTripPoint(this.#tripPoints[i]);
    }*/
    points.forEach((point) => this.#renderTripPoint(point));
  }

  #rennderNoPoints() {
    this.#noPointsComponent = new NoPointsView ({
      filterType: this.#filterType
    });

    render(this.#noPointsComponent, this.#eventListComponent.element);
  }

  #renderEventList() {
    render(this.#eventListComponent, this.#eventContainer);

    /*if (!this.#tripPoints.length) {
      render(new NoPointsView(), this.#eventListComponent.element);
      return;
    }*/
    /*if (!this.points.length) {
      render(this.#noPointsComponent, this.#eventListComponent.element);
      return;
    }*/
    if (!this.points.length) {
      this.#rennderNoPoints();
      return;
    }
    //this.#renderEvents();
    this.#renderEvents(this.points);
  }

  /*#clearEventList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }*/

  #clearBoard({resetSortType = false} = {}) {

    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#noPointsComponent);


    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderBoard() {
    this.#renderSort();
    this.#renderEventList();
  }
}
