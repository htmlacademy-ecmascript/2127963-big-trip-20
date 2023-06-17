import {remove, render, RenderPosition} from '../framework/render.js';
import AddPointFormView from '../view/add-point-form-view.js';
import {UserAction, UpdateType} from '../const.js';

export default class NewPointPresenter {
  #eventListContainer = null;
  #offers = null;
  #destinations = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #eventAddComponent = null;

  constructor({eventListContainer, onDataChange, onDestroy}) {
    this.#eventListContainer = eventListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init(offers, destinations) {
    if (this.#eventAddComponent !== null) {
      return;
    }

    this.#offers = offers;
    this.#destinations = destinations;

    this.#eventAddComponent = new AddPointFormView({
      offers: this.#offers,
      destinations: this.#destinations,
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
    );
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
