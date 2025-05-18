export class AttributeComparator {
    constructor() {
      this.strategies = new Map();
      this.registerDefaultStrategies();
    }
  
    registerDefaultStrategies() {
      this.addStrategy('default', (a, b) => a > b ? 0 : 1);
      this.addStrategy('reverse', (a, b) => a < b ? 0 : 1);
    }
  
    addStrategy(name, comparator) {
      this.strategies.set(name, comparator);
    }
  
    compare(attribute, cardA, cardB, strategy = 'default') {
      const comparator = this.strategies.get(strategy) || this.strategies.get('default');
      return comparator(cardA.getAttribute(attribute), cardB.getAttribute(attribute));
    }
  }