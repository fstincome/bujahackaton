import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <p className="mt-4 text-muted-foreground">Page introuvable.</p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Une erreur est survenue</h1>
        <p className="mt-2 text-sm text-muted-foreground">Veuillez réessayer.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >Réessayer</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BTC Hackathon Bujumbura — Free Tech Institute × Vexl" },
      { name: "description", content: "Deux hackathons Bitcoin P2P à Bujumbura. Workshops, Lightning Network, Vexl. 5-6 juin 2026." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <SiteNav />
      <Outlet />
      <SiteFooter />
      <Toaster theme="dark" />
    </QueryClientProvider>
  );
}

function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-mono text-sm font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">₿</span>
          <span>BTC<span className="text-primary">.hack</span>.bi</span>
        </Link>
        <div className="hidden items-center gap-8 text-sm md:flex">
          <Link to="/" hash="program" className="text-muted-foreground hover:text-foreground">Programme</Link>
          <Link to="/" hash="schedule" className="text-muted-foreground hover:text-foreground">Calendrier</Link>
          <Link to="/" hash="trainers" className="text-muted-foreground hover:text-foreground">Formateurs</Link>
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
        </div>
        <Link to="/register" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          ⚡ S'inscrire
        </Link>
      </nav>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/30 mt-20">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted-foreground">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="font-mono font-bold text-foreground">BTC.hack.bi</div>
            <p className="mt-2">Free Tech Institute × Vexl<br/>Bujumbura, Burundi</p>
          </div>
          <div>
            <div className="font-semibold text-foreground">Contact</div>
            <p className="mt-2">Barakana Guy Eudes<br/>barakanaguyeudes@gmail.com<br/>+257 62 86 76 52</p>
          </div>
          <div>
            <div className="font-semibold text-foreground">Partenaires</div>
            <p className="mt-2">Vexl — P2P Bitcoin trading<br/>Free Tech Institute</p>
          </div>
        </div>
        <div className="mt-8 border-t border-border/60 pt-6 text-xs">© 2026 Free Tech Institute. Peer-to-Peer Bitcoin Educational Program.</div>
      </div>
    </footer>
  );
}
