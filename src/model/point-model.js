import { getRandomMockPoint } from '../mock/mock-data.js';

const POINTS_NUMBER = 3;

export default class PointModel {
  points = Array.from({length: POINTS_NUMBER}, getRandomMockPoint);

  getPoints() {
    return this.points;
  }
}
