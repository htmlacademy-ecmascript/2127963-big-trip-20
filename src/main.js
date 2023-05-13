import { render } from './framework/render.js';
import FilterView from './view/filter-view.js';
import AppPresenter from './presenter/app-presenter.js';
import PointModel from './model/point-model.js';
import OfferModel from './model/offer-model.js';
import DestinationModel from './model/destination-model.js';

const tripEventsElement = document.querySelector('.trip-events');
const pointModel = new PointModel();
const offerModel = new OfferModel();
const destinationModel = new DestinationModel();

const filterElement = document.querySelector('.trip-controls__filters');
render(new FilterView(), filterElement);

const appPresenter = new AppPresenter({
  eventContainer: tripEventsElement,
  pointModel,
  offerModel,
  destinationModel
});
appPresenter.init();
