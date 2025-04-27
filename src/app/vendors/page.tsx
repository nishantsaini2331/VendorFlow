import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { VendorList } from "@/components/vendors/vendor-list";
import { Navbar } from "@/components/layout/navbar";

interface VendorsPageProps {
  searchParams: {
    page?: string;
    limit?: string;
  };
}

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<VendorsPageProps["searchParams"]>;
}) {
  const resolvedSearchParams = await searchParams;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const page = parseInt(resolvedSearchParams.page || "1");
  const limit = parseInt(resolvedSearchParams.limit || "5");
  const skip = (page - 1) * limit;

  const vendors = await prisma.vendor.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      vendorName: "asc",
    },
    skip,
    take: limit,
  });

  const totalVendors = await prisma.vendor.count({
    where: {
      userId: session.user.id,
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto py-6">
        <VendorList
          initialVendors={JSON.parse(JSON.stringify(vendors))}
          totalItems={totalVendors}
          currentPage={page}
          pageSize={limit}
        />
      </main>
    </div>
  );
}
