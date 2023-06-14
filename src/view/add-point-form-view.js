import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeFullDate } from '../utils/point.js';
import { getLastWord } from '../utils/utils.js';
import { DEFAULT_POINT } from '../const.js';
import flatpickr from 'flatpickr';
import he from 'he';


import 'flatpickr/dist/flatpickr.min.css';

const createAddPointFormTemplate = (tripPoint, tripOffers, tripDestinations) => {
  const {
    type,
    dateFrom,
    dateTo,
    basePrice,
    isDisabled,
    isSaving,
  } = tripPoint;

  const renderDestionationList = () => {
    let renderedDestinations = '';

    tripDestinations.forEach((tripDestination) => {
      const renderedDestination = `<option value="${tripDestination.name}"></option>`;
      renderedDestinations += renderedDestination;
    });

    return renderedDestinations;
  };

  const getDestinationById = () => {
    if (tripPoint.destination !== null) {
      return tripDestinations.find((tripDestination) => tripDestination.id === tripPoint.destination);
    }
  };

  const selectedDestination = getDestinationById();


  const renderSelectedDestination = () => {
    if (tripPoint.destination !== null) {
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
    if (tripPoint.destination !== null) {
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
    if (tripPoint.destination === null) {
      return '';
    }
    return (selectedDestination?.description)
      ? `<h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${selectedDestination?.description}</p>`
      : '';
  };

  const getOffersByType = () => {
    const offersByType = tripOffers.find((offer) => offer.type === tripPoint.type);
    return offersByType?.offers;
  };

  const availableOffers = getOffersByType();

  const renderAvailableOffers = () => {

    let renderedOffers = '';

    availableOffers?.forEach((availableOffer) => {
      const {id, title, price} = availableOffer;

      const renderedOffer = `
       <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" data-offer-id="${id}" id="event-offer-${getLastWord(title)}-${id}" type="checkbox" name="event-offer-${getLastWord(title)}" ${tripPoint.offers.includes(id) ? 'checked' : ''}>
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

  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          ${renderSelectedDestination()}
          <datalist id="destination-list-1">
            ${renderDestionationList()}
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

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}
        ${tripPoint.dateFrom && tripPoint.dateTo && selectedDestination?.name && tripPoint.basePrice
      ? ''
      : 'disabled'}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset">Cancel</button>

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

export default class AddPointFormView extends AbstractStatefulView {
  #tripOffers = null;
  #tripDestinations = null;
  #handleFormSubmit = null;
  #handleCancelClick = null;
  #datepicker = null;

  constructor({tripPoint = DEFAULT_POINT , tripOffers, tripDestinations, onFormSubmit, onCancelClick}) {
    super();

    this._setState(AddPointFormView.parsePointToState({tripPoint}));
    this.#tripOffers = tripOffers;
    this.#tripDestinations = tripDestinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCancelClick = onCancelClick;

    this._restoreHandlers();
  }

  get template() {
    return createAddPointFormTemplate(this._state, this.#tripOffers, this.#tripDestinations);
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
      AddPointFormView.parsePointToState(point),
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
        dateFormat: 'd/m/Y H:i',
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
        dateFormat: 'd/m/Y H:i',
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

    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#eventTypeChangeHandler);

    this.element.querySelector('.event__section--offers')
      .addEventListener('change', this.#eventCheckHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formCancelClickHandler);

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

    const updatedDestination = this.#tripDestinations.find((tripDestination) => tripDestination.name === evt.target.value);

    const updatedDestinationId = (updatedDestination) ? updatedDestination.id : null;

    this.updateElement({
      ...this._state,
      destination: updatedDestinationId
    });
  };


  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(AddPointFormView.parseStateToPoint(this._state));
  };

  #formCancelClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCancelClick(AddPointFormView.parseStateToPoint(this._state));
  };

  static parsePointToState({tripPoint}) {
    return {...tripPoint,
      isDisabled: false,
      isSaving: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;

    return point;
  }

}
