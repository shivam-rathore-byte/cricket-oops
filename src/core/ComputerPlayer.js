import { Player } from './Player.js';

export class ComputerPlayer extends Player {
  constructor(name) {
    super(name, 'computer');
  }

  makeMove() {
    const cardIndex = Math.floor(Math.random() * this.hand.length);
    const attributes = Object.keys(this.hand[0].attributes);
    const attribute = attributes[Math.floor(Math.random() * attributes.length)];
    
    return Promise.resolve({ cardIndex, attribute });
  }
}