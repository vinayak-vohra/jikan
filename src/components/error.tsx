"use client";
import { AlertTriangleIcon, HouseIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

type ErrorPageProps = {
  message?: string;
};

export default function ErrorPage({
  message = "Something went wrong.",
}: ErrorPageProps) {
  return (
    <Card className="w-full max-w-lg border-none shadow-none">
      <CardHeader className="flex flex-col items-center gap-3">
        <div className="p-3 rounded-full bg-red-100 text-red-500">
          <AlertTriangleIcon className="size-8" />
        </div>
        <CardTitle className="text-xl">{message}</CardTitle>
      </CardHeader>
      <CardContent className="px-7 flex w-full justify-evenly">
        <Button variant="outline" asChild>
          <Link href="/">
            <HouseIcon className="size-4 mr-1" />
            Back to Home
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
