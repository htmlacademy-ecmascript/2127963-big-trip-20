import AbstractView from '../framework/view/abstract-view.js';

const createServerErrorTemplate = () => (
  '<p class="trip-events__msg" style="color: red">Server unavailable</p>'
);

export default class ServerErrorView extends AbstractView {

  constructor() {
    super();
  }

  get template() {

    return createServerErrorTemplate();
  }
}
