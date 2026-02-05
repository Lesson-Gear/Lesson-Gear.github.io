// src/pages/groupgenerator/groupgen.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebarGroupGen } from "@/pages/groupgenerator/components/AppSideBarGroupGen";
import { useState, useMemo } from "react";
import { Outlet } from "react-router";
import { DndContext } from '@dnd-kit/core';
import type { Group, Names, GroupArrangement, Class } from "@/pages/groupgenerator/groupgen/GroupGenTypes";
import { useNavigate } from "react-router";
import { getClassesFromStorage } from "@/pages/classmanagement/ClassManagement";


function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createGroups(
  names: Names[],
  fixedGroupSize: boolean,
  value: number
): GroupArrangement {
  const shuffled = shuffle(names);
  const groups: Group[] = [];

  // 🔹 MODE A: Fixed group size
  if (fixedGroupSize) {
    let currentGroup: Names[] = [];

    shuffled.forEach((person) => {
      currentGroup.push({
        id: person.id,
        name: person.name,
      });

      if (currentGroup.length === value) {
        groups.push({
          id: crypto.randomUUID(),
          names: currentGroup,
        });
        currentGroup = [];
      }
    });

    if (currentGroup.length > 0) {
      groups.push({
        id: crypto.randomUUID(),
        names: currentGroup,
      });
    }
  }

  // 🔹 MODE B: Fixed number of groups
  else {
    const groupCount = Math.max(1, value);
    const baseSize = Math.floor(shuffled.length / groupCount);
    let remainder = shuffled.length % groupCount;

    let index = 0;

    for (let i = 0; i < groupCount; i++) {
      const size = baseSize + (remainder > 0 ? 1 : 0);
      remainder--;

      const groupNames: Names[] = shuffled
        .slice(index, index + size)
        .map((person) => ({
          id: person.id,
          name: person.name,
        }));

      index += size;

      if (groupNames.length > 0) {
        groups.push({
          id: crypto.randomUUID(),
          names: groupNames,
        });
      }
    }
  }

  return {
    id: crypto.randomUUID(),
    groups,
  };
}

function pickNames(
  names: Names[],
  amount: number,
  absentIds: string[]
): Names[] {
  const absentSet = new Set(absentIds)

  const available = names.filter(
    person => !absentSet.has(person.id)
  )

  const count = Math.min(amount, available.length)
  const copy = [...available]
  const picked: Names[] = []

  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * copy.length)
    picked.push(copy.splice(index, 1)[0])
  }

  return picked
}

export default function GroupGenLayout() {
    const allClasses: Class[] = getClassesFromStorage();
    const [currentClassId, setCurrentClassId] = useState<string | null>(null);
  
    const currentClass = useMemo(
      () => allClasses.find(c => c.id === currentClassId) ?? null,
      [allClasses, currentClassId]
    );
    const [groupArrangement, setGroups] = useState<GroupArrangement | null>(null);
    const [enabled, setEnabled] = useState(false);
    const [currentTab, setCurrentTab] = useState("group-generator");
    const [pickedNames, setPickedNames] = useState<Names[] | null>(null);
    
    
    let navigate = useNavigate();


    const handleGroupGenCallback = (givenNumber: number) => {
      setGroups(createGroups(currentClass?.people ?? [], enabled, givenNumber));
    }

    const handleNamePickerCallback = (givenNumber: number) => {
      setPickedNames(pickNames(currentClass?.people ?? [], givenNumber, currentClass?.absentPeopleIds ?? []));
    }

    const handleGroupGenModeCallback = () => {
      setEnabled(!enabled);
    }

    const setCurrentClassIdFunction = (classId: string | null) => {
      setCurrentClassId(classId);
    }

    const handleSetCurrentTabCallback = (newTab: string) => {
      console.log("should change");
      if (newTab == "group-generator") {
        navigate("/group-generator");
      } else if (newTab == "name-picker") {
        navigate("/name-picker");
      }
      setCurrentTab(newTab);
    }

    return (
        <SidebarProvider>
            <div className="flex flex-1 min-h-0 h-[calc(100vh-4rem)]">
                <AppSidebarGroupGen 
                  onReassign={handleGroupGenCallback} 
                  enabled={enabled} 
                  onChangeMode={handleGroupGenModeCallback} 
                  currentTab={currentTab} 
                  setCurrentTab={handleSetCurrentTabCallback} 
                  onRepickNames={handleNamePickerCallback}
                  allClasses={allClasses}
                  currentClass={currentClass}
                  setCurrentClassId={setCurrentClassIdFunction}
                />

                <main className="relative flex flex-col flex-1 min-h-0">
                    {/* Floating trigger */}
                    <div className="absolute left-2 top-2 z-20">
                        <SidebarTrigger className="hover:cursor-pointer" />
                    </div>

                    {/* Outlet must be flex */}
                    <div className="relative flex flex-1 min-h-0">
                        <DndContext>
                            <Outlet context={{ groupArrangement, setGroups, pickedNames }} />
                        </DndContext>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}