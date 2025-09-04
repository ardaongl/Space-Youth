import AppLayout from "@/components/layout/AppLayout";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border bg-card shadow-sm ${className}`}>{children}</div>;
}

function Shot({ title }: { title: string }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] w-full bg-secondary" />
      <div className="p-3">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">by Designer</div>
      </div>
    </Card>
  );
}

export default function Showcase() {
  const items = Array.from({ length: 9 }).map((_, i) => `Project ${i + 1}`);
  return (
    <AppLayout>
      <div className="py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Showcase</h1>
          <div className="flex items-center gap-2">
            <button className="rounded-full border px-3 py-1.5 text-sm">Newest</button>
            <button className="rounded-full border px-3 py-1.5 text-sm">Popular</button>
          </div>
        </div>
        <p className="text-muted-foreground mt-1">Explore community projects and submissions from briefs.</p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((t) => (
            <Shot key={t} title={t} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
