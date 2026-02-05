// src/pages/seatmatch/SeatMatchLayout.tsx
import { Outlet } from "react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/AppSideBarSeatMatch";
import { DndContext } from '@dnd-kit/core';
import { useState, useMemo } from "react";
import type { Arrangement } from "@/pages/seatmatch/nameassignment/types.ts";
import type { Names, Class } from "@/pages/groupgenerator/groupgen/GroupGenTypes";
import { getClassesFromStorage } from "@/pages/classmanagement/ClassManagement";


function assignNamesToSeats(
  layout: Arrangement, 
  names: Names[],
  absentIds: string[]
): Arrangement {
  // copy the names array so we don't mutate the original
  const namesCopy = [...names];

  const absentSet = new Set(absentIds)
  const available = namesCopy.filter(
    person => !absentSet.has(person.id)
  )

  return {
    ...layout,
    arrangement: layout.arrangement.map((desk) => ({
      ...desk,
      seats: desk.seats.map((seat) => {
        // if no names left, leave seat as is
        if (!available.length) return seat;

        // pick a random index
        const idx = Math.floor(Math.random() * available.length);

        // assign the name string and remove it from pool
        const assignedName = available.splice(idx, 1)[0].name;

        return { ...seat, assignedName };
      }),
    })),
  };
}


export default function SeatMatchLayout() {
  
  const [arrangement, setArrangement] = useState<Arrangement | null>(null);
  const allClasses: Class[] = getClassesFromStorage();
  const [currentClassId, setCurrentClassId] = useState<string | null>(null);

  const currentClass = useMemo(
    () => allClasses.find(c => c.id === currentClassId) ?? null,
    [allClasses, currentClassId]
  );

  const handleCallSeatMatch = (givenArrangement: Arrangement) => {
    setArrangement(assignNamesToSeats(givenArrangement, currentClass?.people ?? [], currentClass?.absentPeopleIds ?? []));
  };


  return (
    <SidebarProvider>
      <div className="flex flex-1 min-h-0 h-[calc(100vh-4rem)]">
        <AppSidebar 
          onReassign={handleCallSeatMatch}
          allClasses={allClasses}
          currentClass={currentClass}
          setCurrentClassId={setCurrentClassId}
        />

        <main className="relative flex flex-col flex-1 min-h-0">
          {/* Floating trigger */}
          <div className="absolute left-2 top-2 z-20">
            <SidebarTrigger className="hover:cursor-pointer" />
          </div>

          {/* Outlet must be flex */}
          <div className="relative flex flex-1 min-h-0">
            <DndContext>
              <Outlet context={{ arrangement, setArrangement }} />
            </DndContext>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}