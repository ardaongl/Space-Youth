import AppLayout from "@/components/layout/AppLayout";

export default function JobBoard() {
  return (
    <AppLayout>
      <div className="h-[calc(100vh-4rem)] w-full flex items-center justify-center text-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Job Board</h1>
          <p className="text-lg text-muted-foreground">Coming soon</p>
        </div>
      </div>
    </AppLayout>
  );
}
