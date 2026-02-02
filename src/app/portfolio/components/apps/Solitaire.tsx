'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type CardValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

type Card = {
  suit: Suit;
  value: CardValue;
  faceUp: boolean;
  id: string;
};

type GameState = {
  stock: Card[];
  waste: Card[];
  foundations: Card[][]; // 4 piles (hearts, diamonds, clubs, spades)
  tableau: Card[][]; // 7 piles
  selectedCards: { pile: string; index: number; cards: Card[] } | null;
};

type DragState = {
  cards: Card[];
  sourcePile: string;
  sourceIndex: number;
  offset: { x: number; y: number };
  position: { x: number; y: number };
} | null;

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};
const SUIT_COLORS: Record<Suit, string> = {
  hearts: '#FF0000',
  diamonds: '#FF0000',
  clubs: '#000000',
  spades: '#000000',
};
const VALUE_DISPLAY: Record<CardValue, string> = {
  1: 'A',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: 'J',
  12: 'Q',
  13: 'K',
};

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let value = 1; value <= 13; value++) {
      deck.push({
        suit,
        value: value as CardValue,
        faceUp: false,
        id: `${suit}-${value}`,
      });
    }
  }
  return deck;
}

function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function isRed(suit: Suit): boolean {
  return suit === 'hearts' || suit === 'diamonds';
}

function canStackOnTableau(bottomCard: Card | undefined, topCard: Card): boolean {
  if (!bottomCard) return topCard.value === 13; // Kings on empty
  return (
    isRed(bottomCard.suit) !== isRed(topCard.suit) &&
    bottomCard.value === topCard.value + 1
  );
}

function canStackOnFoundation(pile: Card[], card: Card): boolean {
  if (pile.length === 0) return card.value === 1; // Aces start foundations
  const topCard = pile[pile.length - 1];
  return topCard.suit === card.suit && topCard.value === card.value - 1;
}

