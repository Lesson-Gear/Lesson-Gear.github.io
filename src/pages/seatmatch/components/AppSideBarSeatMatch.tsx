import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import type { Arrangement } from "@/pages/seatmatch/nameassignment/types.ts";
import { useLanguage } from "@/languages/LanguageContext.tsx";
import { useState } from "react";
import { ClassCombobox } from "@/pages/groupgenerator/components/AppSideBarGroupGen";
import type { Class } from "@/pages/groupgenerator/groupgen/GroupGenTypes"
import { Info } from "lucide-react"
// arrangements
import rawInitialLayoutNormal from "@/pages/seatmatch/nameassignment/arrangements/arr_normal.json";
import rawInitialLayoutOther from "@/pages/seatmatch/nameassignment/arrangements/arr_other.json";
import { NavLink } from "react-router";

const initialArrangementNormal: Arrangement = rawInitialLayoutNormal;
const initialArrangementOther: Arrangement = rawInitialLayoutOther;

const arrangements: Arrangement[] = [initialArrangementNormal, initialArrangementOther];


export function AppSidebar({ 
  onReassign,
  allClasses,
  currentClass,
  setCurrentClassId
}: { 
  onReassign: (givenArrangement: Arrangement) => void,
  allClasses: Class[],
  currentClass: Class | null,
  setCurrentClassId: (classId: string | null) => void,
}) {

  const [classSelected, setClassSelected] = useState<boolean>(false);
  const { t } = useLanguage();
  const [slectedArrangement, setSelectedArrangement] = useState<Arrangement | null>(null);
  const [selected, setSelected] = useState<boolean>(false);
  
  return (
    <Sidebar variant="floating" className="top-16 h-[calc(100vh-64px)]">
      <SidebarContent className="flex items-center pt-10 px-4 space-y-2">
        <div className="text-foreground font-semibold text-2xl">SeatMatch</div>

        <div className="flex flex-col space-y-1 w-full">
          <label
            htmlFor="number-input"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {t("ChooseArrangement")}
          </label>

          <Combobox<Arrangement>
            items={arrangements}
            value={slectedArrangement}
            onValueChange={(arrangement) => setSelectedArrangement(arrangement)}
            itemToStringValue={(arrangement) => arrangement.id}
            itemToStringLabel={(arrangement) => arrangement.name}
          >
            <ComboboxInput placeholder={t("Arrangement")} aria-invalid={selected}/>
            <ComboboxContent>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(arrangement) => (
                  <ComboboxItem key={arrangement.id} value={arrangement}>
                    {arrangement.name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

        </div>

        <div className="w-full">
          <ClassCombobox
            label={t("ChooseClass")}
            placeholder={t("Classes")}
            items={allClasses}
            value={currentClass}
            onChange={setCurrentClassId}
            ariaInvalid={classSelected}
          />
        </div>

        <ManageYourClasses t={t}/>

        {!!currentClass?.absentPeopleIds.length && (
          <PeopleMarkedAsAbsentMessage t={t}/>
        )}

        <button
          className="mt-2 px-4 py-2 bg-primary-button-background text-white rounded cursor-pointer hover:bg-primary-button-hover"
          onClick={() => {
            if (slectedArrangement == null) {
              setSelected(true);
            } else if (currentClass === null) {
              setClassSelected(true);
            } else {
              onReassign(slectedArrangement!);
              setClassSelected(false);
              setSelected(false);
            }
            
          }}
        >
          Reassign Names
        </button>
      </SidebarContent>
    </Sidebar>
  );
}
type TranslateFn = ReturnType<typeof useLanguage>["t"];

type ManageYourClassesProps = {
  t: TranslateFn
}
export const ManageYourClasses: React.FC<ManageYourClassesProps> = ({t}) => {
  return (
    <div className="w-full">
      <div className="text-sm text-muted-foreground">
        <NavLink to="/class-management" className="text-blue-500">
          {t("Manage")}
        </NavLink>
        {" " + t("YourClasses")}
      </div>
    </div>
  )
}

type PeopleMarkedAsAbsentMessageProps = {
  t: TranslateFn;
}
export const PeopleMarkedAsAbsentMessage: React.FC<PeopleMarkedAsAbsentMessageProps> = ({t}) => {
  return (
    <div className="flex flex-row items-center justify-start w-full">
      <Info className="mr-2 shrink-0" size={30}/>
      <div className="text-sm text-muted-foreground">
        {t("PeopleAbsentInPlace")}{" "}
        <NavLink to="/class-management" className="text-blue-500">
          view
        </NavLink>
      </div>
    </div>
  )
}