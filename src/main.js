import AppPresenter from './presenter/app-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointModel from './model/point-model.js';
import OfferModel from './model/offer-model.js';
import DestinationModel from './model/destination-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic lfffjs;fofsldfjseayoew';
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';

const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');

const pointModel = new PointModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});
const offerModel = new OfferModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
}
);
const destinationModel = new DestinationModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
}
);
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

destinationModel.init();
offerModel.init();

filterPresenter.init();
appPresenter.init();

pointModel.init();
