import React, { useEffect, useRef, useState } from "react";

interface Desk {
  id: string;
  x: number; // 0..1
  y: number; // 0..1
  rotation: number; // degrees
}

const GRID_PX = 20;
const DESK_SIZE_RATIO = 0.08;
const ROTATE_HANDLE_OFFSET = 12;

export default function SeatingArrangement() {
  const [desks, setDesks] = useState<Desk[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const [canvasSize, setCanvasSize] = useState({
    width: 1,
    height: 1,
  });

  /* ---------- Resize observer ---------- */

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setCanvasSize({ width, height });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  /* ---------- Drag state ---------- */

  const dragRef = useRef<{
    id: string | null;
    dx: number;
    dy: number;
  }>({ id: null, dx: 0, dy: 0 });

  const rotateRef = useRef<{
    id: string | null;
    centerX: number;
    centerY: number;
  }>({ id: null, centerX: 0, centerY: 0 });

  /* ---------- Desk actions ---------- */

  const addDesk = () => {
    const id = crypto.randomUUID();
    setDesks((d) => [
      ...d,
      {
        id,
        x: 0.1,
        y: 0.1,
        rotation: 0,
      },
    ]);
    setSelectedId(id);
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setDesks((d) => d.filter((desk) => desk.id !== selectedId));
    setSelectedId(null);
  };

  /* ---------- Move dragging ---------- */

  const onPointerDownDesk = (
    e: React.PointerEvent<HTMLDivElement>,
    desk: Desk
  ) => {
    e.stopPropagation();
    setSelectedId(desk.id);

    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current = {
      id: desk.id,
      dx: e.clientX - rect.left,
      dy: e.clientY - rect.top,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const { width, height } = canvasSize;

    /* ---- Moving ---- */
    if (dragRef.current.id) {
      let x = (e.clientX - dragRef.current.dx) / width;
      let y = (e.clientY - dragRef.current.dy) / height;

      const maxX = 1 - DESK_SIZE_RATIO;
      const maxY = 1 - DESK_SIZE_RATIO;

      x = Math.min(Math.max(x, 0), maxX);
      y = Math.min(Math.max(y, 0), maxY);

      const gridX = GRID_PX / width;
      const gridY = GRID_PX / height;

      x = Math.round(x / gridX) * gridX;
      y = Math.round(y / gridY) * gridY;

      setDesks((d) =>
        d.map((desk) =>
          desk.id === dragRef.current.id ? { ...desk, x, y } : desk
        )
      );
    }

    /* ---- Rotating ---- */
    if (rotateRef.current.id) {
      const { centerX, centerY } = rotateRef.current;

      const angle =
        (Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180) /
        Math.PI;

      setDesks((d) =>
        d.map((desk) =>
          desk.id === rotateRef.current.id
            ? { ...desk, rotation: angle }
            : desk
        )
      );
    }
  };

  const onPointerUp = () => {
    dragRef.current.id = null;
    rotateRef.current.id = null;
  };

  /* ---------- Rotation handle ---------- */

  const onPointerDownRotate = (
    e: React.PointerEvent<HTMLDivElement>,
    desk: Desk,
    centerX: number,
    centerY: number
  ) => {
    e.stopPropagation();

    rotateRef.current = {
      id: desk.id,
      centerX,
      centerY,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  /* ---------- Save / Load ---------- */

  const saveToFile = () => {
    const data = JSON.stringify(desks, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "seating-arrangement.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  const loadFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        setDesks(JSON.parse(reader.result as string));
        setSelectedId(null);
      } catch {
        alert("Invalid file");
      }
    };
    reader.readAsText(file);
  };

  /* ---------- Render ---------- */

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r p-4 space-y-3">
        <h1 className="text-lg font-semibold">Seating Planner</h1>

        <button
          onClick={addDesk}
          className="w-full rounded bg-blue-600 py-2 text-white"
        >
          Add Desk
        </button>

        <button
          onClick={deleteSelected}
          disabled={!selectedId}
          className="w-full rounded bg-red-600 py-2 text-white disabled:opacity-40"
        >
          Delete Selected
        </button>

        <hr />

        <button
          onClick={saveToFile}
          className="w-full rounded bg-green-600 py-2 text-white"
        >
          Save to File
        </button>

        <input
          type="file"
          accept="application/json"
          onChange={loadFromFile}
          className="w-full text-sm"
        />
      </aside>

      <main
        ref={containerRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onPointerDown={() => setSelectedId(null)}
        className="relative flex-1 bg-gray-200 overflow-hidden"
      >
        {desks.map((desk) => {
          const size = canvasSize.width * DESK_SIZE_RATIO;
          const left = desk.x * canvasSize.width;
          const top = desk.y * canvasSize.height;

          const centerX = left + size / 2;
          const centerY = top + size / 2;

          return (
            <React.Fragment key={desk.id}>
              {/* Desk */}
              <div
                onPointerDown={(e) => onPointerDownDesk(e, desk)}
                className={`absolute cursor-move select-none bg-black ${
                  desk.id === selectedId ? "ring-2 ring-blue-400" : ""
                }`}
                style={{
                  left,
                  top,
                  width: size,
                  height: size,
                  transform: `rotate(${desk.rotation}deg)`,
                }}
              />

              {/* Rotation ring */}
              {desk.id === selectedId && (
                <div
                  onPointerDown={(e) =>
                    onPointerDownRotate(e, desk, centerX, centerY)
                  }
                  className="absolute rounded-full border-2 border-blue-400 cursor-grab"
                  style={{
                    left: centerX - size / 2 - ROTATE_HANDLE_OFFSET,
                    top: centerY - size / 2 - ROTATE_HANDLE_OFFSET,
                    width: size + ROTATE_HANDLE_OFFSET * 2,
                    height: size + ROTATE_HANDLE_OFFSET * 2,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </main>
    </div>
  );
}