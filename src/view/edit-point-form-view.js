import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeFullDate } from '../utils/point.js';
import { getLastWord } from '../utils/utils.js';

const createEditPointFormTemplate = (tripPoint, tripOffers, tripDestinations) => {
  const {type, dateFrom, dateTo, basePrice} = tripPoint;

  const destinationById = tripDestinations.find((tripDestination) => tripDestination.id === tripPoint.destination);

  const {name, description, pictures} = destinationById;

  const renderSelectedDestination = () => (
    `<input class="event__input  event__input--destination"
      id="event-destination-1"
      type="text"
      name="event-destination"
      value="${name}"
      list="destination-list-1">`
  );

  const renderDestionationList = () => {
    let renderedDestinations = '';
    tripDestinations.forEach((tripDestination) => {
      const renderedDestination = `<option value="${tripDestination.name}"></option>`;
      renderedDestinations += renderedDestination;
    });
    return renderedDestinations;
  };

  const getOffersByType = (point, offers) => { // в случае, если в tripOffers передаются ВСЕ offers из модели, доступные для всех типов
    const offersByType = offers.find((offer) => offer.type === point.type);
    return offersByType.offers;
  };

  const availableOffers = getOffersByType(tripPoint, tripOffers);

  const renderAvailableOffers = () => {
    let renderedOffers = '';

    availableOffers.forEach((availableOffer) => { // в случае, если в  передаются ВСЕ offers из модели, доступные для всех типов
      const {id, title, price} = availableOffer;

      //tripOffers.forEach((tripOffer) => { //если в tripOffers передаются предложения,  доступные только для данного типа
      //const {id, title, price} = tripOffer;
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

  const renderAvailableOffersContainer = () => (availableOffers.length)
    ? `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${renderAvailableOffers()}
        </div>
      </section>`
    : '';

  const renderPictures = () => {
    let renderedPictures = '';

    pictures.forEach((picture) => {
      const renderedPicture = `<img class="event__photo" src="${picture.src}" alt="${picture.description}"></img>`;
      renderedPictures += renderedPicture;
    });

    return renderedPictures;
  };

  const renderPicturesContainer = () => {
    if (pictures.length) {

      return (
        `<div class="event__photos-container">
          <div class="event__photos-tape">
            ${renderPictures()}
         </div>
        </div>`
      );
    }
  };

  const renderDestionationDescriptionContainer = () => (description)
    ? `<h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
        ${renderPicturesContainer()}`
    : '';

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
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          ${renderAvailableOffersContainer()}
        </section>
        ${renderDestionationDescriptionContainer()}
      </section>
    </form>
    </li>`
  );
};

export default class EditPointFormView extends AbstractStatefulView {
  //#tripPoint = null;
  #tripOffers = null;
  #tripDestinations = null;
  #handleFormSubmit = null;
  #handleEditClick = null;

  constructor({tripPoint, tripOffers, tripDestinations, onFormSubmit, onEditClick}) {
    super();

    this._setState(EditPointFormView.parsePointToState(tripPoint));
    this.#tripOffers = tripOffers; // в случае, если в  передаются ВСЕ offers из модели, доступные для всех типов
    //this.#tripOffers = tripOffers.getOffersByType(this._state); // если передается модель
    this.#tripDestinations = tripDestinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditClick = onEditClick;

    this._restoreHandlers();
  }

  get template() {
    //return createEditPointFormTemplate(this._state, this.#tripOffers.getOffersByType(this._state), this.#tripDestination); //если передается модель - еще 1 вариант
    return createEditPointFormTemplate(this._state, this.#tripOffers, this.#tripDestinations);
  }

  _restoreHandlers() {
    this.element.querySelector('.event--edit')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);

    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#eventTypeChangeHandler);

    this.element.querySelector('.event__section--offers')
      .addEventListener('change', this.#eventCheckHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

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

    const updatedDestination = this.#tripDestinations.find((tripDestination) => tripDestination.name === evt.target.value);

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

  static parsePointToState(tripPoint) {
    return {...tripPoint};
  }

  static parseStateToPoint(state) {
    return state;
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
