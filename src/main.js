import FilterView from './view/filter-view.js';
import AppPresenter from './presenter/app-presenter.js';

import { render } from './render.js';

const tripEventsElement = document.querySelector('.trip-events');

const filterElement = document.querySelector('.trip-controls__filters');
render(new FilterView(), filterElement);

const appPresenter = new AppPresenter({eventContainer: tripEventsElement});
appPresenter.init();
