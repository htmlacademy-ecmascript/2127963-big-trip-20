import AppPresenter from './presenter/app-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointModel from './model/point-model.js';
import OfferModel from './model/offer-model.js';
import DestinationModel from './model/destination-model.js';
import FilterModel from './model/filter-model.js';

const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');
const pointModel = new PointModel();
const offerModel = new OfferModel();
const destinationModel = new DestinationModel();
const filterModel = new FilterModel();

const filterElement = document.querySelector('.trip-controls__filters');

const appPresenter = new AppPresenter({
  mainContainer: tripMainElement,
  eventContainer: tripEventsElement,
  pointModel,
  offerModel,
  destinationModel,
  filterModel,
});

const filterPresenter = new FilterPresenter({
  filterContainer: filterElement,
  filterModel,
  pointModel
});

filterPresenter.init();
appPresenter.init();
