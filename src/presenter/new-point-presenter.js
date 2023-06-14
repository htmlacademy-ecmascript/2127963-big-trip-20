import {remove, render, RenderPosition} from '../framework/render.js';
import AddPointFormView from '../view/add-point-form-view.js';
//import {nanoid} from 'nanoid';
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

  init(tripOffers, tripDestinations) {
    if (this.#eventAddComponent !== null) {
      return;
    }

    this.#tripOffers = tripOffers;
    this.#tripDestinations = tripDestinations;

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

  setSaving() {
    this.#eventAddComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#eventAddComponent.updateElement({
        isDisabled: false,
        isSaving: false,
      });
    };

    this.#eventAddComponent.shake(resetFormState);
  }


  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
      //{id: nanoid(), ...point},
    );
    //this.destroy();
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
