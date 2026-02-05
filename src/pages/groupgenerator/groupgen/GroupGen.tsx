import React, { useState } from "react";
import type { DragStartEvent, UniqueIdentifier, DragEndEvent } from "@dnd-kit/core";
import {useDraggable, useDroppable, DndContext, DragOverlay } from '@dnd-kit/core';
import { useOutletContext } from "react-router";
import type { GroupArrangement, Names } from "./GroupGenTypes.ts";
import { WhatsNewGroupGen } from "@/pages/home/PopUps.tsx";


const GroupGen = () => {
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const {groupArrangement, setGroups} = useOutletContext<{ groupArrangement: GroupArrangement; setGroups: React.Dispatch<React.SetStateAction<GroupArrangement>>, pickedNames: Names[]}>();
    const [activeName, setActiveName] = useState<string | null>(null);
    
    function handleDragStart(event: DragStartEvent) {
        const draggedNameId = event.active.id;

        // Find the name being dragged
        let name: string | undefined;
        for (const group of groupArrangement.groups) {
            const nameIterate = group.names.find(s => s.id == draggedNameId);
            if (nameIterate) {
                name = nameIterate.name;
                break;
            }
        }

        setActiveId(draggedNameId);
        setActiveName(name ?? null);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        setActiveId(null);
        if (!over) return;

        const draggedNameId = active.id;
        const targetNameDropId = over.id;

        setGroups((prev) => {
            let draggedName: string | null = null;
            let targetName: string | null = null;

            // First pass: extract names
            const clearedGroups = prev.groups.map(group => ({
            ...group,
            names: group.names.map(n => {
                if (n.id === draggedNameId) {
                draggedName = n.name;
                return { ...n, name: "" };
                }
                if (n.id === targetNameDropId) {
                targetName = n.name;
                return n;
                }
                return n;
            }),
            }));

            // Second pass: swap
            return {
            ...prev,
            groups: clearedGroups.map(group => ({
                ...group,
                names: group.names.map(n => {
                if (n.id === targetNameDropId) {
                    return { ...n, name: draggedName ?? "" };
                }
                if (n.id === draggedNameId) {
                    return { ...n, name: targetName ?? "" };
                }
                return n;
                }),
            })),
            };
        });
    }

    return (
        <>
            <WhatsNewGroupGen />
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <main className="relative w-full mx-auto px-20 pt-20">
                    <GroupArea groups={groupArrangement} activeId={activeId}/>
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
    )
}



interface GroupAreaProps {
    groups: GroupArrangement;
    activeId: UniqueIdentifier | null;
}

const GroupArea = ({ groups, activeId }: GroupAreaProps) => {
    if (!groups) return <></>
    return (
        <div className="relative w-full grid grid-cols-5 gap-8 justify-center">
            {groups.groups.map((group, index) => (
                <div key={group.id} className="flex flex-col border-2 rounded-xl border-group-outline items-center  overflow-hidden">
                    <div className="font-semibold text-lg border-b-2 border-gray-300 w-full flex justify-center">{"Group " + (index+1)}</div>
                    {group.names.map((name) => (
                        <SeatCell key={name.id} id={name.id} name={name.name} activeId={activeId}/>
                    ))}
                </div>
            ))}
        </div>
    )
}

function SeatCell({ name, activeId, id }: { name: string; activeId: UniqueIdentifier | null; id: string }) {  const { setNodeRef: setDropRef } = useDroppable({ id: id });
    const { setNodeRef: setDragRef, listeners, attributes } = useDraggable({
        id: id,
    });

    return (
        <div ref={setDropRef}>
            <button
                ref={setDragRef}
                {...listeners}
                {...attributes}
                className={`px-2 rounded cursor-grab text-lg ${
                activeId === id? "opacity-0" : ""
                }`}
            >
                {name}
            </button>
        </div>
    )

}
export default GroupGen;