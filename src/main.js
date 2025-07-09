import { GameManager } from './core/GameManager.js';
import { HumanPlayer } from './core/HumanPlayer.js';
import { ComputerPlayer } from './core/ComputerPlayer.js';
import { playersData } from './data/players.js';
import { FreeHitMode } from './models/FreeHitMode.js';
import { SuperMode } from './models/SuperMode.js';
import { PowerPlayMode } from './models/PowerPlayMode.js';
import { WorldCupMode } from './models/WorldCupMode.js';

class GameUI {


    constructor() {
        this.gameManager = new GameManager();
        this.players = [
          new HumanPlayer('Player 1'),
          new HumanPlayer('Player 2')
        ];
        
        // Store references to DOM elements
        this.player1Hand = document.querySelector('#player1 .hand');
        this.player2Hand = document.querySelector('#player2 .hand');
        this.attributeSelector = document.getElementById('attribute-selector');
        this.playButton = document.getElementById('play-card');

        this.modeContainer = document.getElementById('mode-selector');
        this.startButton = null;
        this.selectedIndex = [null, null];
        //this.initGame();

        this.setupModeSelector();
        this.enableControls(false);
        this.addSpecialModeControls();
      }

      startGame() {
        // Read selected modes
        const m1 = document.getElementById('player1-mode').value;
        const m2 = document.getElementById('player2-mode').value;
    
        // Map label to class instance
        const modeMap = {
          FreeHit: FreeHitMode,
          Super: SuperMode,
          PowerPlay: PowerPlayMode,
          WorldCup: WorldCupMode
        };
    
        this.players[0].setSpecialMode(new (modeMap[m1])());
        this.players[1].setSpecialMode(new (modeMap[m2])());
        // Disable mode selectors
        this.enableControls(true);
        this.initGame();
      }
    
      async initGame() {
        // this.players[0].setSpecialMode(new FreeHitMode());
        // this.players[1].setSpecialMode(new SuperMode());
        
        this.gameManager.initializeGame(this.players, playersData);
        this.renderHands();
        this.updateHealth();
        this.setupAttributeSelector();
        //this.enableControls();
        
        // Add event listeners after rendering
        this.setupEventListeners();
        this.hideCard(1-this.gameManager.currentPlayerIndex)
      }

      setupModeSelector() {
        // Create selectors for each player
        const modes = [
          { label: 'FreeHit', class: FreeHitMode },
          { label: 'Super', class: SuperMode },
          { label: 'PowerPlay', class: PowerPlayMode },
          { label: 'WorldCup', class: WorldCupMode }
        ];
    
        const sel1 = document.createElement('select');
        sel1.id = 'player1-mode';
        modes.forEach(mode => {
          const opt = document.createElement('option'); opt.value = mode.label;
          opt.textContent = mode.label;
          sel1.appendChild(opt);
        });
    
        const sel2 = document.createElement('select');
        sel2.id = 'player2-mode';
        modes.forEach(mode => {
          const opt = document.createElement('option'); opt.value = mode.label;
          opt.textContent = mode.label;
          sel2.appendChild(opt);
        });
    
        this.startButton = document.createElement('button');
        this.startButton.textContent = 'Start Game';
        this.startButton.addEventListener('click', () => this.startGame());
    
        this.modeContainer.appendChild(sel1);
        this.modeContainer.appendChild(sel2);
        this.modeContainer.appendChild(this.startButton);
      }
    
      setupEventListeners() {
        // Player 1 selection
        this.player1Hand.addEventListener('click', event => {
          const card = event.target.closest('.card');
          if (!card) return;
          const idx = Array.from(this.player1Hand.children).indexOf(card);
          this.selectCard(0, idx);
        });
    
        // Player 2 selection
        this.player2Hand.addEventListener('click', event => {
          const card = event.target.closest('.card');
          if (!card) return;
          const idx = Array.from(this.player2Hand.children).indexOf(card);
          this.selectCard(1, idx);
        });
    
        this.playButton.addEventListener('click', () => this.handlePlay());
      }
    
      selectCard(playerIdx, cardIdx) {
        // clear previous selection
        const container = playerIdx === 0 ? this.player1Hand : this.player2Hand;
        container.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
    
        // mark new
        const chosen = container.children[cardIdx];
        chosen.classList.add('selected');
        this.selectedIndex[playerIdx] = cardIdx;
        this.updatePlayButtonState();

        if(this.selectedIndex[1-playerIdx]==null){
            setTimeout(()=>{this.hideCard(playerIdx)}, 1000)
        }
       
        
      }
    
