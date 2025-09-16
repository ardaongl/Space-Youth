import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users2, ArrowRight } from "lucide-react";

const workshops = [
  {
    id: 1,
    title: "UX Research Fundamentals",
    description: "Learn essential UX research methods and techniques to better understand your users.",
    date: "2024-03-20T15:00:00Z",
    duration: "2 hours",
    instructor: "Emily Parker",
    participants: 45,
    maxParticipants: 50,
    category: "UX",
  },
  {
    id: 2,
    title: "Product Strategy Workshop",
    description: "Develop effective product strategies and roadmaps for your digital products.",
    date: "2024-03-22T14:00:00Z",
    duration: "3 hours",
    instructor: "Michael Ross",
    participants: 28,
    maxParticipants: 30,
    category: "PM",
  },
  // Add more workshops
];

export default function Workshops() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Workshops</h1>
            <p className="mt-1 text-muted-foreground">
              Join live workshops and enhance your skills
            </p>
          </div>

          <div className="grid gap-6">
            {workshops.map((workshop) => (
              <div
                key={workshop.id}
                className="rounded-xl border bg-card overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {workshop.category}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          with {workshop.instructor}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold">{workshop.title}</h3>
                      <p className="text-muted-foreground">
                        {workshop.description}
                      </p>
                    </div>
                    <Button>
                      Join Workshop
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(workshop.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{workshop.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users2 className="h-4 w-4" />
                      <span>
                        {workshop.participants}/{workshop.maxParticipants} participants
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
