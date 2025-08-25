"use client";
import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

type Tile = { x: number; y: number; id: number };

type Props = {
  rows?: number;
  cols?: number;
  tileSize?: number;
  onTileTap?: (tile: Tile) => void;
};

export default function PixiBoard({ rows = 6, cols = 6, tileSize = 64, onTileTap }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const app = new PIXI.Application({
      resizeTo: containerRef.current,
      antialias: true,
      backgroundAlpha: 0,
    });

    appRef.current = app;
    containerRef.current.appendChild(app.view as HTMLCanvasElement);

    const stage = app.stage;
    const grid = new PIXI.Container();
    stage.addChild(grid);

    const gap = 6;
    const tiles: PIXI.Graphics[] = [];

    function drawGrid() {
      grid.removeChildren();
      tiles.length = 0;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const g = new PIXI.Graphics();
          g.beginFill(Math.floor(Math.random() * 0xffffff));
          g.drawRoundedRect(0, 0, tileSize, tileSize, 12);
          g.endFill();
          g.x = c * (tileSize + gap);
          g.y = r * (tileSize + gap);
          g.interactive = true;
          g.cursor = "pointer";

          const tile: Tile = { x: c, y: r, id: r * cols + c };

          g.on("pointertap", () => {
            g.scale.set(1.1);
            g.alpha = 0.85;
            setTimeout(() => {
              // Check if the graphics object still exists before accessing properties
              if (g && !g.destroyed) {
                g.scale.set(1);
                g.alpha = 1;
              }
            }, 120);
            onTileTap?.(tile);
          });

          tiles.push(g);
          grid.addChild(g);
        }
      }

      // center
      const gridW = cols * tileSize + (cols - 1) * gap;
      const gridH = rows * tileSize + (rows - 1) * gap;
      grid.x = (app.renderer.width - gridW) / 2;
      grid.y = (app.renderer.height - gridH) / 2;
    }

    function onResize() {
      drawGrid();
    }

    drawGrid();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      app.destroy(true, { children: true });
      appRef.current = null;
    };
  }, [rows, cols, tileSize, onTileTap]);

  return <div ref={containerRef} className="w-full h-[60vh] rounded-2xl bg-[var(--card)] border border-white/10 overflow-hidden" />;
} 