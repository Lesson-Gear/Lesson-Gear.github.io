import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch"
import { useLanguage } from "@/languages/LanguageContext.tsx";
import { useState } from "react";
import type { Class } from "../groupgen/GroupGenTypes";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { CircleQuestionMark } from "lucide-react";
import { PeopleMarkedAsAbsentMessage, ManageYourClasses } from "@/pages/seatmatch/components/AppSideBarSeatMatch";


export function AppSidebarGroupGen({
  onReassign,
  onChangeMode,
  enabled,
  currentTab,
  setCurrentTab,
  onRepickNames,
  setCurrentClassId,
  currentClass,
  allClasses,
  
}: {
  onReassign: (givenNumber: number) => void,
  onChangeMode: () => void,
  enabled: boolean,
  currentTab: string,
  setCurrentTab: (newTab: string) => void,
  onRepickNames: (givenNumber: number) => void,
  setCurrentClassId: (classId: string | null) => void,
  currentClass: Class | null,
  allClasses: Class[],
}) {
  
  const [inputValue, setInputValue] = useState<number | "">("");
  const { t } = useLanguage();
  const [classSelected, setClassSelected] = useState<boolean>(false);
  const [groupGenInputInvalid, setgroupGenInputInvalid] = useState<boolean>(false);
  const [namePickerInputInvalid, setnamePickerInputInvalid] = useState<boolean>(false);
  
  
  return (
    <Sidebar variant="floating" className="top-16 h-[calc(100vh-64px)]">
      <SidebarContent className="flex flex-col pt-8 px-4 space-y-4">
        {/* title */}
        <div className="text-foreground font-semibold text-2xl">Group Generator</div>

        <Tabs className="w-full" value={currentTab} onValueChange={(val) => setCurrentTab(val)}>
          <TabsList className="mb-2">
            <TabsTrigger value="group-generator">{t("GenGroupChoice")}</TabsTrigger>
            <TabsTrigger value="name-picker">{t("SelectPersonChoice")}</TabsTrigger>
          </TabsList>

          <TabsContent value="group-generator">
            <div className="space-y-4">
              {/* Options */}
              <div className="flex flex-row items-center">
                <div className="text-foreground font-semibold">{t("OptionsGroupGen")}</div>
                <HoverQuestion description={t("OptionDescription")} />
              </div>


              <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full gap-2">
                <div className="text-sm text-right">{t("EnterNumGroups")}</div>
                <Switch checked={enabled} onCheckedChange={onChangeMode} />
                <div className="text-sm text-left">{t("EnterNumPeoplePerGroup")}</div>
              </div>

              {/* Input */}
              <input
                type="number"
                min="0"
                className={`w-full rounded-md border px-3 py-2 placeholder-gray-400 focus:outline-none sm:text-sm
                ${groupGenInputInvalid ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"}
              `}
                placeholder={enabled ? t("EnterNumPeoplePerGroupInput") : t("EnterNumGroupsInput")}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value === "" ? "" : Number(e.target.value))}
                
              />
            </div>
          </TabsContent>

          <TabsContent value="name-picker">
            <div className="space-y-4">
              {/* Input */}
              <div className="flex flex-col space-y-1">
                <label
                  htmlFor="number-input"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  {t("EnterNumberPeopleToChoose")}
                </label>
                <input
                  id="number-input"
                  type="number"
                  min="0"
                  className={`w-full rounded-md border px-3 py-2 placeholder-gray-400 focus:outline-none sm:text-sm
                    ${namePickerInputInvalid ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"}
                  `}
                  placeholder={"0"}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>
            </div>
          </TabsContent>

          
          <ClassCombobox
            label={t("ChooseClass")}
            placeholder={t("Classes")}
            items={allClasses}
            value={currentClass}
            onChange={setCurrentClassId}
            ariaInvalid={classSelected}
          />

          <ManageYourClasses t={t}/>

          {!!currentClass?.absentPeopleIds.length && (
            <PeopleMarkedAsAbsentMessage t={t}/>
          )}

          <button
            className="w-full mt-2 px-4 py-2 bg-primary-button-background text-white rounded hover:bg-primary-button-hover hover:cursor-pointer"
            onClick={() => {
              if (inputValue !== "" && currentClass !== null) {
                ((currentTab === "group-generator") ? onReassign(inputValue) : onRepickNames(inputValue))
                setgroupGenInputInvalid(false);
                setnamePickerInputInvalid(false);
                setClassSelected(false);
              } else if (currentClass == null) {
                setClassSelected(true);
              } else if(inputValue === "") {
                setgroupGenInputInvalid(true);
                setnamePickerInputInvalid(true);
              }
            }}
          >
            {(currentTab === "group-generator") ?  t("GenerateAgainGroups") : t("Choose")}
          </button>
        </Tabs>
      </SidebarContent>
    </Sidebar>
  );
}

type HoverQuestionProps = {
  description: string
}
export const HoverQuestion: React.FC<HoverQuestionProps> = ({description}) => {
  return (
    <HoverCard openDelay={10} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button className="flex items-center gap-1 text-muted-foreground hover:cursor-pointer font-medium px-2 py-1 rounded"><CircleQuestionMark /></button>
      </HoverCardTrigger>
      <HoverCardContent className="flex w-64 flex-col gap-0.5">
        <div className="text-sm">{description}</div>
      </HoverCardContent>
    </HoverCard>
  )
}


type ClassComboboxProps = {
  label: string
  placeholder: string
  items: Class[]
  value: Class | null
  onChange: (classId: string | null) => void
  ariaInvalid?: boolean
}
export function ClassCombobox({
  label,
  placeholder,
  items,
  value,
  onChange,
  ariaInvalid,
}: ClassComboboxProps) {
  return (
    <div className="flex flex-col space-y-1 pt-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </label>

      <Combobox<Class>
        items={items}
        value={value}
        onValueChange={(cls) => onChange(cls?.id ?? null)}
        itemToStringValue={(cls) => cls.id}
        itemToStringLabel={(cls) => cls.name}
      >
        <ComboboxInput
          placeholder={placeholder}
          aria-invalid={ariaInvalid}
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
    </div>
  )
}