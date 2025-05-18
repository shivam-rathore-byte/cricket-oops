export class Player {
    constructor(name, type = 'human') {
      if (new.target === Player) {
        throw new Error("Cannot instantiate abstract Player class");
      }
      
      this.name = name;
      this.type = type;
      this.health = 100;
      this.hand = [];
      this.specialMode = null;
      this.hasUsedSpecial = false;
    }
  
    receiveCards(cards) {
      this.hand = cards;
    }
  
    selectCard(index) {
      if (index < 0 || index >= this.hand.length) {
        throw new Error("Invalid card index");
      }
      return this.hand.splice(index, 1)[0];
    }
  
    makeMove() {
      throw new Error("makeMove() must be implemented");
    }
  
    setSpecialMode(mode) {
      this.specialMode = mode;
    }
  }