export default function GuestFooter() {
    return (
        <footer className="section-padding-x border-t bg-background">
            <div className="border-t">
                <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-muted-foreground md:flex-row">
                    <p>
                        © {new Date().getFullYear()} Mira. Semua hak cipta
                        dilindungi.
                    </p>
                    <p className="text-center md:text-right">
                        {'“Mira — Where Wonder Meets Collaboration.”'}
                    </p>
                </div>
            </div>
        </footer>
    );
}
