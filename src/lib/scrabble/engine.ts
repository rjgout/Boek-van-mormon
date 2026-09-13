import { BOARD_SIZE, CENTER, BOARD_LAYOUT, type Board } from "./board";
import { letterValue, RACK_SIZE } from "./tiles";
import { isValidWord } from "./dictionary";

export interface Placement {
  row: number;
  col: number;
  letter: string; // opgeloste letter (A-Z), ook bij een blanco
  isBlank: boolean;
}

export interface FormedWord {
  word: string;
  score: number;
}

export interface MoveScoreResult {
  score: number;
  words: FormedWord[];
}

export type MoveValidation = { ok: true; result: MoveScoreResult } | { ok: false; error: string };

function isBoardEmpty(board: Board): boolean {
  for (const row of board) for (const cell of row) if (cell !== null) return false;
  return true;
}

function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE;
}

function applyPlacements(board: Board, placements: Placement[]): Board {
  const copy: Board = board.map((row) => row.slice());
  for (const p of placements) {
    copy[p.row][p.col] = { letter: p.letter, isBlank: p.isBlank };
  }
  return copy;
}

interface Span {
  cells: { row: number; col: number }[];
}

/** Loopt vanaf (row,col) terug tot het begin van de aaneengesloten reeks gevulde vakjes, dan door tot het einde. */
function scanSpan(testBoard: Board, row: number, col: number, dr: number, dc: number): Span {
  let sr = row;
  let sc = col;
  while (inBounds(sr - dr, sc - dc) && testBoard[sr - dr][sc - dc] !== null) {
    sr -= dr;
    sc -= dc;
  }
  const cells: { row: number; col: number }[] = [];
  let r = sr;
  let c = sc;
  while (inBounds(r, c) && testBoard[r][c] !== null) {
    cells.push({ row: r, col: c });
    r += dr;
    c += dc;
  }
  return { cells };
}

function scoreSpan(testBoard: Board, span: Span, newCells: Set<string>): FormedWord {
  let word = "";
  let score = 0;
  let wordMultiplier = 1;
  for (const { row, col } of span.cells) {
    const tile = testBoard[row][col]!;
    word += tile.letter.toLowerCase();
    const base = tile.isBlank ? 0 : letterValue(tile.letter);
    const isNew = newCells.has(`${row},${col}`);
    let letterScore = base;
    if (isNew) {
      const squareType = BOARD_LAYOUT[row][col];
      if (squareType === "DL") letterScore *= 2;
      if (squareType === "TL") letterScore *= 3;
      if (squareType === "DW") wordMultiplier *= 2;
      if (squareType === "TW") wordMultiplier *= 3;
    }
    score += letterScore;
  }
  return { word, score: score * wordMultiplier };
}

/**
 * Valideert en scoort één zet (het neerleggen van `placements`, allemaal
 * nieuwe letters op lege vakjes) tegen de huidige bordstand. Geeft bij
 * geldigheid alle gevormde woorden (hoofdwoord + eventuele kruisingen) en
 * de totaalscore terug; anders een foutmelding om aan de speler te tonen.
 */
export function validateAndScoreMove(board: Board, placements: Placement[]): MoveValidation {
  if (placements.length === 0) return { ok: false, error: "Geen letters geplaatst." };
  if (placements.length > RACK_SIZE) return { ok: false, error: "Te veel letters in één beurt." };

  for (const p of placements) {
    if (!inBounds(p.row, p.col)) return { ok: false, error: "Plaatsing buiten het bord." };
    if (board[p.row][p.col] !== null) return { ok: false, error: "Daar ligt al een letter." };
  }
  const cellKeys = placements.map((p) => `${p.row},${p.col}`);
  if (new Set(cellKeys).size !== cellKeys.length) {
    return { ok: false, error: "Dubbele plaatsing op hetzelfde vakje." };
  }

  const firstMove = isBoardEmpty(board);
  if (firstMove && !placements.some((p) => p.row === CENTER && p.col === CENTER)) {
    return { ok: false, error: "De eerste zet moet het middelste vakje bedekken." };
  }

  const rows = new Set(placements.map((p) => p.row));
  const cols = new Set(placements.map((p) => p.col));
  if (placements.length > 1 && rows.size > 1 && cols.size > 1) {
    return { ok: false, error: "Letters moeten op één rij of kolom liggen." };
  }

  const testBoard = applyPlacements(board, placements);
  const newCells = new Set(cellKeys);

  if (placements.length > 1) {
    if (rows.size === 1) {
      const row = [...rows][0];
      const minCol = Math.min(...placements.map((p) => p.col));
      const maxCol = Math.max(...placements.map((p) => p.col));
      for (let c = minCol; c <= maxCol; c++) {
        if (testBoard[row][c] === null) return { ok: false, error: "Er zit een gat in je woord." };
      }
    } else {
      const col = [...cols][0];
      const minRow = Math.min(...placements.map((p) => p.row));
      const maxRow = Math.max(...placements.map((p) => p.row));
      for (let r = minRow; r <= maxRow; r++) {
        if (testBoard[r][col] === null) return { ok: false, error: "Er zit een gat in je woord." };
      }
    }
  }

  const spans: Span[] = [];
  const seenSpanKeys = new Set<string>();
  function addSpanIfWord(row: number, col: number, dr: number, dc: number) {
    const span = scanSpan(testBoard, row, col, dr, dc);
    if (span.cells.length < 2) return;
    const key = span.cells.map((c) => `${c.row},${c.col}`).join(";");
    if (seenSpanKeys.has(key)) return;
    seenSpanKeys.add(key);
    spans.push(span);
  }

  if (placements.length === 1) {
    addSpanIfWord(placements[0].row, placements[0].col, 0, 1);
    addSpanIfWord(placements[0].row, placements[0].col, 1, 0);
  } else if (rows.size === 1) {
    addSpanIfWord(placements[0].row, placements[0].col, 0, 1);
    for (const p of placements) addSpanIfWord(p.row, p.col, 1, 0);
  } else {
    addSpanIfWord(placements[0].row, placements[0].col, 1, 0);
    for (const p of placements) addSpanIfWord(p.row, p.col, 0, 1);
  }

  if (spans.length === 0) {
    return { ok: false, error: "Dit vormt geen geldig woord." };
  }

  if (!firstMove) {
    const touchesExisting = spans.some((span) => span.cells.some((c) => !newCells.has(`${c.row},${c.col}`)));
    if (!touchesExisting) {
      return { ok: false, error: "Moet aansluiten op een al liggend woord." };
    }
  }

  const words: FormedWord[] = [];
  for (const span of spans) {
    const formed = scoreSpan(testBoard, span, newCells);
    if (!isValidWord(formed.word)) {
      return { ok: false, error: `"${formed.word}" komt niet voor in het Boek van Mormon.` };
    }
    words.push(formed);
  }

  let score = words.reduce((sum, w) => sum + w.score, 0);
  if (placements.length === RACK_SIZE) score += 50; // bingo: het hele rek in één beurt gebruikt

  return { ok: true, result: { score, words } };
}
