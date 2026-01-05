import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
