import { Card, CardContent } from "@/components/ui/card";

export function FocusGlow(): React.ReactElement {
  return (
    <section className="py-24 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div>
            <span className="text-primary uppercase tracking-widest text-sm mb-2 block">
              FocusGlow™
            </span>
            <h2 className="text-3xl md:text-4xl uppercase tracking-widest font-light text-foreground mb-6">
              Visual Feedback That Guides Without Distracting
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our ambient indicator bar glows subtly to reflect your focus
              state. When you&apos;re in flow, it pulses gently in amber. When
              your posture drifts, it shifts to guide you back—no jarring alerts
              or interruptions.
            </p>

            {/* State Indicator Cards */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Card className="flex-1 p-4 shadow-sm">
                <CardContent className="p-0">
                  <div className="h-2 w-full bg-muted mb-3 overflow-hidden">
                    <div className="h-full bg-secondary w-3/4" />
                  </div>
                  <h4 className="font-medium text-foreground">Flow State</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    High mental engagement
                  </p>
                </CardContent>
              </Card>
              <Card className="flex-1 p-4 shadow-sm">
                <CardContent className="p-0">
                  <div className="h-2 w-full bg-muted mb-3 overflow-hidden">
                    <div className="h-full bg-primary w-1/2" />
                  </div>
                  <h4 className="font-medium text-foreground">Correction</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Gentle posture reminder
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Code Editor Mockup */}
          <div className="relative">
            <Card className="shadow-2xl overflow-hidden">
              <CardContent className="p-0">
                {/* FocusGlow Bar Overlay */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-64 h-2 bg-muted/80 backdrop-blur-md border border-border glow-accent z-20">
                  <div className="w-full h-full bg-secondary opacity-80 animate-pulse" />
                </div>

                {/* Editor Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-muted border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500" />
                    <div className="w-3 h-3 bg-yellow-500" />
                    <div className="w-3 h-3 bg-green-500" />
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">
                    focus-session.ts
                  </div>
                  <div className="w-16" />
                </div>

                {/* Code Content */}
                <div className="p-6 font-mono text-sm">
                  <div className="flex">
                    <span className="text-muted-foreground w-8 select-none">1</span>
                    <span>
                      <span className="text-purple-400">const</span>{" "}
                      <span className="text-blue-400">startSession</span>{" "}
                      <span className="text-foreground">=</span>{" "}
                      <span className="text-purple-400">async</span>{" "}
                      <span className="text-yellow-400">()</span>{" "}
                      <span className="text-foreground">{`=>`}</span>{" "}
                      <span className="text-yellow-400">{`{`}</span>
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-8 select-none">2</span>
                    <span>
                      {"  "}
                      <span className="text-purple-400">await</span>{" "}
                      <span className="text-blue-400">calibrate</span>
                      <span className="text-yellow-400">()</span>
                      <span className="text-foreground">;</span>
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-8 select-none">3</span>
                    <span>
                      {"  "}
                      <span className="text-blue-400">focusGlow</span>
                      <span className="text-foreground">.</span>
                      <span className="text-green-400">enable</span>
                      <span className="text-yellow-400">()</span>
                      <span className="text-foreground">;</span>
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-8 select-none">4</span>
                    <span />
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-8 select-none">5</span>
                    <span>
                      {"  "}
                      <span className="text-muted-foreground">
                        {`// Deep work begins...`}
                      </span>
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-8 select-none">6</span>
                    <span>
                      {"  "}
                      <span className="text-purple-400">while</span>{" "}
                      <span className="text-yellow-400">(</span>
                      <span className="text-blue-400">session</span>
                      <span className="text-foreground">.</span>
                      <span className="text-green-400">active</span>
                      <span className="text-yellow-400">)</span>{" "}
                      <span className="text-yellow-400">{`{`}</span>
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-8 select-none">7</span>
                    <span>
                      {"    "}
                      <span className="text-purple-400">await</span>{" "}
                      <span className="text-blue-400">track</span>
                      <span className="text-yellow-400">(</span>
                      <span className="text-orange-400">&apos;posture&apos;</span>
                      <span className="text-yellow-400">)</span>
                      <span className="text-foreground">;</span>
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-8 select-none">8</span>
                    <span>
                      {"    "}
                      <span className="text-purple-400">await</span>{" "}
                      <span className="text-blue-400">track</span>
                      <span className="text-yellow-400">(</span>
                      <span className="text-orange-400">&apos;focus&apos;</span>
                      <span className="text-yellow-400">)</span>
                      <span className="text-foreground">;</span>
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-8 select-none">9</span>
                    <span>
                      {"  "}
                      <span className="text-yellow-400">{`}`}</span>
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-8 select-none">10</span>
                    <span>
                      <span className="text-yellow-400">{`}`}</span>
                      <span className="text-foreground">;</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
