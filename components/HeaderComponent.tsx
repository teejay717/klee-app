export default function Header() {
return (
    <header className="border-b border-border bg-card">
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
            <p className="text-sm text-muted-foreground">Welcome back! Here's your apartment overview.</p>
        </div>
        </div>
    </div>
    </header>
)
}