      hideCard(turn){
        this.player1Hand.style.display = turn === 1 ? 'flex' : 'none';
        this.player2Hand.style.display = turn === 0 ? 'flex' : 'none';
      }
      updatePlayButtonState() {
        const attr = this.attributeSelector.value;
        const ready = this.selectedIndex[0] != null && this.selectedIndex[1] != null && attr;
        this.playButton.disabled = !ready;
      }
    
      async handlePlay() {
        const attribute = this.attributeSelector.value;
        const result = await this.gameManager.playTurn({
          cardIndexA: this.selectedIndex[this.gameManager.currentPlayerIndex],
          cardIndexB: this.selectedIndex[1-this.gameManager.currentPlayerIndex],
          attribute
        });
    
        this.displayResult(result);
        this.updateSpecialButtons();
        //setTimeout(()=>{this.hideCard(1-this.gameManager.currentPlayerIndex)},1000)
        this.updateGameState();
    
        if (this.gameManager.checkGameOver()) {
          this.handleGameOver();
        }
      }
    
    //   setupEventListeners() {
    //     // Delegated event listener for cards
    //     this.player1Hand.addEventListener('click', (event) => {
    //       const cardElement = event.target.closest('.card');
    //       if (cardElement) {
    //         const index = Array.from(this.player1Hand.children).indexOf(cardElement);
    //         this.handleCardSelection(index);
    //       }
    //     });
    
    //     this.playButton.addEventListener('click', () => this.handlePlayCard());
    //   }
    
      handleCardSelection(index) {
        // Clear all selections first
        document.querySelectorAll('#player1 .card').forEach(card => {
          card.classList.remove('selected');
        });
      
        // Set new selection
        const cards = this.player1Hand.children;
        if (index >= 0 && index < cards.length) {
          cards[index].classList.add('selected');
          this.selectedCardIndex = index;
          this.enablePlayButton();
        }
      }
      
      enablePlayButton() {
        const hasSelection = this.selectedCardIndex !== null;
        const hasAttribute = this.attributeSelector.value !== '';
        this.playButton.disabled = !(hasSelection && hasAttribute);
      }

    // async handlePlayCard() {
    //     const attribute = document.getElementById('attribute-selector').value;
    //     const result = await this.gameManager.playTurn({
    //         cardIndex: this.selectedCardIndex,
    //         attribute
    //     });

    //     this.displayResult(result);
    //     this.updateGameState();

    //     if (this.gameManager.checkGameOver()) {
    //         this.handleGameOver();
    //     } else {
    //         this.handleComputerTurn();
    //     }
    // }

    async handleComputerTurn() {
        if (this.gameManager.currentPlayerIndex === 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const move = await this.players[1].makeMove();
            const result = await this.gameManager.playTurn(move);

            this.displayResult(result);
            this.updateGameState();

            if (this.gameManager.checkGameOver()) {
                this.handleGameOver();
            }
        }
    }

    updateGameState() {
        //this.updateTurnUI();
        this.renderHands();
        this.updateHealth();
        this.setupAttributeSelector();
        this.selectedIndex = [null, null];
        this.updatePlayButtonState();
    }

    updateTurnUI() {
        const turn = this.gameManager.currentPlayerIndex;
        // show only current player's hand
        this.player1Hand.style.display = turn === 0 ? 'flex' : 'none';
        this.player2Hand.style.display = turn === 1 ? 'flex' : 'none';
        // clear previous selections
        [this.player1Hand, this.player2Hand].forEach(hand =>
          hand.querySelectorAll('.card').forEach(c => c.classList.remove('selected'))
        );
        this.selectedIndex = [null, null];
        this.updatePlayButtonState();
    }

    renderHands() {
        this.renderPlayerHand(this.players[0], '#player1');
        this.renderPlayerHand(this.players[1], '#player2');
    }

