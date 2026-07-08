import { cn } from "../../lib/utils";

export function AppHeader({ children, classname }: { children: React.ReactNode, classname?: string }) {
    return (
        <div className={cn("grid grid-cols-[1fr_auto_1fr] items-center w-full overflow-hidden rounded-t-xl bg-surface-header h-12", classname)}>
            {children}
        </div>
    );
}

export function AppTitle({ title, classname }: { title: string, classname?: string }) {
    return (
        <h1 className={cn("mx-auto text-header-title font-header-title", classname)}>
            {title}
        </h1>
    );
}