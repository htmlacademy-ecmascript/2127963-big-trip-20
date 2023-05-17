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

const getDuration = (dateFrom, dateTo) => {
  const timeDifference = dayjs(dateTo).diff(dayjs(dateFrom));
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

const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const getLastWord = (expression) => {
  const words = expression.trim().split(' ');
  const word = words[words.length - 1];
  return word;

};

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

export { getRandomInteger, getRandomArrayElement, getLastWord, humanizeDate, humanizeFullDate, humanizeTime, getDuration, updateItem };
