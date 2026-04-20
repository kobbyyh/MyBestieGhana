import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { mockJobs } from "@/lib/mock-data";
import { ApplyDialog } from "./apply-dialog";

export default function JobsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold">Jobs</h1>
        <p className="text-sm text-muted-foreground">
          Find jobs and apply. Employers can manage postings from the vendor dashboard (basic).
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {mockJobs.map((j) => (
          <Card key={j.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold">{j.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {j.company} · {j.location}
                  </div>
                </div>
                <Badge variant="secondary">{j.type.replace("_", " ")}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">{j.description}</div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">Job ID: {j.id}</div>
                <ApplyDialog jobId={j.id} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

