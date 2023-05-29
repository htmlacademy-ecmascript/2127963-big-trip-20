import { getRandomMockPoint } from '../mock/mock-data.js';

const POINTS_NUMBER = 4;

export default class PointModel {
  #points = Array.from({length: POINTS_NUMBER}, getRandomMockPoint);

  get points() {
    return this.#points;
  }
}
