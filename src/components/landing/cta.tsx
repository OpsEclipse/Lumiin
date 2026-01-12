"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CTA(): React.ReactElement {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // TODO: Implement email submission
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <section className="py-24 bg-card relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl uppercase tracking-widest font-light text-foreground mb-6">
          Ready to master your focus?
        </h2>
        <p className="text-xl text-muted-foreground mb-10">
          Join thousands of developers, designers, and writers who use Lumiin to
          stay healthy and productive.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto"
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 py-6"
            placeholder="Enter your email address"
            required
          />
          <Button
            type="submit"
            size="lg"
            className="px-8 py-6 shadow-lg shadow-primary/25"
          >
            Get Early Access
          </Button>
        </form>

        <p className="mt-4 text-xs text-muted-foreground">
          No credit card required. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
