export class CricketCard {
    constructor(name, attributes) {
      this.name = name;
      this.attributes = attributes;
    }
  
    getAttribute(attribute) {
      return this.attributes[attribute];
    }
  
    displayInfo() {
      return {
        name: this.name,
        ...this.attributes
      };
    }
  }