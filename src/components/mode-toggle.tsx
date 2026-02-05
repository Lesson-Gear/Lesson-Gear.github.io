import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider.tsx"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
        type="button"
        onClick={() => {setTheme(theme === "dark" ? "light" : "dark")}}
        className="
            relative inline-flex h-9 w-9 items-center justify-center
            rounded-md
            text-foreground
            hover:bg-accent hover:text-accent-foreground
            transition-colors hover:cursor-pointer
        "
        aria-label="Toggle theme"
        >
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
    </button>
  )
}

export default ModeToggle;