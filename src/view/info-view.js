import AbstractView from '../framework/view/abstract-view.js';
import { getDestinationById, getOffersByType } from '../utils/point.js';
import { humanizeDate } from '../utils/point.js';


const createInfoTemplate = (points, destinations, offers) => {
  let totalPrice = 0;

  points.forEach((point) => {
    let price = point.basePrice;
    const availableOffers = getOffersByType(point, offers);
    const checkedOffers = availableOffers?.filter((offer) => point.offers.includes(offer.id));
    checkedOffers?.forEach((checkedOffer) => {
      price += checkedOffer.price;
    });
    totalPrice += price;
  });

  const createDestinationInfoTemplate = () => {
    if (points.length === 0) {
      return '';
    }

    if (points.length > 3) {
      return (
        `<h1 class="trip-info__title">
        ${getDestinationById(points[0], destinations).name} &mdash; ... &mdash; ${getDestinationById(points[points.length - 1], destinations).name}
        </h1>`
      );
    }

    const infoDestinations = [];

    points.forEach((point) => {
      const infoDestination = getDestinationById(point, destinations).name;
      infoDestinations.push(infoDestination);

    });

    return (
      `<h1 class="trip-info__title">
        ${infoDestinations.join(' &mdash; ')}
      </h1>`
    );
  };

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        ${createDestinationInfoTemplate()}

        <p class="trip-info__dates">${humanizeDate(points[0].dateFrom)}&nbsp;&mdash;&nbsp;${humanizeDate(points[points.length - 1].dateTo)}</p>
      </div>

      <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>`
  );
};

export default class InfoView extends AbstractView {
  #points = null;
  #destinations = null;
  #offers = null;

  constructor({points, destinations, offers}) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {

    return createInfoTemplate(this.#points, this.#destinations, this.#offers);
  }
}
