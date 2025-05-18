import { SpecialMode } from './SpecialMode.js';

export class PowerPlayMode extends SpecialMode {
  constructor() {
    super();
    this.name = 'Power Play Mode';
    this.secondAttribute = null;
  }

  setSecondAttribute(attribute) {
    this.secondAttribute = attribute;
  }

  calculateDamage(baseDamage) {
    return 10; // Fixed damage
  }
}