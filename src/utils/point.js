import { getTimeDifference } from '../utils';

const comparePrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const compareDuration = (pointA, pointB) => {
  const durationA = getTimeDifference(pointA.dateFrom, pointA.dateTo);
  const durationB = getTimeDifference(pointB.dateFrom, pointB.dateTo);
  return durationB - durationA;
};

export { comparePrice, compareDuration };
