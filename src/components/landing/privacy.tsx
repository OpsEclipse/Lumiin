import { CheckCircle } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";

export function Privacy(): React.ReactElement {
  const features = [
    "On-device processing with WebAssembly",
    "GDPR & CCPA Compliant by design",
    "Zero-knowledge architecture",
  ];

  return (
    <section className="py-24 bg-background" id="vision">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image with Glow */}
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 transform rotate-2 blur-xl" />
            <Card className="relative shadow-2xl z-10 overflow-hidden aspect-video">
              <CardContent className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500" />
                    <div className="w-3 h-3 bg-yellow-500" />
                    <div className="w-3 h-3 bg-green-500" />
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">
                    lumiin-dashboard
                  </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div className="bg-muted/50 p-4 border border-border">
                    <div className="text-xs text-muted-foreground mb-2">
                      Today&apos;s Focus
                    </div>
                    <div className="text-2xl font-light text-foreground">4h 32m</div>
                    <div className="text-xs text-success mt-1">+12% vs avg</div>
                  </div>
                  <div className="bg-muted/50 p-4 border border-border">
                    <div className="text-xs text-muted-foreground mb-2">
                      Posture Score
                    </div>
                    <div className="text-2xl font-light text-foreground">92%</div>
                    <div className="text-xs text-success mt-1">Excellent</div>
                  </div>
                  <div className="col-span-2 bg-muted/50 p-4 border border-border">
                    <div className="text-xs text-muted-foreground mb-2">
                      Weekly Trend
                    </div>
                    <div className="flex items-end justify-between h-16 gap-2">
                      {[65, 80, 72, 90, 85, 95, 88].map((height, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-primary to-primary/50"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>Mon</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Text Content */}
          <div className="order-1 lg:order-2">
            <span className="text-secondary uppercase tracking-widest text-sm mb-2 block">
              Privacy First
            </span>
            <h2 className="text-3xl md:text-4xl uppercase tracking-widest font-light text-foreground mb-6">
              Your Data Never Leaves Your Device
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We believe focus tools should enhance your work, not compromise
              your privacy. Lumiin processes everything locally using advanced
              WebAssembly technology.
            </p>

            {/* Checklist */}
            <ul className="space-y-4">
              {features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <CheckCircle size={24} weight="fill" className="text-success mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
