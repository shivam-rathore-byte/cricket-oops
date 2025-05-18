import { Player } from './Player.js';

export class HumanPlayer extends Player {
  constructor(name) {
    super(name, 'human');
    this.selectedCardIndex = null;
    this.selectedAttribute = null;
  }

  makeMove() {
    return new Promise((resolve) => {
      const handler = () => {
        if (this.selectedCardIndex !== null && this.selectedAttribute) {
          document.removeEventListener('card-selected', handler);
          resolve({
            cardIndex: this.selectedCardIndex,
            attribute: this.selectedAttribute
          });
        }
      };
      
      document.addEventListener('card-selected', handler);
    });
  }
}