    renderPlayerHand(player, selector) {
        const container = document.querySelector(selector + ' .hand');
        container.innerHTML = '';
        
        player.hand.forEach((card, index) => {
          const cardEl = document.createElement('div');
          cardEl.className = `card ${this.isCardSelected(index, selector) ? 'selected' : ''}`;
          cardEl.innerHTML = `
            <h3>${card.name}</h3>
            ${Object.entries(card.attributes)
              .map(([key, val]) => `<div><strong>${key}:</strong> ${val}</div>`)
              .join('')}
          `;
          container.appendChild(cardEl);
        });
      }
      
    isCardSelected(index, selector) {
    return selector === '#player1' && 
            this.selectedCardIndex === index;
    }
    updateHealth() {
        this.players.forEach((player, index) => {
            const fill = document.querySelector(`#player${index + 1} .health-fill`);
            const text = document.querySelector(`#player${index + 1} .health-text`);
            fill.style.width = `${player.health}%`;
            text.textContent = `${player.health}%`;
        });
    }

    displayResult(result) {
        const resultDiv = document.getElementById('comparison-result');
        resultDiv.innerHTML = `
      <h3>Comparison Result (${result.attribute})</h3>
      <div class="comparison">
        <div class="player-card">
          <h4>${result.cardA.name}</h4>
          <div>${result.attribute}: ${result.cardA[result.attribute]}</div>
        </div>
        <div class="vs">VS</div>
        <div class="player-card">
          <h4>${result.cardB.name}</h4>
          <div>${result.attribute}: ${result.cardB[result.attribute]}</div>
        </div>
      </div>
      <h4>Winner: ${this.getWinner(result.winner) ? 'Player 1' : 'Player 2'}</h4>
    `;
    }

    getWinner(winner){
      if(this.gameManager.currentPlayerIndex == 0){
        return winner == 1;
      }else{
        return winner == 0;
      }
    }

    handleGameOver() {
        const winner = this.players.find(p => p.health > 0);
        const statusDiv = document.getElementById('game-status');
        statusDiv.innerHTML = `<h2>Game Over! Winner: ${winner?.name || 'Draw'}</h2>`;
        document.getElementById('play-card').disabled = true;
    }

    setupAttributeSelector() {
        const selector = document.getElementById('attribute-selector');
        selector.innerHTML = Object.keys(this.players[0].hand[0]?.attributes || {})
            .map(attr => `<option value="${attr}">${attr}</option>`)
            .join('');
    }

    // enableControls() {
    //     document.getElementById('attribute-selector').disabled = false;
    //     document.getElementById('play-card').disabled = false;
    // }
    enableControls(enableGameplay) {
      // If false, only mode selectors & start enabled
      this.startButton.disabled = enableGameplay;
      this.attributeSelector.disabled = !enableGameplay;
      this.playButton.disabled = !enableGameplay;
      document.getElementById('player1-mode').disabled = enableGameplay;
      document.getElementById('player2-mode').disabled = enableGameplay;
    }

    addSpecialModeControls() {
      this.specialButton1 = document.createElement('button');
      this.specialButton1.className = 'special-activate';
      this.specialButton1.textContent = 'Activate Special';
      this.specialButton1.addEventListener('click', () => this.activateSpecial(0));
    
      this.specialButton2 = document.createElement('button');
      this.specialButton2.className = 'special-activate';
      this.specialButton2.textContent = 'Activate Special';
      this.specialButton2.addEventListener('click', () => this.activateSpecial(1));
    
      document.querySelector('#player1').appendChild(this.specialButton1);
      document.querySelector('#player2').appendChild(this.specialButton2);
    }
    
    activateSpecial(playerIndex) {
      if (playerIndex !== this.gameManager.currentPlayerIndex) return;
      
      this.players[playerIndex].activateSpecialMode();
      this.updateSpecialButtons();
      alert(`${this.players[playerIndex].name} activated ${this.players[playerIndex].specialMode.name}!`);
    }
    
    updateSpecialButtons() {
      const currentPlayer = this.gameManager.currentPlayerIndex;
      const otherPlayer = 1 - currentPlayer;
      
      this[`specialButton${currentPlayer + 1}`].style.display = 'block';
      // Current player's button
      this[`specialButton${currentPlayer + 1}`].disabled = 
        this.players[currentPlayer].hasUsedSpecial || 
        !this.players[currentPlayer].specialMode.canActivate(this.players[currentPlayer]);
      
      // Other player's button
      this[`specialButton${otherPlayer + 1}`].style.display = 'none';
    }
}

// Start the game
new GameUI();