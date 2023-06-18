import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeFullDate, getOffersByType, getDestinationById, renderDestionationList, isTypeChecked } from '../utils/point.js';
import { getLastWord, capitalizeFirstLetter } from '../utils/utils.js';
import { POINT_TYPES } from '../const.js';
import flatpickr from 'flatpickr';
import he from 'he';


import 'flatpickr/dist/flatpickr.min.css';

const createEditPointFormTemplate = (point, offers, destinations) => {
  const {
    type,
    dateFrom,
    dateTo,
    basePrice,
    isDisabled,
    isSaving,
    isDeleting,
  } = point;

  const selectedDestination = getDestinationById(point, destinations);

  const renderSelectedDestination = () => {
    if (point.destination !== null) {
      return (
        `<input class="event__input  event__input--destination"
        id="event-destination-1"
        type="text"
        name="event-destination"
        value="${he.encode(`${selectedDestination?.name}`)}"
        list="destination-list-1">`
      );
    }
    return (
      `<input class="event__input  event__input--destination"
      id="event-destination-1"
      type="text"
      name="event-destination"
      value=""
      list="destination-list-1">`
    );
  };

  const renderPictures = () => {
    let renderedPictures = '';
    if (point.destination !== null) {
      selectedDestination?.pictures?.forEach((picture) => {
        const renderedPicture = `<img class="event__photo" src="${picture.src}" alt="${picture.description}"></img>`;
        renderedPictures += renderedPicture;
      });
    }

    return (renderedPictures === '') ? renderedPictures : (
      `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${renderedPictures}
       </div>
      </div>`
    );
  };

  const renderDestionationDescription = () => {
    if (point.destination === null) {
      return '';
    }
    return (selectedDestination?.description)
      ? `<h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${selectedDestination?.description}</p>`
      : '';
  };

  const availableOffers = getOffersByType(point, offers);

  const renderAvailableOffers = () => {

    let renderedOffers = '';

    availableOffers?.forEach((availableOffer) => {
      const {id, title, price} = availableOffer;

      const renderedOffer = `
       <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" data-offer-id="${id}" id="event-offer-${getLastWord(title)}-${id}" type="checkbox" name="event-offer-${getLastWord(title)}" ${point.offers.includes(id) ? 'checked' : ''}>
          <label class="event__offer-label" for="event-offer-${getLastWord(title)}-${id}">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
        </div>
          `;
      renderedOffers += renderedOffer;
    });
    return renderedOffers;
  };

  const renderAvailableOffersContainer = () => {
    if (availableOffers === '') {
      return '';
    }
    return (
      (availableOffers?.length)
        ? `<h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
          ${renderAvailableOffers()}
          </div>`
        : ''
    );
  };

  const renderEventTypeList = () => {
    let typeList = '';
    POINT_TYPES.forEach((pointType) => {
      const typeItem =
      `<div class="event__type-item">
        <input id="event-type-${pointType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}" ${isTypeChecked(pointType, type)}>
        <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-1">${capitalizeFirstLetter(pointType)}</label>
      </div>`;
      typeList += typeItem;
    });
    return typeList;
  };

  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${renderEventTypeList()};
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>

          ${renderSelectedDestination()}
          <datalist id="destination-list-1">
            ${renderDestionationList(destinations)}
          </datalist>

        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeFullDate(dateFrom)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeFullDate(dateTo)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${he.encode(`${basePrice}`)}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          ${renderAvailableOffersContainer()}
        </section>
        ${renderDestionationDescription()}
        ${renderPictures()}
      </section>
    </form>
    </li>`
  );
};

export default class EditPointFormView extends AbstractStatefulView {
  #offers = null;
  #destinations = null;
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #handleEditCloseClick = null;
  #datepicker = null;

  constructor({point, offers, destinations, onFormSubmit, onEditCloseClick, onDeleteClick}) {
    super();

    this._setState(EditPointFormView.parsePointToState({point}));
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleEditCloseClick = onEditCloseClick;

    this._restoreHandlers();
  }

  get template() {
    return createEditPointFormTemplate(this._state, this.#offers, this.#destinations);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  reset(point) {
    this.updateElement(
      EditPointFormView.parsePointToState({point: point}),
    );
  }

  #priceHandler = (evt) => {
    const previousPrice = this._state.basePrice;
    const price = Number(evt.target.value);
    this.updateElement({ ...this._state, basePrice: !Number.isNaN(price) ? Math.round(price) : previousPrice});
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };


  #setDateFrom = () => {

    this.#datepicker = flatpickr(
      this.element.querySelector('[name="event-start-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        enableTime: true,
        onChange: this.#dateFromChangeHandler,
        'time_24hr': true,
      },
    );
  };

  #setDateTo = () => {

    this.#datepicker = flatpickr(
      this.element.querySelector('[name="event-end-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        enableTime: true,
        onChange: this.#dateToChangeHandler,
        'time_24hr': true,
      },
    );
  };

  _restoreHandlers() {
    this.element.querySelector('.event--edit')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editCloseClickHandler);

    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#eventTypeChangeHandler);

    this.element.querySelector('.event__section--offers')
      .addEventListener('change', this.#eventCheckHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceHandler);

    this.#setDateFrom();
    this.#setDateTo();
  }

  #eventTypeChangeHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({

      ...this._state,
      type: evt.target.value,
      offers: []
    });
  };

  #eventCheckHandler = (evt) => {
    evt.preventDefault();

    const updatedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));

    this._setState({
      ...this.state,
      offers: updatedOffers.map((element) => element.dataset.offerId)
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    if (!evt.target.value) {
      return;
    }

    const updatedDestination = this.#destinations.find((destination) => destination.name === evt.target.value);

    const updatedDestinationId = (updatedDestination) ? updatedDestination.id : null;

    this.updateElement({
      ...this._state,
      destination: updatedDestinationId
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditPointFormView.parseStateToPoint(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditPointFormView.parseStateToPoint(this._state));
  };

  static parsePointToState({point}) {
    return {...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }

  #editCloseClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditCloseClick();
  };
}
