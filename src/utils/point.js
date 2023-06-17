import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const TimeFormat = {
  DAYS: 'DD[D] HH[H] mm[M]',
  HOURS: 'HH[H] mm[M]',
  MINUTES: 'mm[M]'
};

const DateFormat = {
  MD: 'MMM D',
  DDMMYYHHMM: 'DD/MM/YY HH:mm'
};

const TIME_FORMAT = 'HH:mm';
const MSEC_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

const MSEC_IN_HOUR = MSEC_IN_SEC * SEC_IN_MIN * MIN_IN_HOUR;
const MSEC_IN_DAY = HOURS_IN_DAY * MSEC_IN_HOUR;

const humanizeDate = (date) => date ? dayjs(date).format(DateFormat.MD) : '';
const humanizeFullDate = (date) => date ? dayjs(date).format(DateFormat.DDMMYYHHMM) : '';
const humanizeTime = (date) => date ? dayjs(date).format(TIME_FORMAT) : '';

const getTimeDifference = (dateFrom, dateTo) => dayjs(dateTo).diff(dayjs(dateFrom));

const getDuration = (dateFrom, dateTo) => {
  const timeDifference = getTimeDifference(dateFrom,dateTo);
  let pointDuration = 0;

  switch (true) {
    case (timeDifference >= MSEC_IN_DAY):
      pointDuration = dayjs.duration(timeDifference).format(TimeFormat.DAYS);
      break;
    case (timeDifference >= MSEC_IN_HOUR):
      pointDuration = dayjs.duration(timeDifference).format(TimeFormat.HOURS);
      break;
    case (timeDifference < MSEC_IN_HOUR):
      pointDuration = dayjs.duration(timeDifference).format(TimeFormat.MINUTES);
      break;
  }

  return pointDuration;
};

const isDateInPast = (date) => dayjs().isAfter(date, 'D');

const isDateInFUture = (date) => dayjs().isBefore(date, 'D');

const isSameDate = (date) => dayjs(date).isSame(dayjs(), 'D');

const compareDates = (dateA, dateB) => dayjs(dateB).unix() - dayjs(dateA).unix();


const compareDuration = (pointA, pointB) => {
  const durationA = getTimeDifference(pointA.dateFrom, pointA.dateTo);
  const durationB = getTimeDifference(pointB.dateFrom, pointB.dateTo);
  return durationB - durationA;
};

const areDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

const comparePrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const getDestinationById = (point, destinations) => destinations.find((destination) => destination.id === point.destination);

const getOffersByType = (point, offers) => {
  const offersByType = offers.find((offer) => offer.type === point.type);
  return offersByType?.offers;
};

const renderDestionationList = (destinations) => {
  let renderedDestinations = '';

  destinations.forEach((destination) => {
    const renderedDestination = `<option value="${destination.name}"></option>`;
    renderedDestinations += renderedDestination;
  });

  return renderedDestinations;
};


export { comparePrice, compareDuration, humanizeDate, humanizeFullDate, humanizeTime, getDuration, getTimeDifference, isDateInPast, isDateInFUture, isSameDate, compareDates, areDatesEqual, getDestinationById, getOffersByType, renderDestionationList };
