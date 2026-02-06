import type { Names, Class } from "../groupgenerator/groupgen/GroupGenTypes.ts";
import { Edit, Trash2, Plus } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
  ComboboxInput,
} from "@/components/ui/combobox"
import { useLanguage } from "@/languages/LanguageContext.tsx";
import { HoverQuestion } from "../groupgenerator/components/AppSideBarGroupGen.tsx";
import { TriangleAlert, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
type TranslateFn = ReturnType<typeof useLanguage>["t"];

export function getClassesFromStorage(): Class[] {
  const data = localStorage.getItem("classes");
  return data ? (JSON.parse(data) as Class[]) : [];
}

export default function ClassManagement() {
  const { t } = useLanguage();

  const [allClasses, setAllClasses] = useState<Class[]>(getClassesFromStorage);
  const [currentClassId, setCurrentClassId] = useState<string | null>(null);

  const currentClass = useMemo(
    () => allClasses.find(c => c.id === currentClassId) ?? null,
    [allClasses, currentClassId]
  );

  const absentPeople = useMemo(() => {
    if (!currentClass) return []

    const absentIds = currentClass.absentPeopleIds ?? []

    return currentClass.people.filter(p =>
      absentIds.includes(p.id)
    )
  }, [currentClass])

  const [changingName, setChangingName] = useState<Names | null>(null);
  const [newName, setNewName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [selected, setSelected] = useState(false);
  const [isAddingNewClass, setIsAddingNewClass] = useState(false);
  const [newClass, setNewClass] = useState("");

  /* ---------- persistence ---------- */
  useEffect(() => {
    localStorage.setItem("classes", JSON.stringify(allClasses));
    setSelected(false);
  }, [allClasses]);

  /* ---------- helpers ---------- */
  const updateClass = (id: string, updater: (cls: Class) => Class) => {
    setAllClasses(prev =>
      prev.map(cls => (cls.id === id ? updater(cls) : cls))
    );
  };

  /* ---------- people mutations ---------- */
  const updateName = (personId: string, name: string) => {
    if (!currentClassId) return;

    updateClass(currentClassId, cls => ({
      ...cls,
      people: cls.people.map(p =>
        p.id === personId ? { ...p, name } : p
      ),
    }));
  };

  const addNewNames = (name: string) => {
    if (!currentClassId) return;

    updateClass(currentClassId, cls => ({
      ...cls,
      people: [
        { id: crypto.randomUUID(), name },
        ...cls.people,
      ],
    }));
  };

  const removeName = (personId: string) => {
    if (!currentClassId) return;

    updateClass(currentClassId, cls => ({
      ...cls,
      people: cls.people.filter(p => p.id !== personId),
    }));
  };

  /* ---------- class mutations ---------- */
  const addNewClass = (className: string) => {
    const cls: Class = {
      id: crypto.randomUUID(),
      name: className,
      people: [],
      absentPeopleIds: [],
    };

    setAllClasses(prev => [...prev, cls]);
    setCurrentClassId(cls.id);
  };

  return (
    <main className="flex grid-cols-2 gap-20 min-h-0 items-center justify-center h-full">
      
      <ClassSelector
        allClasses={allClasses}
        currentClass={currentClass}
        isAddingNewClass={isAddingNewClass}
        newClass={newClass}
        selected={selected}
        setCurrentClassId={setCurrentClassId}
        setIsAddingNewClass={setIsAddingNewClass}
        setNewClass={setNewClass}
        addNewClass={addNewClass}
        t={t}
        updateClass={updateClass}
        absentPeople={absentPeople}
      />

      {currentClass && (
        <ClassCard
          currentClass={currentClass}
          changingName={changingName}
          newName={newName}
          isAdding={isAdding}
          setChangingName={setChangingName}
          setNewName={setNewName}
          setIsAdding={setIsAdding}
          updateName={updateName}
          addNewNames={addNewNames}
          removeName={removeName}
          t={t}
        />
      )}
    </main>
  );
}

// Class selector function
type ClassSelectorProps = {
  allClasses: Class[];
  currentClass: Class | null;
  isAddingNewClass: boolean;
  newClass: string;
  selected: boolean;

  setCurrentClassId: (id: string | null) => void;
  setIsAddingNewClass: (v: boolean) => void;
  setNewClass: (v: string) => void;

  addNewClass: (name: string) => void;
  t: TranslateFn;
  updateClass: (id: string, updater: (cls: Class) => Class) => void;
  absentPeople: Names[]
};

function ClassSelector({
  allClasses,
  currentClass,
  isAddingNewClass,
  newClass,
  selected,
  setCurrentClassId,
  setIsAddingNewClass,
  setNewClass,
  addNewClass,
  t,
  updateClass,
  absentPeople
}: ClassSelectorProps) {
  const comboBoxAnchor = useComboboxAnchor()

  

  return (
    <div className="border-2 border-group-outline bg-card-background p-4 w-90 rounded-lg flex flex-col h-150">
      <div className="flex flex-col space-y-1 w-full">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {t("ChooseClass")}
        </label>

        <div className="flex flex-row w-full flex-1">
          <div className="flex-1">
            {isAddingNewClass ? (
              <Input
                autoFocus
                value={newClass}
                onChange={(e) => setNewClass(e.target.value)}
                placeholder={t("ClassName")}
                onBlur={() => {
                  setIsAddingNewClass(false);
                  setNewClass("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newClass.trim()) {
                    addNewClass(newClass.trim());
                    setNewClass("");
                    setIsAddingNewClass(false);
                  } else if (e.key === "Escape") {
                    setIsAddingNewClass(false);
                    setNewClass("");
                  }
                }}
              />
            ) : (
              <Combobox<Class>
                items={allClasses}
                value={currentClass}
                onValueChange={(cls) =>
                  setCurrentClassId(cls?.id ?? null)
                }
                itemToStringValue={(cls) => cls.id}
                itemToStringLabel={(cls) => cls.name}
              >
                <ComboboxInput
                  placeholder={t("Classes")}
                  aria-invalid={selected}
                />
                <ComboboxContent>
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {(cls) => (
                      <ComboboxItem key={cls.id} value={cls}>
                        {cls.name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            )}
          </div>

          {!isAddingNewClass && 
            <Tooltip>
              <TooltipTrigger>
                <button
                  className="rounded-md transition px-2 py-2 hover:cursor-pointer hover:bg-secondary-button-hover"
                  onClick={() => setIsAddingNewClass(true)}
                >
                  <Plus size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("NewClass")}</p>
              </TooltipContent>
            </Tooltip>
          }

          {isAddingNewClass && 
            <Tooltip>
              <TooltipTrigger>
                <button
                  className="rounded-md transition px-2 py-2 ml-1 hover:cursor-pointer hover:bg-secondary-button-hover"
                  onClick={() => {
                    addNewClass(newClass.trim());
                    setNewClass("");
                    setIsAddingNewClass(false);}
                  }
                >
                  <Check size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("Submit")}</p>
              </TooltipContent>
            </Tooltip>
          }
        </div>

        <div className="flex flex-row items-center gap-3 pt-3">
          <TriangleAlert className="w-30 text-muted-foreground"/>
          <div className="text-muted-foreground text-sm">
            {t("LocalStorageDescription")}
          </div>
        </div>


        <div className="flex flex-col space-y-1 w-full pt-3">
          <div className="flex flex-row gap-2 items-center">
            <label
              htmlFor="number-input"
              className="text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              {t("AbsentPeople")}
            </label>
            <HoverQuestion description={t("AbsentPeopleDescription")} />
          </div>

          <Combobox
            multiple
            items={currentClass?.people ?? []}
            autoHighlight
            value={absentPeople}
            onValueChange={(people: Names[]) => {
              if (!currentClass) return
              updateClass(currentClass.id, cls => ({
                ...cls,
                absentPeopleIds: people.map(p => {return p.id}),
              }))
            }}
          >
            <ComboboxChips ref={comboBoxAnchor} className="w-full max-w-xs">
              <ComboboxValue>
                {(values: Names[]) => (
                  <>
                    {values.map(person => (
                      <ComboboxChip key={person.id}>
                        {person.name}
                      </ComboboxChip>
                    ))}
                    <ComboboxChipsInput />
                  </>
                )}
              </ComboboxValue>
            </ComboboxChips>
            <ComboboxContent anchor={comboBoxAnchor}>
              <ComboboxEmpty>No people found.</ComboboxEmpty>
              <ComboboxList>
                {(person: Names) => (
                  <ComboboxItem key={person.id} value={person}>
                    {person.name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>
    </div>
  );
}

/* ================= Class Card ================= */

type ClassCardProps = {
  currentClass: Class;
  changingName: Names | null;
  newName: string;
  isAdding: boolean;
  setChangingName: (n: Names | null) => void;
  setNewName: (v: string) => void;
  setIsAdding: (v: boolean) => void;
  updateName: (id: string, name: string) => void;
  addNewNames: (name: string) => void;
  removeName: (id: string) => void;
  t: TranslateFn;
};

function ClassCard({
  currentClass,
  changingName,
  newName,
  isAdding,
  setChangingName,
  setNewName,
  setIsAdding,
  updateName,
  addNewNames,
  removeName,
  t
}: ClassCardProps) {
  return (
    <div className="border-2 border-group-outline bg-card-background p-4 w-90 rounded-lg flex flex-col h-150">
      <div className="flex flex-row font-semibold border-b justify-center items-center mb-2 pb-2 gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={t("EnterName")}
          onBlur={() => {
            if (!isAdding) {
                setNewName(""); // cancel
            }
            setIsAdding(false);
            setNewName("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newName.trim()) {
              addNewNames(newName.trim());
              setNewName("");
            } else if (e.key === "Escape") {
              setIsAdding(false);
              setNewName("");
            }
          }}
        />

        <button
          onMouseDown={() => setIsAdding(true)}
          onClick={() => {
            if (!newName.trim()) return;
            addNewNames(newName.trim());
            setNewName("");
          }}
        >
          Add
        </button>
      </div>

      <div className="overflow-y-auto flex-1">
        {currentClass.people.map(person => (
          <div
            key={person.id}
            className="flex items-center justify-between px-4 py-2 border-b last:border-b-0 hover:bg-gray-50"
          >
            {changingName?.id === person.id ? (
              <Input
                autoFocus
                value={changingName.name}
                onChange={(e) =>
                  setChangingName({ id: person.id, name: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateName(person.id, changingName.name);
                    setChangingName(null);
                  } else if (e.key === "Escape") {
                    setChangingName(null);
                  }
                }}
                onBlur={() => {
                  updateName(person.id, changingName.name);
                  setChangingName(null);
                }}
              />
            ) : (
              <span className="text-gray-400">{person.name}</span>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setChangingName(person)}
                className="p-1 rounded hover:bg-indigo-100 text-indigo-600"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => removeName(person.id)}
                className="p-1 rounded hover:bg-red-100 text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}