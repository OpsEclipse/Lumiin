import { Buildings, Brain, Lightning, Fingerprint, ArrowsClockwise } from "@phosphor-icons/react";

export function SocialProof(): React.ReactElement {
  const companies = [
    { name: "DesignCo", icon: <Buildings size={24} weight="light" /> },
    { name: "MindSet", icon: <Brain size={24} weight="light" /> },
    { name: "BoltShift", icon: <Lightning size={24} weight="light" /> },
    { name: "SecureNet", icon: <Fingerprint size={24} weight="light" /> },
    { name: "Loop", icon: <ArrowsClockwise size={24} weight="light" />, hidden: true },
  ];

  return (
    <section className="py-10 border-y border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm uppercase tracking-widest text-muted-foreground mb-8">
          Empowering teams at innovative companies
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center justify-items-center opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {companies.map((company) => (
            <div
              key={company.name}
              className={`text-xl font-light text-foreground flex items-center gap-2 ${
                company.hidden ? "hidden lg:flex" : ""
              }`}
            >
              {company.icon}
              {company.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
