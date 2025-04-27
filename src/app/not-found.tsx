import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="flex items-center justify-center gap-2">
          <Building2 className="h-10 w-10" />
          <h1 className="text-3xl font-bold">Vendor Flow</h1>
        </div>

        <div className="p-1 rounded-full bg-secondary inline-flex items-center justify-center">
          <p className="text-7xl font-bold py-6 px-8">404</p>
        </div>

        <h2 className="text-2xl font-semibold">Page Not Found</h2>

        <p className="text-muted-foreground">
          The resource you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <div className="pt-4">
          <Link href="/">
            <Button className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
