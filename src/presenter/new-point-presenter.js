import {remove, render, RenderPosition} from '../framework/render.js';
import AddPointFormView from '../view/add-point-form-view.js';
import {nanoid} from 'nanoid';
import {UserAction, UpdateType} from '../const.js';

export default class NewPointPresenter {
  #eventListContainer = null;
  #tripOffers = null;
  #tripDestinations = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #eventAddComponent = null;

  constructor({eventListContainer, tripOffers, tripDestinations, onDataChange, onDestroy}) {
    this.#eventListContainer = eventListContainer;
    this.#tripOffers = tripOffers;
    this.#tripDestinations = tripDestinations;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#eventAddComponent !== null) {
      return;
    }

    this.#eventAddComponent = new AddPointFormView({
      tripOffers: this.#tripOffers,
      tripDestinations: this.#tripDestinations,
      onFormSubmit: this.#handleFormSubmit,
      onCancelClick: this.#handleCancelClick
    });

    render(this.#eventAddComponent, this.#eventListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#eventAddComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#eventAddComponent);
    this.#eventAddComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
    );
    this.destroy();
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
