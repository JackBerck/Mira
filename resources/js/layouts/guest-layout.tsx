import { Footer } from '@/components/footer';
import GuestNavbar from '@/components/navigation-bar/guest';

export default function GuestLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <GuestNavbar />
            {children}
            <Footer />
        </>
    );
}
