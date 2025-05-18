import { SpecialMode } from './SpecialMode.js';

export class SuperMode extends SpecialMode {
  constructor() {
    super();
    this.name = 'Super Mode';
  }

  calculateDamage(baseDamage, isWinner, context) {
    if (!this.active) return baseDamage;
    
    const playerCards = context.player.hand;
    const maxRuns = Math.max(...playerCards.map(c => c.getAttribute('runs')));
    const maxWickets = Math.max(...playerCards.map(c => c.getAttribute('wickets')));
    
    const hasMaxRuns = context.playedCard.getAttribute('runs') === maxRuns;
    const hasMaxWickets = context.playedCard.getAttribute('wickets') === maxWickets;
    
    return (hasMaxRuns && hasMaxWickets) ? 25 : baseDamage;
  }
}