export default function Solitaire() {
  const [gameState, setGameState] = useState<GameState>(() => initGame());
  const [gameWon, setGameWon] = useState(false);
  const [dragState, setDragState] = useState<DragState>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function initGame(): GameState {
    const deck = shuffleDeck(createDeck());
    const tableau: Card[][] = [];
    let cardIndex = 0;

    // Deal tableau (7 piles, increasing cards)
    for (let pile = 0; pile < 7; pile++) {
      tableau[pile] = [];
      for (let card = 0; card <= pile; card++) {
        const c = { ...deck[cardIndex], faceUp: card === pile };
        tableau[pile].push(c);
        cardIndex++;
      }
    }

    // Remaining cards go to stock
    const stock = deck.slice(cardIndex).map((c) => ({ ...c, faceUp: false }));

    return {
      stock,
      waste: [],
      foundations: [[], [], [], []],
      tableau,
      selectedCards: null,
    };
  }

  const newGame = useCallback(() => {
    setGameState(initGame());
    setGameWon(false);
  }, []);

  // Check for win
  useEffect(() => {
    const totalFoundationCards = gameState.foundations.reduce(
      (sum, pile) => sum + pile.length,
      0
    );
    if (totalFoundationCards === 52) {
      setGameWon(true);
    }
  }, [gameState.foundations]);

  const drawFromStock = () => {
    setGameState((prev) => {
      if (prev.stock.length === 0) {
        // Reset stock from waste
        return {
          ...prev,
          stock: prev.waste.reverse().map((c) => ({ ...c, faceUp: false })),
          waste: [],
        };
      }

      // Draw 3 cards (or remaining)
      const drawCount = Math.min(3, prev.stock.length);
      const newStock = prev.stock.slice(0, -drawCount);
      const drawnCards = prev.stock.slice(-drawCount).map((c) => ({ ...c, faceUp: true }));

      return {
        ...prev,
        stock: newStock,
        waste: [...prev.waste, ...drawnCards],
      };
    });
  };

  const selectCard = (pile: string, index: number, cards: Card[]) => {
    setGameState((prev) => ({
      ...prev,
      selectedCards: { pile, index, cards },
    }));
  };

  const tryMoveToFoundation = (card: Card, sourceInfo: { pile: string; index: number }) => {
    setGameState((prev) => {
      // Find which foundation this card can go to
      const foundationIndex = SUITS.indexOf(card.suit);
      const foundation = prev.foundations[foundationIndex];

      if (!canStackOnFoundation(foundation, card)) {
        return { ...prev, selectedCards: null };
      }

      const newState = { ...prev, selectedCards: null };
      newState.foundations = prev.foundations.map((f, i) =>
        i === foundationIndex ? [...f, { ...card, faceUp: true }] : [...f]
      );

      // Remove from source
      if (sourceInfo.pile === 'waste') {
        newState.waste = prev.waste.slice(0, -1);
      } else if (sourceInfo.pile.startsWith('tableau')) {
        const pileIndex = parseInt(sourceInfo.pile.replace('tableau', ''));
        newState.tableau = prev.tableau.map((pile, i) => {
          if (i !== pileIndex) return [...pile];
          const newPile = pile.slice(0, -1);
          if (newPile.length > 0 && !newPile[newPile.length - 1].faceUp) {
            newPile[newPile.length - 1] = { ...newPile[newPile.length - 1], faceUp: true };
          }
          return newPile;
        });
      }

      return newState;
    });
  };

  const handleTableauClick = (pileIndex: number) => {
    setGameState((prev) => {
      const { selectedCards, tableau } = prev;

      if (!selectedCards) return prev;

      const targetPile = tableau[pileIndex];
      const topCard = targetPile[targetPile.length - 1];

      // Check if move is valid
      if (!canStackOnTableau(topCard, selectedCards.cards[0])) {
        return { ...prev, selectedCards: null };
      }

      const newState = { ...prev, selectedCards: null };

      // Add cards to target pile
      newState.tableau = tableau.map((pile, i) => {
        if (i === pileIndex) {
          return [...pile, ...selectedCards.cards.map((c) => ({ ...c, faceUp: true }))];
        }
        return [...pile];
      });

      // Remove from source
      if (selectedCards.pile === 'waste') {
        newState.waste = prev.waste.slice(0, -1);
      } else if (selectedCards.pile.startsWith('tableau')) {
        const sourcePileIndex = parseInt(selectedCards.pile.replace('tableau', ''));
        newState.tableau = newState.tableau.map((pile, i) => {
          if (i !== sourcePileIndex) return pile;
          const newPile = pile.slice(0, selectedCards.index);
          if (newPile.length > 0 && !newPile[newPile.length - 1].faceUp) {
            newPile[newPile.length - 1] = { ...newPile[newPile.length - 1], faceUp: true };
          }
          return newPile;
        });
      }

      return newState;
    });
  };

  const handleFoundationClick = (foundationIndex: number) => {
    setGameState((prev) => {
      const { selectedCards } = prev;
      if (!selectedCards || selectedCards.cards.length !== 1) {
        return { ...prev, selectedCards: null };
      }

      const card = selectedCards.cards[0];
      const foundation = prev.foundations[foundationIndex];

      if (card.suit !== SUITS[foundationIndex] || !canStackOnFoundation(foundation, card)) {
        return { ...prev, selectedCards: null };
      }

      const newState = { ...prev, selectedCards: null };
      newState.foundations = prev.foundations.map((f, i) =>
        i === foundationIndex ? [...f, { ...card, faceUp: true }] : [...f]
      );

      // Remove from source
      if (selectedCards.pile === 'waste') {
        newState.waste = prev.waste.slice(0, -1);
      } else if (selectedCards.pile.startsWith('tableau')) {
        const pileIndex = parseInt(selectedCards.pile.replace('tableau', ''));
        newState.tableau = prev.tableau.map((pile, i) => {
          if (i !== pileIndex) return [...pile];
          const newPile = pile.slice(0, -1);
          if (newPile.length > 0 && !newPile[newPile.length - 1].faceUp) {
            newPile[newPile.length - 1] = { ...newPile[newPile.length - 1], faceUp: true };
          }
          return newPile;
        });
      }

      return newState;
    });
  };

  // Drag handlers
  const getClientPos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if ('touches' in e && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    if ('clientX' in e) {
      return { x: e.clientX, y: e.clientY };
    }
    return { x: 0, y: 0 };
  };

  const handleDragStart = (
    e: React.MouseEvent | React.TouchEvent,
    cards: Card[],
    sourcePile: string,
    sourceIndex: number
  ) => {
    e.preventDefault();
    const pos = getClientPos(e);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragState({
      cards,
      sourcePile,
      sourceIndex,
      offset: { x: pos.x - rect.left, y: pos.y - rect.top },
      position: { x: pos.x, y: pos.y },
    });
  };

  useEffect(() => {
    if (!dragState) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const pos = getClientPos(e);
      setDragState(prev => prev ? { ...prev, position: pos } : null);
    };

    const handleEnd = (e: MouseEvent | TouchEvent) => {
      if (!dragState || !containerRef.current) {
        setDragState(null);
        return;
      }

      const pos = getClientPos(e);
      const elements = document.elementsFromPoint(pos.x, pos.y);

      // Check if dropped on a valid target
      for (const el of elements) {
        const dropTarget = el.getAttribute('data-drop-target');
        if (dropTarget) {
          if (dropTarget.startsWith('tableau')) {
            const pileIndex = parseInt(dropTarget.replace('tableau', ''));
            // Try to move cards
            const targetPile = gameState.tableau[pileIndex];
            const topCard = targetPile[targetPile.length - 1];
            if (canStackOnTableau(topCard, dragState.cards[0])) {
              setGameState(prev => {
                const newState = { ...prev, selectedCards: null };
                newState.tableau = prev.tableau.map((pile, i) => {
                  if (i === pileIndex) {
                    return [...pile, ...dragState.cards.map(c => ({ ...c, faceUp: true }))];
                  }
                  return [...pile];
                });
                // Remove from source
                if (dragState.sourcePile === 'waste') {
                  newState.waste = prev.waste.slice(0, -1);
                } else if (dragState.sourcePile.startsWith('tableau')) {
                  const srcIdx = parseInt(dragState.sourcePile.replace('tableau', ''));
                  newState.tableau = newState.tableau.map((pile, i) => {
                    if (i !== srcIdx) return pile;
                    const newPile = prev.tableau[srcIdx].slice(0, dragState.sourceIndex);
                    if (newPile.length > 0 && !newPile[newPile.length - 1].faceUp) {
                      newPile[newPile.length - 1] = { ...newPile[newPile.length - 1], faceUp: true };
                    }
                    return newPile;
                  });
                }
                return newState;
              });
              setDragState(null);
              return;
            }
          } else if (dropTarget.startsWith('foundation') && dragState.cards.length === 1) {
            const foundationIndex = parseInt(dropTarget.replace('foundation', ''));
            const card = dragState.cards[0];
            if (card.suit === SUITS[foundationIndex] && canStackOnFoundation(gameState.foundations[foundationIndex], card)) {
              setGameState(prev => {
                const newState = { ...prev, selectedCards: null };
                newState.foundations = prev.foundations.map((f, i) =>
                  i === foundationIndex ? [...f, { ...card, faceUp: true }] : [...f]
                );
                // Remove from source
                if (dragState.sourcePile === 'waste') {
                  newState.waste = prev.waste.slice(0, -1);
                } else if (dragState.sourcePile.startsWith('tableau')) {
                  const srcIdx = parseInt(dragState.sourcePile.replace('tableau', ''));
                  newState.tableau = prev.tableau.map((pile, i) => {
                    if (i !== srcIdx) return [...pile];
                    const newPile = pile.slice(0, -1);
                    if (newPile.length > 0 && !newPile[newPile.length - 1].faceUp) {
                      newPile[newPile.length - 1] = { ...newPile[newPile.length - 1], faceUp: true };
                    }
                    return newPile;
                  });
                } else if (dragState.sourcePile.startsWith('foundation')) {
                  // Moving from foundation to foundation (uncommon but valid)
                  const srcIdx = parseInt(dragState.sourcePile.replace('foundation', ''));
                  if (srcIdx !== foundationIndex) {
                    newState.foundations = newState.foundations.map((f, i) =>
                      i === srcIdx ? f.slice(0, -1) : f
                    );
                  }
                }
                return newState;
              });
              setDragState(null);
              return;
            }
          }
        }
      }
      setDragState(null);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [dragState, gameState]);

  const cardWidth = 50;
  const cardHeight = 70;

  const CardComponent = ({
    card,
    onClick,
    onDragStart,
    isSelected,
    isDragging,
    style,
  }: {
    card: Card | null;
    onClick?: () => void;
    onDragStart?: (e: React.MouseEvent | React.TouchEvent) => void;
    isSelected?: boolean;
    isDragging?: boolean;
    style?: React.CSSProperties;
  }) => {
    if (!card) {
      return (
        <div
          onClick={onClick}
          style={{
            width: cardWidth,
            height: cardHeight,
            border: '1px dashed #808080',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            cursor: onClick ? 'pointer' : 'default',
            ...style,
          }}
        />
      );
    }

    if (!card.faceUp) {
      // Artistic card back design - soft pastel with geometric pattern
      return (
        <div
          onClick={onClick}
          style={{
            width: cardWidth,
            height: cardHeight,
            backgroundColor: '#5761FF', // Pastel periwinkle blue
            border: '2px solid #FFFFFF',
            borderRadius: '4px',
            cursor: onClick ? 'pointer' : 'default',
            position: 'relative',
            overflow: 'hidden',
            ...style,
          }}
        >
          {/* Inner border */}
          <div style={{
            position: 'absolute',
            inset: '3px',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: '2px',
          }} />
          {/* Diamond/cross-hatch pattern */}
          <div style={{
            position: 'absolute',
            inset: '5px',
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 3px,
                rgba(255,255,255,0.15) 3px,
                rgba(255,255,255,0.15) 4px
              ),
              repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 3px,
                rgba(255,255,255,0.15) 3px,
                rgba(255,255,255,0.15) 4px
              )
            `,
          }} />
          {/* Center S_ logo */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: 'monospace',
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'rgba(255,255,255,0.8)',
            textShadow: '1px 1px 0 rgba(0,0,0,0.3)',
          }}>
            S_
          </div>
          {/* Corner decorations */}
          <div style={{
            position: 'absolute',
            top: '6px',
            left: '6px',
            width: '6px',
            height: '6px',
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: '1px',
          }} />
          <div style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '6px',
            height: '6px',
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: '1px',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '6px',
            left: '6px',
            width: '6px',
            height: '6px',
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: '1px',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '6px',
            right: '6px',
            width: '6px',
            height: '6px',
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: '1px',
          }} />
        </div>
      );
    }

    return (
      <div
        onClick={onClick}
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
        style={{
          width: cardWidth,
          height: cardHeight,
          backgroundColor: '#FFFFFF',
          border: isSelected ? '2px solid #0000FF' : '1px solid #000000',
          borderRadius: '4px',
          padding: '2px',
          cursor: onDragStart ? 'grab' : (onClick ? 'pointer' : 'default'),
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Georgia, serif',
          boxShadow: isDragging ? '0 8px 16px rgba(0,0,0,0.4)' : (isSelected ? '0 0 5px #0000FF' : '1px 1px 2px rgba(0,0,0,0.3)'),
          opacity: isDragging ? 0.9 : 1,
          transform: isDragging ? 'rotate(2deg)' : 'none',
          transition: isDragging ? 'none' : 'box-shadow 0.15s ease',
          touchAction: 'none',
          ...style,
        }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: SUIT_COLORS[card.suit],
          }}
        >
          {VALUE_DISPLAY[card.value]}
          {SUIT_SYMBOLS[card.suit]}
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: SUIT_COLORS[card.suit],
          }}
        >
          {SUIT_SYMBOLS[card.suit]}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#008000',
        padding: '10px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {gameWon && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#FFFFFF',
            padding: '20px',
            border: '3px solid #000080',
            textAlign: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              fontFamily: '"MS Sans Serif", Arial, sans-serif',
              fontSize: '18px',
              marginBottom: '10px',
            }}
          >
            You Win!
          </div>
          <button
            onClick={newGame}
            style={{
              padding: '8px 16px',
              backgroundColor: '#C0C0C0',
              border: '1px solid #000000',
              cursor: 'pointer',
              fontFamily: '"MS Sans Serif", Arial, sans-serif',
            }}
          >
            New Game
          </button>
        </div>
      )}

      {/* Top row: Stock, Waste, Foundations */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
        }}
      >
        {/* Stock */}
        <div onClick={drawFromStock} style={{ cursor: 'pointer' }}>
          {gameState.stock.length > 0 ? (
            <CardComponent card={{ ...gameState.stock[0], faceUp: false }} />
          ) : (
            <div
              style={{
                width: cardWidth,
                height: cardHeight,
                border: '2px solid #FFFFFF',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '20px',
              }}
            >
              ↻
            </div>
          )}
        </div>

        {/* Waste */}
        <div style={{ position: 'relative', width: cardWidth }}>
          {gameState.waste.length > 0 ? (
            <CardComponent
              card={gameState.waste[gameState.waste.length - 1]}
              onClick={() => {
                const card = gameState.waste[gameState.waste.length - 1];
                selectCard('waste', gameState.waste.length - 1, [card]);
              }}
              onDragStart={(e) => {
                const card = gameState.waste[gameState.waste.length - 1];
                handleDragStart(e, [card], 'waste', gameState.waste.length - 1);
              }}
              isSelected={gameState.selectedCards?.pile === 'waste'}
            />
          ) : (
            <CardComponent card={null} />
          )}
        </div>

        <div style={{ width: '20px' }} />

        {/* Foundations */}
        {gameState.foundations.map((pile, index) => (
          <div
            key={`foundation-${index}`}
            data-drop-target={`foundation${index}`}
            onClick={() => handleFoundationClick(index)}
            style={{ cursor: 'pointer' }}
          >
            {pile.length > 0 ? (
              <CardComponent
                card={pile[pile.length - 1]}
                onDragStart={(e) => handleDragStart(e, [pile[pile.length - 1]], `foundation${index}`, pile.length - 1)}
              />
            ) : (
              <div
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  border: '2px solid #FFFFFF',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '20px',
                  opacity: 0.5,
                }}
              >
                {SUIT_SYMBOLS[SUITS[index]]}
              </div>
            )}
          </div>
        ))}

        {/* New Game button - FLAT 1985 style */}
        <button
          onClick={newGame}
          style={{
            marginLeft: 'auto',
            padding: '4px 12px',
            backgroundColor: '#C0C0C0',
            border: '1px solid #000000',
            cursor: 'pointer',
            fontFamily: '"MS Sans Serif", Arial, sans-serif',
            fontSize: '11px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span style={{ fontSize: '14px' }}>🃏</span>
          New Game
        </button>
      </div>

      {/* Tableau */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
        }}
      >
        {gameState.tableau.map((pile, pileIndex) => (
          <div
            key={`tableau-${pileIndex}`}
            data-drop-target={`tableau${pileIndex}`}
            style={{
              position: 'relative',
              minHeight: cardHeight + 150,
              width: cardWidth,
            }}
            onClick={() => {
              if (pile.length === 0 && gameState.selectedCards) {
                handleTableauClick(pileIndex);
              }
            }}
          >
            {pile.length === 0 ? (
              <CardComponent card={null} onClick={() => handleTableauClick(pileIndex)} />
            ) : (
              pile.map((card, cardIndex) => {
                const isTopCard = cardIndex === pile.length - 1;
                const isSelected =
                  gameState.selectedCards?.pile === `tableau${pileIndex}` &&
                  cardIndex >= gameState.selectedCards.index;
                const isDragging = dragState?.sourcePile === `tableau${pileIndex}` && cardIndex >= dragState.sourceIndex;

                return (
                  <div
                    key={card.id}
                    style={{
                      position: 'absolute',
                      top: cardIndex * 20,
                      zIndex: cardIndex,
                      opacity: isDragging ? 0.3 : 1,
                    }}
                  >
                    <CardComponent
                      card={card}
                      isSelected={isSelected}
                      onClick={
                        card.faceUp
                          ? () => {
                              if (gameState.selectedCards) {
                                if (isTopCard) {
                                  handleTableauClick(pileIndex);
                                }
                              } else {
                                // Select this card and all cards below it
                                const cardsToSelect = pile.slice(cardIndex);
                                selectCard(`tableau${pileIndex}`, cardIndex, cardsToSelect);
                              }
                            }
                          : undefined
                      }
                      onDragStart={
                        card.faceUp
                          ? (e) => handleDragStart(e, pile.slice(cardIndex), `tableau${pileIndex}`, cardIndex)
                          : undefined
                      }
                    />
                  </div>
                );
              })
            )}
          </div>
        ))}
      </div>

      {/* Help text */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          fontFamily: '"MS Sans Serif", Arial, sans-serif',
          fontSize: '10px',
          color: '#FFFFFF',
          opacity: 0.7,
        }}
      >
        Drag cards or click to select
      </div>

      {/* Floating dragged cards */}
      {dragState && (
        <div
          style={{
            position: 'fixed',
            left: dragState.position.x - dragState.offset.x,
            top: dragState.position.y - dragState.offset.y,
            zIndex: 1000,
            pointerEvents: 'none',
          }}
        >
          {dragState.cards.map((card, index) => (
            <div
              key={card.id}
              style={{
                position: 'absolute',
                top: index * 20,
              }}
            >
              <CardComponent card={card} isDragging />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
