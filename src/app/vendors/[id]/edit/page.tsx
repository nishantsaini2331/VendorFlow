import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { VendorForm } from "@/components/vendors/vendor-form";
import { Navbar } from "@/components/layout/navbar";

export default async function EditVendorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  const id = (await params).id;
  if (!session) {
    redirect("/login");
  }

  const vendor = await prisma.vendor.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!vendor) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto py-6">
        <VendorForm
          initialData={JSON.parse(JSON.stringify(vendor))}
          isEditing
        />
      </main>
    </div>
  );
}
