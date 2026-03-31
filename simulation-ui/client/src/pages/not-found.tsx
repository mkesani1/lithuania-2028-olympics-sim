import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="bg-card border-card-border max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">🏟️</div>
          <h1 className="text-xl font-bold mb-2">Page Not Found</h1>
          <p className="text-sm text-muted-foreground mb-6">
            This event isn't on the program. Head back to the simulator dashboard.
          </p>
          <Link href="/">
            <Button data-testid="button-go-home" className="bg-primary text-primary-foreground">
              Back to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
