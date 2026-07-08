export function AppContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-120 w-90 rounded-xl bg-surface border border-border">
            {children}
        </div>
    );
}
