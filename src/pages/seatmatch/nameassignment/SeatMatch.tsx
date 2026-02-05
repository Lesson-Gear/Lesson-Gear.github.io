// src/pages/seatmatch/SeatMatch.tsx
import React, { useEffect, useRef, useState } from "react";
import type { DragStartEvent, UniqueIdentifier, DragEndEvent } from "@dnd-kit/core";
import {useDraggable, useDroppable, DndContext, DragOverlay } from '@dnd-kit/core';
import { useOutletContext } from "react-router";
import type { Arrangement, Teacher, Seat } from "@/pages/seatmatch/nameassignment/types.ts";
import { useLanguage } from "@/languages/LanguageContext.tsx";
import { WhatsNewSeatMatch } from "@/pages/home/PopUps";


const SeatMatch = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const { arrangement, setArrangement } = useOutletContext<{ arrangement: Arrangement; setArrangement: React.Dispatch<React.SetStateAction<Arrangement>> }>();

  const [canvasSize, setCanvasSize] = useState({ width: 1, height: 1 });
  const [activeName, setActiveName] = useState<string | null>(null);


  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setCanvasSize({ width, height });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);


  function handleDragStart(event: DragStartEvent) {
    const draggedSeatId = event.active.id;

    // Find the name being dragged
    let name: string | undefined;
    for (const desk of arrangement.arrangement) {
      const seat = desk.seats.find(s => s.id === draggedSeatId);
      if (seat) {
        name = seat.assignedName;
        break;
      }
    }

    setActiveId(draggedSeatId);
    setActiveName(name ?? null); // store name for overlay
  }
  
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveId(null); // clear dragging state
    if (!over) return; // not dropped over any seat

    const draggedSeatId = active.id; // the seat being dragged
    const targetSeatId = over.id;    // the seat dropped on

    setArrangement((prev) => {
      let draggedName: string | undefined;
      let targetName: string | undefined;

      // First pass: remove name from dragged seat and get target's current name
      const updatedDesks = prev.arrangement.map(desk => ({
        ...desk,
        seats: desk.seats.map(seat => {
          if (seat.id === draggedSeatId) {
            draggedName = seat.assignedName;
            return { ...seat, assignedName: undefined };
          }
          if (seat.id === targetSeatId) {
            targetName = seat.assignedName; // could be undefined
            return seat;
          }
          return seat;
        }),
      }));

      // Second pass: assign names to the target and dragged seat
      return {
        ...prev,
        arrangement: updatedDesks.map(desk => ({
          ...desk,
          seats: desk.seats.map(seat => {
            if (seat.id === targetSeatId) {
              return { ...seat, assignedName: draggedName };
            }
            if (seat.id === draggedSeatId) {
              return { ...seat, assignedName: targetName }; // swap if target had a name
            }
            return seat;
          }),
        }))
      };
    });
  }


  return (
    <>
      <WhatsNewSeatMatch />
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <main 
          className="relative w-full mx-auto"
          ref={containerRef}
        >
            <DeskArea canvasSize={canvasSize} arrangement={arrangement} activeId={activeId}/>
        </main>


        <DragOverlay dropAnimation={{duration: 0}}>
          {activeId ? (
            <div className="border border-foreground bg-background/80 px-3 py-1 flex rounded shadow-lg items-center justify-center">
              {activeName}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};



interface DeskAreaProps {
  canvasSize: { width: number; height: number };
  arrangement: Arrangement;
  activeId: UniqueIdentifier | null;
}

const DeskArea = ({ canvasSize, arrangement, activeId }: DeskAreaProps) => {
  if (!arrangement) return <></>
  // Decide desk size relative to canvas size
  const deskWidth = canvasSize.width * arrangement.size.width; // 25% of width per desk
  const deskHeight = canvasSize.height * arrangement.size.height; // 15% of height

  // teacher
  const isVisible: boolean = arrangement.teacher.exists;
  const teacherDesk: Teacher = arrangement.teacher;

  const {t} = useLanguage();
  return (
    <div className="relative w-full h-full">
      {isVisible && 
        <div
          key={teacherDesk.id}
          className="absolute flex border-2 border-desk-outline overflow-hidden rounded-2xl items-center justify-center"
          style={{
            left: teacherDesk.x * canvasSize.width,
            top: teacherDesk.y * canvasSize.height,
            width: canvasSize.width * teacherDesk.width,
            height: canvasSize.height * teacherDesk.height,
            transform: `rotate(${teacherDesk.rotation}deg)`,
            transformOrigin: "center",
          }}
          >
            {t("TeacherDesk")}
      </div>
      }
      {arrangement.arrangement.map((desk) => (
        <div
          key={desk.id}
          className="absolute flex border-2 border-desk-outline overflow-hidden rounded-2xl"
          style={{
            left: desk.x * canvasSize.width,
            top: desk.y * canvasSize.height,
            width: deskWidth,
            height: deskHeight,
            transform: `rotate(${desk.rotation}deg)`,
              transformOrigin: "center",
          }}
        >
          {desk.seats.map((seat) => (
            <SeatCell key={seat.id} seat={seat} activeId={activeId} rotation={desk.rotation}/>
          ))}
        </div>
      ))}
    </div>
  );
};

function SeatCell({ seat, activeId, rotation }: { seat: Seat; activeId: UniqueIdentifier | null, rotation: number }) {  const { setNodeRef: setDropRef } = useDroppable({ id: seat.id });
  const { setNodeRef: setDragRef, listeners, attributes } = useDraggable({
    id: seat.id,
  });

  return (
    <div
      ref={setDropRef}
      className="flex-1 flex items-center justify-center border-r last:border-r-0"
    >
      <button
        ref={setDragRef}
        {...listeners}
        {...attributes}
        className={`px-2 py-1 rounded cursor-grab ${
          activeId === seat.id? "opacity-0" : ""
        }`}
        style={{
          transform: `rotate(${-rotation}deg)`, // counter-rotate content
        }}
      >
        {seat.assignedName}
      </button>
    </div>
  );
}

export default SeatMatch;