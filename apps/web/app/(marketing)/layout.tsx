// apps/web/app/(marketing)/layout.tsx
import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { AiAssistantWidget } from "@/components/marketing/ai-assistant-widget";
import { CartDrawer } from "@/components/store/cart-drawer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="aurora">
        <span />
        <span />
        <span />
      </div>
      <Nav />
      <main className="pt-16">{children}</main>
      <Footer />
      <AiAssistantWidget />
      <CartDrawer />
    </>
  );
}
