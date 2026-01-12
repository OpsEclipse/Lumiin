"use client";

import Link from "next/link";
import { CheckCircle, Circle } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
  badge?: string;
}

const tiers: PricingTier[] = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    description: "Get started with basic focus tracking",
    features: [
      "Basic Posture Alerts",
      "1 Hour Session Limit",
      "Weekly Summary",
    ],
    cta: "Get Started",
  },
  {
    name: "Professional",
    price: "$12",
    period: "/mo",
    description: "For serious deep workers",
    features: [
      "Everything in Starter",
      "Unlimited Sessions",
      "FocusGlow™ Analytics",
      "Posture Trends",
    ],
    cta: "Start 14-Day Free Trial",
    featured: true,
    badge: "Popular",
  },
  {
    name: "Team",
    price: "$29",
    period: "/seat",
    description: "For teams that value wellness",
    features: [
      "Volume Discounts",
      "Team Wellness Reports",
      "SSO & Admin Panel",
    ],
    cta: "Contact Sales",
  },
];

export function Pricing(): React.ReactElement {
  return (
    <section
      className="py-24 bg-background relative overflow-hidden"
      id="pricing"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl uppercase tracking-widest font-light text-foreground mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Invest in your long-term health and productivity.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-0 max-w-5xl mx-auto overflow-hidden border border-border shadow-2xl">
          {tiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`p-8 flex flex-col ${
                tier.featured
                  ? "bg-card relative"
                  : "bg-background"
              } ${
                index === 0
                  ? "border-b lg:border-b-0 lg:border-r border-border"
                  : index === 2
                  ? "border-t lg:border-t-0 lg:border-l border-border"
                  : ""
              }`}
            >
              {/* Featured Gradient Bar */}
              {tier.featured && (
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-secondary" />
              )}

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl uppercase tracking-widest font-light text-foreground">
                  {tier.name}
                </h3>
                {tier.badge && (
                  <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 uppercase tracking-widest">
                    {tier.badge}
                  </Badge>
                )}
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-4xl font-light text-foreground">
                  {tier.price}
                </span>
                <span className="text-muted-foreground">
                  {tier.period}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm mb-6 text-muted-foreground">
                {tier.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center text-sm text-muted-foreground"
                  >
                    {tier.featured ? (
                      <CheckCircle size={20} weight="fill" className="mr-3 text-primary" />
                    ) : (
                      <Circle size={20} weight="fill" className="mr-3 text-muted-foreground" />
                    )}
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                asChild
                variant={tier.featured ? "default" : "outline"}
                className={tier.featured ? "shadow-lg shadow-primary/25" : ""}
              >
                <Link href={tier.name === "Team" ? "#" : "/sign-up"}>
                  {tier.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
