import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Header />
      <main>{children}</main>
      <Footer />
    </AuthGuard>
  );
}
