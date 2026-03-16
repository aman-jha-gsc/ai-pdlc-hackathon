import { Card } from "@/components/ui/Card";

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-48 bg-muted rounded-md animate-pulse"></div>
          <div className="h-8 w-32 bg-muted rounded-md animate-pulse"></div>
          <div className="w-[500px] h-[500px] bg-card border-4 border-border rounded-lg animate-pulse"></div>
        </div>
        <div className="w-full lg:w-80">
          <Card className="w-full animate-pulse">
            <div className="p-4 border-b border-border">
              <div className="h-6 w-1/2 bg-muted rounded-md"></div>
            </div>
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-5 w-2/3 bg-muted rounded-md"></div>
                  <div className="h-5 w-1/4 bg-muted rounded-md"></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}