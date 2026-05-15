"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      className="bg-green-300 p-5 rounded-4xl mt-5 hover:border-2"
      onClick={() => router.push("/convert")}
    >
      Go Back
    </Button>
  );
}
