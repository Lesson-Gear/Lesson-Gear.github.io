import { useOutletContext } from "react-router";
import type { GroupArrangement, Names } from "../groupgen/GroupGenTypes";


const PersonSelect = () => {
    const {pickedNames} = useOutletContext<{ groupArrangement: GroupArrangement; setGroups: React.Dispatch<React.SetStateAction<GroupArrangement>>, pickedNames: Names[]}>();
    if (!pickedNames) return <></>
    return (
        <main className="relative w-full flex justify-center pt-40">
            <div className="flex items-center justify-center border-2 border-desk-outline bg-gray-50 rounded-2xl w-50 h-40 p-5">
                {pickedNames.map((name) => name.name).join(", ")}
            </div>
        </main>
    )
}

export default PersonSelect;