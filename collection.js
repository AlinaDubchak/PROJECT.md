'use strict';

const collection = new Map();
collection.set('ArrowLeft', function() {
  activePiece.x -= 1;
  if (hasCollisions()) {
    activePiece.x += 1;
  }
}
);
collection.set('ArrowRight', function() {
  activePiece.x += 1;
  if (hasCollisions()) {
    activePiece.x -= 1;
  }
});
collection.set('ArrowDown', moveDown);
collection.set('ArrowUp', spinPiece);
collection.set('ShiftRight', dropPiece);
collection.set('Enter', enterKey);
collection.set('Space', pauseKey);
