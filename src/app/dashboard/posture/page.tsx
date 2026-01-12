import { DashboardHeader } from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PostureHealthPage(): React.ReactElement {
  return (
    <>
      <DashboardHeader title="Posture Health" />
      <div className="p-8">
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-xl uppercase tracking-widest font-light">
              Posture Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Detailed posture analysis and recommendations coming in v3 with computer vision integration.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
