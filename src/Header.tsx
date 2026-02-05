import { Outlet, useLocation } from "react-router";
import { Link } from "react-router";
import ModeToggle from "@/components/mode-toggle.tsx";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { LanguageToggle } from "@/languages/LanguageContext.tsx";
import lessonGearLogo from "@/assets/lessonGearLogo.svg";
import lessonGearLogoDark from "@/assets/lessonGearLogoDarkMode.svg"
import { useLanguage } from "@/languages/LanguageContext.tsx";


function Header() {
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <div className={`flex flex-col ${(location.pathname !== "/" && location.pathname !== "/license") ? "h-screen" : ""}`} >
      <header className={`top-0 left-0 right-0 bg-white/90 backdrop-blur-md dark:bg-gray-900/90 border-b z-50 border-gray-200 dark:border-gray-800 ${(location.pathname == "/" || location.pathname == "/license") ? "sticky" : ""}`}>
        <div className="mx-auto px-10 flex items-center justify-between py-1 relative space-x-5">
          {/* logo */}
          <Link
            to="/"
            className="hover:cursor-pointer"
          >
            <img 
              src={lessonGearLogo}
              className="h-15 dark:hidden block"
            />
            <img 
              src={lessonGearLogoDark}
              className="h-15 dark:block hidden p-1"
            />
          </Link>

          {/* desktop */}
          <div className="hidden md:flex w-full space-x-3">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="font-semiboldbold text-md">Tools</NavigationMenuTrigger>
                  <NavigationMenuContent className="dark:bg-gray-800">
                    <ul className="grid w-62.5 gap-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/seatmatch">
                            <div className="font-medium">SeatMatch</div>
                            <div className="text-muted-foreground">
                              {t("seatMatchDescriptionHeader")}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link to="/group-generator">
                            <div className="font-medium">Group Generator</div>
                            <div className="text-muted-foreground">
                              {t("groupGeneratorDescription")}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link to="/lesson-countdown">
                            <div className="font-medium">Lesson Countdown</div>
                            <div className="text-muted-foreground">
                              {t("lessonCountdownDescription")}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link to="/class-management">
                            <div className="font-medium">class management</div>
                            <div className="text-muted-foreground">
                              {t("classManagementDescription")}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="ml-auto mr-0 flex space-x-2">
              <ModeToggle />
              <LanguageToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}

export default Header;