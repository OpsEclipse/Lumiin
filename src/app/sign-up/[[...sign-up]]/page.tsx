import { SignUp } from "@clerk/nextjs";

export default function SignUpPage(): React.ReactElement {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: "bg-primary hover:bg-primary/90",
            card: "bg-card border border-border",
            headerTitle: "text-foreground",
            headerSubtitle: "text-muted-foreground",
            socialButtonsBlockButton: "border-border",
            formFieldLabel: "text-foreground",
            formFieldInput: "bg-background border-border text-foreground",
            footerActionLink: "text-primary hover:text-primary/90",
          },
        }}
      />
    </main>
  );
}
