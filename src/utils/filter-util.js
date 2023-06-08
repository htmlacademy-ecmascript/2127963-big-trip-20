import { isDateInPast, isDateInFUture, isSameDate, compareDates } from './point.js';
import { FilterType } from '../const.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points.sort((a, b) => compareDates(a.dateFrom, b.dateFrom)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isDateInFUture(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => (isDateInPast(point.dateFrom) || isSameDate(point.dateFrom)) && (isDateInFUture(point.dateTo) || isSameDate(point.dateTo))),
  [FilterType.PAST]: (points) => points.filter((point) => isDateInPast(point.dateTo)),
};

export { filter };
