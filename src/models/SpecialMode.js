export class SpecialMode {
    constructor() {
      if (this.constructor === SpecialMode) {
        throw new Error("Abstract class cannot be instantiated");
      }
      this.active = false;
    }
  
    activate() {
      this.active = true;
    }
  
    deactivate() {
      this.active = false;
    }
  
    calculateDamage(baseDamage, isWinner, context) {
      throw new Error("Must implement calculateDamage");
    }
  }