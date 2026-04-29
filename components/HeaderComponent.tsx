interface HeaderProps {
    title: string,
    description: string,
    children?: React.ReactNode
}

export default function HeaderComponent({title, description, children} : HeaderProps) {
return (
    <header className="border-b border-border bg-card">
    <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {children && <div>{children}</div>}
        </div>
    </div>
    </header>
)
}

