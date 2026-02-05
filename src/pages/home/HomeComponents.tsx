import { Link } from "react-router";
import type { LucideIcon } from "lucide-react"

type ToolCardProps = {
  title: string;
  description: string;
  href: string;
  Icon: LucideIcon
};

export function ToolCard({
  title,
  description,
  href,
  Icon
}: ToolCardProps) {
  return (
    <Link
      to={href}
      className="hover:cursor-pointer"
    >
      <div
        className="flex flex-col items-center flex-[0_1_calc(33.33%-20px)] box-border
               mb-5 rounded-[15px] bg-card p-7.5 text-center border-3 dark:border-gray-800 border-gray-200
               shadow-[0_0_20px_rgba(0,0,0,0.1)]
               h-60
               transition-transform duration-300 ease-in-out hover:scale-105"
      >
        <Icon size={80} strokeWidth={1.5} className="text-foreground"/>
        <h4 className="text-[200%] font-normal text-primary">
          {title}
        </h4>
        <p className="text-[16px] leading-normal text-muted-foreground">
          {description}
        </p>
      </div>
    </Link>
  );
}