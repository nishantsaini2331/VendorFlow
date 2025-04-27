"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Pencil, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { Vendor } from "./vendor-schema";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface VendorListProps {
  initialVendors: Vendor[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
}

export function VendorList({
  initialVendors,
  totalItems,
  currentPage,
  pageSize,
}: VendorListProps) {
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const totalPages = Math.ceil(totalItems / pageSize);

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.bankAccountNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (id: string) => {
    setVendorToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!vendorToDelete) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/vendors/${vendorToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete vendor");
      }

      setVendors((prev) =>
        prev.filter((vendor) => vendor.id !== vendorToDelete)
      );
      toast("Vendor deleted", {
        description: "The vendor has been deleted successfully.",
      });
    } catch (error) {
      console.error(error);
      toast("Error", {
        description: "Something went wrong while deleting the vendor.",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteAlertOpen(false);
      setVendorToDelete(null);
      router.refresh();
    }
  };

  const renderPaginationLinks = () => {
    const items = [];

    items.push(
      <PaginationItem key="prev">
        <PaginationLink
          href={currentPage > 1 ? `/vendors?page=${currentPage - 1}` : "#"}
          className={currentPage === 1 ? "w-fit py-1 px-1" : " pr-4"}
        >
          Previous
        </PaginationLink>
      </PaginationItem>
    );

    if (currentPage > 3) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink href={`/vendors?page=1`}>1</PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 4) {
        items.push(<PaginationEllipsis key="ellipsis1" />);
      }
    }

    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={`/vendors?page=${i}`}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) {
        items.push(<PaginationEllipsis key="ellipsis2" />);
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink href={`/vendors?page=${totalPages}`}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    items.push(
      <PaginationItem key="next">
        <PaginationLink
          href={
            currentPage < totalPages ? `/vendors?page=${currentPage + 1}` : "#"
          }
          className={currentPage >= totalPages ? "" : ""}
        >
          Next
        </PaginationLink>
      </PaginationItem>
    );

    return items;
  };

  return (
    <div className="mx-auto p-4">
      <Card className="shadow-md animate-in fade-in-50 duration-500">
        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center pb-2">
          <div>
            <CardTitle>Vendors</CardTitle>
            <CardDescription className="mt-1">
              Manage your vendor information
            </CardDescription>
          </div>
          <Link href="/vendors/create" className="mt-4 sm:mt-0">
            <Button className="w-full sm:w-auto gap-1 hover:scale-[1.02] transition-transform">
              <Plus className="h-4 w-4" />
              Add Vendor
            </Button>
          </Link>
        </CardHeader>
        <Separator />
        <CardContent className="px-2 py-4 sm:px-6">
          <div className="mb-4">
            <Input
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {vendors.length === 0 ? (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted text-muted-foreground mb-4">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium">No vendors found</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                Get started by creating your first vendor
              </p>
              <Link href="/vendors/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vendor
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="border rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor Name</TableHead>
                        <TableHead>Bank Account No.</TableHead>
                        <TableHead>Bank Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVendors.map((vendor) => (
                        <TableRow
                          key={vendor.id}
                          className="transition-colors hover:bg-muted/30"
                        >
                          <TableCell className="font-medium">
                            {vendor.vendorName}
                          </TableCell>
                          <TableCell>{vendor.bankAccountNo}</TableCell>
                          <TableCell>{vendor.bankName}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/vendors/${vendor.id}/edit`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteClick(vendor.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      {renderPaginationLinks()}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent className="max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              vendor from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
