"use client";
import { AlertTriangleIcon, HouseIcon, RotateCwIcon } from "lucide-react";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

type ErrorCardProps = {
  title?: string;
  message?: string;
  refetch?: ReturnType<typeof useQuery>["refetch"];
};

export default function ErrorCard({
  title = "Something went wrong",
  message = "An error occurred while fetching data",
  refetch,
}: ErrorCardProps) {
  return (
    <Card className="w-full mx-auto max-w-xl border-none shadow-none">
      <CardHeader className="">
        <div className="w-full flex items-center gap-4">
          <div className="p-3 border border-destructive rounded-full bg-destructive/10">
            <AlertTriangleIcon className="size-8 text-red-500" />
          </div>
          <div className="flex flex-col gap-2">
            <CardTitle className="text-destructive">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
        {refetch && (
          <Button
            size="sm"
            className="ml-auto"
            onClick={() => refetch()}
            variant="outline"
          >
            <RotateCwIcon className="size-4 mr-1" />
            Retry
          </Button>
        )}
        {!refetch && (
          <Button size="sm" className="ml-auto" variant="outline" asChild>
            <Link href="/">
              <HouseIcon className="size-4 mr-1" />
              Back to Home
            </Link>
          </Button>
        )}
      </CardHeader>
    </Card>
  );
}
