import { SpecialMode } from './SpecialMode.js';

export class FreeHitMode extends SpecialMode {
  constructor() {
    super();
    this.name = 'Free Hit Mode';
  }

  calculateDamage(baseDamage, isWinner) {
    return isWinner ? 12.5 : -15;
  }
}