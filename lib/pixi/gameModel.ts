export type Cell = { x: number; y: number; kind: number };

export function createGrid(rows = 6, cols = 6, kinds = 5): Cell[] {
  const cells: Cell[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      cells.push({ x, y, kind: Math.floor(Math.random() * kinds) });
    }
  }
  return cells;
} 