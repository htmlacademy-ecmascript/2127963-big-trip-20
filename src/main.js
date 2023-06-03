import { render } from './framework/render.js';
//import FilterView from './view/filter-view.js';
import AppPresenter from './presenter/app-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointModel from './model/point-model.js';
import OfferModel from './model/offer-model.js';
import DestinationModel from './model/destination-model.js';
//import { generateFilter } from './mock/filter-mock.js';
import FilterModel from './model/filter-model.js';

/*const filters = [
  {
    type: 'all',
    count: 0,
  },
];*/

const tripEventsElement = document.querySelector('.trip-events');
const pointModel = new PointModel();
const offerModel = new OfferModel();
const destinationModel = new DestinationModel();
const filterModel = new FilterModel();

//const filters = generateFilter(pointModel.points);

const filterElement = document.querySelector('.trip-controls__filters');
//render(new FilterView({filters}), filterElement);
/*render(new FilterView({
  filters,
  currentFilterType: 'all',
  onFilterTypeChange: () => {}
}), filterElement);*/

const appPresenter = new AppPresenter({
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
