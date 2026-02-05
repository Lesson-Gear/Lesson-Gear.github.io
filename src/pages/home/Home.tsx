import { maxXSize } from "@/main";
import { ToolCard } from "./HomeComponents";
import { WelcomeInfoDialog } from "./PopUps";
import { useLanguage } from "@/languages/LanguageContext.tsx";
import { Presentation, Users, Clock, LibraryBig } from "lucide-react";
import { Link } from "react-router";

const Home = () => {
    const { t } = useLanguage();
    const year = new Date().getFullYear(); // current year dynamically


    return (
        <div className="font-sans text-gray-800 bg-gray-50 dark:bg-gray-900">
        <WelcomeInfoDialog />

        <div
            className="px-5 py-24 text-center text-white bg-linear-to-br from-blue-500 to-green-500 relative"
            style={{
                clipPath: "polygon(0 0, 100% 0, 100% 85%, 0% 100%)",
            }}
            >
                <h1 className="text-7xl font-extrabold text-white">LessonGear</h1>
                <h2 className="max-w-3xl mx-auto mt-6 text-4xl font-bold">
                    {t("EverythingTeachersNeed")}
                </h2>
                <p className="max-w-xl mx-auto mt-6 text-2xl opacity-90">
                    {t("SaveTimeBoost")}
                </p>
            </div>
        

            {/* TOOL GRID */}
            <section
                className="px-5 py-10 mx-auto"
                style={{ maxWidth: `${maxXSize}px` }}
            >
                <div className="mb-12 text-center">
                    <h3 className="mb-3 text-4xl font-bold text-foreground">
                        {t("ToolsTitle")}
                    </h3>
                    <p className="text-gray-500 text-xl">
                        {t("FindAllNecessaryTools")}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <ToolCard
                        title="SeatMatch"
                        description={t("SeatMatchDescription")}
                        href="/seatmatch"
                        Icon={Presentation}
                    />

                    <ToolCard
                        title="Group Generator"
                        description={t("GroupGenDescription")}
                        href="/group-generator"
                        Icon={LibraryBig}
                    />

                    <ToolCard
                        title="Class Management"
                        description={t("ClassManagementDescriptionToolsOverview")}
                        href="/class-management"
                        Icon={Users}
                    />

                    <ToolCard
                        title="Lesson Countdown"
                        description={t("CountdownDescription")}
                        href="/lesson-countdown"
                        Icon={Clock}
                    />
                </div>
            </section>    
            <footer className="bg-linear-to-br from-blue-500 to-green-500 relative text-white py-6">
                <div className="px-10">
                    <div className="flex flex-row justify-between">
                        <p className="text-sm sm:text-base">
                            &copy; {year} LessonGear. All rights reserved.
                        </p>
                        <Link to={"/license"}>license</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

type ValueProps = {
  title: string;
  text: string;
};

function Value({ title, text }: ValueProps) {
  return (
    <div className="p-6 text-center bg-white rounded-lg shadow">
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="mt-2 text-gray-600">{text}</p>
    </div>
  );
}

export default Home;