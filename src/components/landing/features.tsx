import { Eye, Lightning, ChartLineUp } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";

export function Features(): React.ReactElement {
  const steps = [
    {
      number: 1,
      title: "Calibrate",
      description:
        "Spend 30 seconds letting the AI learn your ideal posture and neutral expression.",
      icon: <Eye size={40} weight="light" className="text-primary" />,
    },
    {
      number: 2,
      title: "Focus",
      description:
        "Work deeply with subtle nudges that help you maintain posture and attention without disrupting flow.",
      icon: <Lightning size={40} weight="light" className="text-secondary" />,
    },
    {
      number: 3,
      title: "Review",
      description:
        "Check your FocusGlow dashboard for detailed metrics on focus duration, posture trends, and improvements.",
      icon: <ChartLineUp size={40} weight="light" className="text-primary" />,
    },
  ];

  return (
    <section
      className="py-24 bg-background relative"
      id="features"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl uppercase tracking-widest font-light text-foreground mb-6">
            Seamless Integration with Your Flow
          </h2>
          <p className="text-lg text-muted-foreground">
            Lumiin runs quietly in the background. No wearables to charge, no
            complex setup. Just you and your best work.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting Dashed Line */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent border-t border-dashed border-border z-0" />

          {steps.map((step) => (
            <div key={step.number} className="relative z-10 group">
              <Card className="p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-300 h-full text-center">
                <CardContent className="p-0">
                  {/* Icon Circle */}
                  <div className="w-20 h-20 mx-auto bg-muted shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-border">
                    {step.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl uppercase tracking-widest font-light text-foreground mb-3">
                    {step.number}. {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
