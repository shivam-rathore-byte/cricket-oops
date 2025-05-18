import { SpecialMode } from './SpecialMode.js';

export class WorldCupMode extends SpecialMode {
  constructor() {
    super();
    this.name = 'World Cup Mode';
  }

  calculateDamage(baseDamage, isWinner, context) {
    return context.isFinalCard ? baseDamage * 2 : baseDamage;
  }
}