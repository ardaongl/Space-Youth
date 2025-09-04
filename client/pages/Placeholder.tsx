import AppLayout from "@/components/layout/AppLayout";

export default function Placeholder({ title }: { title: string }) {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">
          This page will be generated next. Tell me what you want here.
        </p>
      </div>
    </AppLayout>
  );
}
