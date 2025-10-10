export function Footer() {
    return (
        <footer className="section-padding-x border-t">
            <div className="container mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground md:flex-row">
                <p>
                    © {new Date().getFullYear()} Mira. Semua hak cipta
                    dilindungi.
                </p>
                <p className="text-center md:text-right">
                    {'“Mira — Where Wonder Meets Collaboration.”'}
                </p>
            </div>
        </footer>
    );
}
