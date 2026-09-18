import { Suspense } from "react";
import { JobsResults } from "@/app/components/jobs/JobsResults";

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <p className="data-state jobs-loading">Henter jobannoncer...</p>
      }
    >
      <JobsResults />
    </Suspense>
  );
}
//Laver en fallback besked der midlertidigt viser, mens jobannoncerne bliver hentet
