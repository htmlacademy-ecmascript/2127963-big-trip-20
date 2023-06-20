import SortingView from '../view/sorting-view.js';
import EventsListView from '../view/events-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import LoadingView from '../view/loading-view.js';
import ServerErrorView from '../view/server-error-view.js';

import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import InfoPresenter from './info-presenter.js';

import { comparePrice, compareDuration, compareDates } from '../utils/point.js';
import {filter} from '../utils/filter-util.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class AppPresenter {
  #pointModel = null;
  #offerModel = null;
  #destinationModel = null;
  #filterModel = null;

  #mainContainer = null;
  #eventContainer = null;
  #eventListComponent = new EventsListView();
  #sortComponent = null;
  #noPointsComponent = null;
  #newPointButtonComponent = null;
  #loadingComponent = new LoadingView();
  #serverErrorComponent = new ServerErrorView();

  #pointPresenters = new Map();
  #newPointPresenter = null;
  #infoPresenter = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  #areDestinationsLoaded = false;
  #areOffersLoaded = false;
  #arePointsLoaded = false;
  #isLoading = true;
  #isError = false;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({mainContainer, eventContainer, pointModel, offerModel, destinationModel, filterModel}) {
    this.#mainContainer = mainContainer;
    this.#eventContainer = eventContainer;
    this.#pointModel = pointModel;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;
    this.#filterModel = filterModel;

    const handleNewPointButtonClick = () => {
      this.createPoint();
      this.#newPointButtonComponent.element.disabled = true;
    };

    const handleNewPointFormClose = () => {
      this.#newPointButtonComponent.element.disabled = false;
    };

    this.#newPointButtonComponent = new NewPointButtonView({
      onClick: handleNewPointButtonClick,
    });

    this.#infoPresenter = new InfoPresenter ({
      infoContainer: this.#mainContainer,
    });

    this.#newPointPresenter = new NewPointPresenter({
      eventListContainer: this.#eventListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: handleNewPointFormClose,
    });

    this.#destinationModel.addObserver(this.#handleModelEvent);
    this.#offerModel.addObserver(this.#handleModelEvent);
    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.PRICE:
        return filteredPoints.sort(comparePrice);
      case SortType.TIME:
        return filteredPoints.sort(compareDuration);
    }
    return filteredPoints;
  }

  init() {
    this.#renderBoard();
  }

  #renderSort() {
    this.#sortComponent = new SortingView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#eventContainer, RenderPosition.AFTERBEGIN);
  }

  #renderEventList() {
    render(this.#eventListComponent, this.#eventContainer);
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(this.#offerModel.offers, this.#destinationModel.destinations);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      eventListContainer: this.#eventListComponent.element,

      offers: this.#offerModel.offers,
      destinations: this.#destinationModel.destinations,

      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderEvents(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderNoPoints() {
    this.#noPointsComponent = new NoPointsView ({
      filterType: this.#filterType
    });

    render(this.#noPointsComponent, this.#eventContainer);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#eventContainer);
  }

  #renderInfo() {
    if (this.#pointModel.points.length === 0) {
      if (this.#infoPresenter) {
        this.#infoPresenter.destroy();
      }
      return;
    }
    const points = this.#pointModel.points.sort((a, b) => compareDates(a.dateFrom, b.dateFrom));
    this.#infoPresenter.init(points, this.#destinationModel.destinations, this.#offerModel.offers);
  }

  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    render(this.#newPointButtonComponent, this.#mainContainer);
    this.#renderEventList();

    if (this.points.length === 0) {
      this.#renderInfo();
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderEvents(this.points);
    this.#renderInfo();
  }

  #clearBoard({resetSortType = false} = {}) {

    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }


    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderServerError() {
    render(this.#serverErrorComponent, this.#eventContainer);
  }


  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;

      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;

      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {

    switch (updateType) {
      case UpdateType.ERROR:
        this.#isError = true;
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderServerError();
        break;

      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;

      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;

      case UpdateType.MAJOR:
        if (this.#isError) {
          return;
        }
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;

      case UpdateType.DESTINATIONS:
        this.#areDestinationsLoaded = true;
        break;
      case UpdateType.OFFERS:
        this.#areOffersLoaded = true;
        break;
      case UpdateType.POINTS:
        this.#arePointsLoaded = true;
        break;

      case UpdateType.INIT:
        if (!this.#areDestinationsLoaded || !this.#areOffersLoaded || !this.#arePointsLoaded || this.#isError) {
          return;
        }
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#clearBoard();
        this.#renderBoard();
        this.#arePointsLoaded = false;

        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };
}
