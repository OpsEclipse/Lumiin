"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SessionPage(): React.ReactElement {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center px-6 pt-16">
        <div className="w-full max-w-3xl border border-border bg-card p-8">
          <h1 className="text-2xl font-semibold uppercase tracking-widest">
            Focus Session
          </h1>
          <p className="mt-2 text-muted-foreground">
            This is a placeholder. Calibration and real-time tracking will be
            added in v3.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <SessionPreset duration={25} label="Pomodoro" />
            <SessionPreset duration={50} label="Standard" />
            <SessionPreset duration={90} label="Deep Work" />
          </div>

          <div className="mt-8 border border-border bg-muted/50 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Webcam preview will appear here after calibration is implemented
            </p>
            <div className="mt-4 aspect-video w-full bg-background" />
          </div>

          <div className="mt-8 flex justify-center">
            <Button asChild variant="outline">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}

function SessionPreset({
  duration,
  label,
}: {
  duration: number;
  label: string;
}): React.ReactElement {
  return (
    <button className="border border-border bg-muted/50 p-4 text-center transition-colors hover:border-primary hover:bg-accent">
      <div className="text-2xl font-semibold">{duration}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </button>
  );
}
