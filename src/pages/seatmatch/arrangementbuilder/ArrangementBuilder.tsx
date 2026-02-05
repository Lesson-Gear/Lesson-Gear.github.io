import React, { useEffect, useRef, useState } from "react";
import type { DragStartEvent, UniqueIdentifier, DragEndEvent } from "@dnd-kit/core";
import {useDraggable, useDroppable, DndContext, DragOverlay } from '@dnd-kit/core';
import { useOutletContext } from "react-router";
import type { Desk, Seat } from "@/pages/seatmatch/nameassignment/SeatMatchLayout";


const ArrangementBuilder = () => {
    const containerRef = useRef<HTMLElement>(null);
    const [canvasSize, setCanvasSize] = useState({width: 1, height: 1});

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setCanvasSize({ width, height });
        })

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <DndContext>
            <main className="flex flex-1 min-h-0" ref={containerRef}>
                
            </main>
        </DndContext>
    )
}