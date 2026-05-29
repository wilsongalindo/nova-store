import Link from "next/link";
import { PackageSearch } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8"
    >
      <section
        aria-labelledby="not-found-title"
        className="flex w-full max-w-lg flex-col items-center rounded-xl border border-dashed bg-muted/30 px-6 py-16 text-center sm:px-10"
      >
        <div
          className="mb-6 flex size-16 items-center justify-center rounded-full bg-muted"
          aria-hidden="true"
        >
          <PackageSearch className="size-8 text-muted-foreground" />
        </div>

        <p className="mb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          404
        </p>

        <h1
          id="not-found-title"
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Product not found
        </h1>

        <p className="mt-3 max-w-sm text-base text-muted-foreground">
          This product may have been removed, is temporarily unavailable, or the
          link you followed is incorrect.
        </p>

        <Button asChild size="lg" className="mt-8 w-full sm:w-auto">
          <Link href="/">Back to catalog</Link>
        </Button>
      </section>
    </main>
  );
}
