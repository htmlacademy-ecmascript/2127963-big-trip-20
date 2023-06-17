import EditPointFormView from '../view/edit-point-form-view.js';
import EventView from '../view/event-view.js';
import { render, replace, remove } from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #eventListContainer = null;
  #eventEditComponent = null;
  #eventComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #point = null;
  #offers = null;
  #destinations = null;
  #mode = Mode.DEFAULT;


  constructor({eventListContainer, offers, destinations, onDataChange, onModeChange}) {
    this.#eventListContainer = eventListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  init(point) {
    this.#point = point;


    const previousEventComponent = this.#eventComponent;
    const previousEventEditComponent = this.#eventEditComponent;


    this.#eventComponent = new EventView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onEditClick: () => {
        this.#replacePointByForm();
      },
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#eventEditComponent = new EditPointFormView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      onEditCloseClick: this.#hadleEditCloseClick
    });

    if (previousEventComponent === null || previousEventEditComponent === null) {
      render(this.#eventComponent, this.#eventListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, previousEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventComponent, previousEventEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(previousEventComponent);
    remove(previousEventEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#eventEditComponent.reset(this.#point);
      this.#replaceFormByPoint();
    }
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#eventEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#eventEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
  }

  #hadleEditCloseClick = () => {
    this.#eventEditComponent.reset(this.#point);
    this.#replaceFormByPoint();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#eventComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#eventEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#eventEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (update) => {

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      update,
    );
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#eventEditComponent.reset(this.#point);
      this.#replaceFormByPoint();
    }
  };

  #replacePointByForm() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormByPoint() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }
}
