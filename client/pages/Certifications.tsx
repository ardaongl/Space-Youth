import AppLayout from "@/components/layout/AppLayout";
import { Award, Clock, ListChecks } from "lucide-react";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border bg-card shadow-sm ${className}`}>{children}</div>;
}

function CertCard({ title, desc, popular }: { title: string; desc: string; popular?: boolean }) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 pb-0">
        {popular && (
          <span className="inline-block rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 border border-amber-200">Popular</span>
        )}
        <div className="mt-2 aspect-square w-32 mx-auto rounded-full grid place-items-center border bg-secondary">
          <Award className="h-8 w-8 text-primary" />
        </div>
      </div>
      <div className="p-4">
        <div className="text-[10px] font-semibold tracking-widest text-muted-foreground">CERTIFICATION</div>
        <h3 className="mt-1 font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{desc}</p>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary"/> 120m</span>
          <span className="inline-flex items-center gap-1"><ListChecks className="h-3.5 w-3.5 text-primary"/> 80 questions</span>
        </div>
      </div>
    </Card>
  );
}

export default function Certifications() {
  const items = [
    { title: "Product Designer", desc: "Demonstrate your proficiency in fundamental product design principles and practices.", popular: true },
    { title: "UX/UI Designer", desc: "Showcase your expertise in fundamental techniques and strategies across both UX and UI.", popular: true },
    { title: "UX Designer", desc: "Demonstrate your competency in key UX methodologies and best practices.", popular: true },
    { title: "Interaction Designer", desc: "Validate your skills creating intuitive, efficient interactions and flows." },
    { title: "Design Systems", desc: "Prove mastery in creating scalable, consistent design systems." },
    { title: "Research Methods", desc: "Show you can select, conduct, and synthesize the right research methods." },
  ];
  return (
    <AppLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold">Certifications</h1>
        <p className="text-muted-foreground mt-1 max-w-3xl">Take the next step in your career and stand out from the crowd with industry-accredited certifications for in-demand product roles.</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((it) => (
            <CertCard key={it.title} {...it} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
