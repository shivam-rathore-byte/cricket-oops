import { CardFactory } from './CardFactory.js';
import { AttributeComparator } from './AttributeComparator.js';

export class GameManager {
  constructor() {
    this.players = [];
    this.currentPlayerIndex = 0;
    this.comparator = new AttributeComparator();
    this.isFinalCard = false;
  }

  initializeGame(players, playerData) {
    const deck = CardFactory.createDeck(playerData);
    this.shuffleDeck(deck);
    
    players.forEach(player => {
      player.receiveCards(deck.splice(0, 10));
    });
    
    this.players = players;
    this.checkFinalCard();
  }

  shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  async playTurn(move) {
    const currentPlayer = this.players[this.currentPlayerIndex];
    const opponent = this.players[1 - this.currentPlayerIndex];
    
    const playerCard = currentPlayer.selectCard(move.cardIndexA);
    const opponentCard = opponent.selectCard(move.cardIndexB);
    // const opponentCard = opponent.selectCard(this.getOpponentCardIndex(opponent));
    
    const result = this.compareCards(playerCard, opponentCard, move.attribute);
    this.applyDamage(result, currentPlayer, opponent);
    
    this.checkFinalCard();
    this.currentPlayerIndex = 1 - this.currentPlayerIndex;
    
    return result;
  }

  compareCards(cardA, cardB, attribute) {
    const result = this.comparator.compare(attribute, cardA, cardB);
    return {
      winner: result,
      attribute,
      cardA: cardA.displayInfo(),
      cardB: cardB.displayInfo()
    };
  }

  applyDamage(result, currentPlayer, opponent) {
    let damage = 10;
    const context = {
      player: currentPlayer,
      isSpecialActive: currentPlayer.specialMode?.active,
      isFinalCard: this.isFinalCard
    };
  
    if (context.isSpecialActive) {
      damage = currentPlayer.specialMode.calculateDamage(
        damage,
        result.winner === 0,
        context
      );
      currentPlayer.specialMode.deactivate();
    }

    if (result.winner === 0) {
      opponent.health = Math.max(0, opponent.health - damage);
    } else {
      currentPlayer.health = Math.max(0, currentPlayer.health - Math.abs(damage));
    }
  }

  checkFinalCard() {
    this.isFinalCard = this.players.every(p => p.hand.length === 1);
  }

  getOpponentCardIndex(opponent) {
    return opponent.type === 'human' 
      ? 0 // For human, we'll need UI selection
      : Math.floor(Math.random() * opponent.hand.length);
  }

  checkGameOver() {
    return this.players.some(p => p.health <= 0) || 
      this.players.every(p => p.hand.length === 0);
  }
}