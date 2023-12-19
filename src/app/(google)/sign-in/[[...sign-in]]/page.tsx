"use client";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <Dialog open>
      <DialogClose onClick={() => router.push("/")}>
        <DialogContent className="rounded-3xl border-none p-8 flex flex-col justify-center text-center items-center">
          <SignIn />
        </DialogContent>
      </DialogClose>
    </Dialog>
  );
}
