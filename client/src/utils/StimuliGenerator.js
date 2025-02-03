export class StimuliGenerator {
  constructor(nBack) {
    this.nBack = nBack;
    this.sequence = [];
    this.soundSequence = [];
    this.lastMatchPosition = -999;
    this.lastMatchSound = -999;
    this.currentRound = 0;
  }

  shouldGenerateMatch() {
    // Don't generate matches before we have enough history
    if (this.currentRound < this.nBack) return false;

    // Don't generate matches too close to each other
    if (
      this.currentRound - this.lastMatchPosition < MIN_MOVES_BETWEEN_MATCHES &&
      this.currentRound - this.lastMatchSound < MIN_MOVES_BETWEEN_MATCHES
    ) {
      return false;
    }

    return Math.random() < MATCH_PROBABILITY;
  }

  generatePosition(forceMatch = false) {
    if (forceMatch && this.currentRound >= this.nBack) {
      // Force a match by using the position from n-back ago
      this.lastMatchPosition = this.currentRound;
      return this.sequence[this.currentRound - this.nBack];
    }

    // Generate a position that's different from n-back ago
    let newPosition;
    do {
      newPosition = Math.floor(Math.random() * 9);
    } while (
      this.currentRound >= this.nBack &&
      newPosition === this.sequence[this.currentRound - this.nBack]
    );

    return newPosition;
  }

  generateSound(forceMatch = false) {
    if (forceMatch && this.currentRound >= this.nBack) {
      // Force a match by using the sound from n-back ago
      this.lastMatchSound = this.currentRound;
      return this.soundSequence[this.currentRound - this.nBack];
    }

    // Generate a sound that's different from n-back ago
    let newSound;
    do {
      newSound = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    } while (
      this.currentRound >= this.nBack &&
      newSound === this.soundSequence[this.currentRound - this.nBack]
    );

    return newSound;
  }

  generateStimuli() {
    const shouldMatch = this.shouldGenerateMatch();

    // Randomly choose between position match, sound match, or both
    const matchType = shouldMatch ? Math.floor(Math.random() * 3) : -1;

    const position =
      matchType === 0 || matchType === 2
        ? this.generatePosition(true)
        : this.generatePosition(false);

    const sound =
      matchType === 1 || matchType === 2
        ? this.generateSound(true)
        : this.generateSound(false);

    // Update sequences
    this.sequence.push(position);
    this.soundSequence.push(sound);
    this.currentRound++;

    return {
      position,
      sound,
      isPositionMatch: matchType === 0 || matchType === 2,
      isSoundMatch: matchType === 1 || matchType === 2,
    };
  }

  // Helper method to get match information for the current state
  getCurrentMatches() {
    if (this.currentRound < this.nBack)
      return { position: false, sound: false };

    return {
      position:
        this.sequence[this.currentRound - 1] ===
        this.sequence[this.currentRound - 1 - this.nBack],
      sound:
        this.soundSequence[this.currentRound - 1] ===
        this.soundSequence[this.currentRound - 1 - this.nBack],
    };
  }
}

// Constants can be exported separately
export const MATCH_PROBABILITY = 0.3;
export const MIN_MOVES_BETWEEN_MATCHES = 1;
export const LETTERS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
];
