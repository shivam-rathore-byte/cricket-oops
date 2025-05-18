import { CricketCard } from '../models/CricketCard.js';

export class CardFactory {
  static createCard(playerData) {
    return new CricketCard(
      playerData.name,
      { ...playerData.attributes }
    );
  }

  static createDeck(playerDataList) {
    return playerDataList.map(data => this.createCard(data));
  }
}