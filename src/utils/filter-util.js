import { isDateAfter, isDateBefore, isSameDate, compareDates } from './point.js';
import { FilterType } from '../const.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points.sort((a, b) => compareDates(a.dateFrom, b.dateFrom)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isDateAfter(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isDateBefore(point.dateFrom) || isSameDate(point.dateFrom) && isDateAfter(point.dateTo) || isSameDate(point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isDateBefore(point.dateTo)),
};

export { filter };
