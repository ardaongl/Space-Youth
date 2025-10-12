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
          <span className="inline-block rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 border border-amber-200">Popüler</span>
        )}
        <div className="mt-2 aspect-square w-32 mx-auto rounded-full grid place-items-center border bg-secondary">
          <Award className="h-8 w-8 text-primary" />
        </div>
      </div>
      <div className="p-4">
        <div className="text-[10px] font-semibold tracking-widest text-muted-foreground">SERTİFİKA</div>
        <h3 className="mt-1 font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{desc}</p>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary"/> 120dk</span>
          <span className="inline-flex items-center gap-1"><ListChecks className="h-3.5 w-3.5 text-primary"/> 80 soru</span>
        </div>
      </div>
    </Card>
  );
}

export default function Certifications() {
  const items = [
    { title: "Ürün Tasarımcısı", desc: "Temel ürün tasarımı prensipleri ve uygulamalarında yeterliliğinizi gösterin.", popular: true },
    { title: "UX/UI Tasarımcı", desc: "Hem UX hem de UI alanındaki temel teknikler ve stratejilerdeki uzmanlığınızı sergileyin.", popular: true },
    { title: "UX Tasarımcı", desc: "Temel UX metodolojileri ve en iyi uygulamalardaki yetkinliğinizi gösterin.", popular: true },
    { title: "Etkileşim Tasarımcısı", desc: "Sezgisel ve verimli etkileşimler ve akışlar oluşturma becerilerinizi doğrulayın." },
    { title: "Tasarım Sistemleri", desc: "Ölçeklenebilir, tutarlı tasarım sistemleri oluşturmadaki ustalığınızı kanıtlayın." },
    { title: "Araştırma Yöntemleri", desc: "Doğru araştırma yöntemlerini seçme, yürütme ve sentezleme becerinizi gösterin." },
  ];
  return (
    <AppLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold">Sertifikalar</h1>
        <p className="text-muted-foreground mt-1 max-w-3xl">Kariyerinizde bir sonraki adımı atın ve talep gören ürün rolleri için sektör onaylı sertifikalarla kalabalıktan sıyrılın.</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((it) => (
            <CertCard key={it.title} {...it} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
