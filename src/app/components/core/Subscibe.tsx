"use client";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setCloseSubscribeDialog } from "@/lib/redux/slices/subscribeSlices";
import { useClerk } from "@clerk/nextjs";
import React from "react";

const SubscribeDialog = () => {
  const { openDialog } = useAppSelector((state) => state.subscribe);
  const dispatch = useAppDispatch();
  // const clerk = useClerk();

  if (!openDialog) return null;

  return (
    <Dialog open={openDialog}>
      <DialogContent className="rounded-3xl border-none py-10 px-8 bg-gray-900 flex flex-col justify-center text-center items-center">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">
            Premium Subscription
          </DialogTitle>
          <DialogDescription className="text-xl">
            Join our premium subscription to enjoy exclusive content.
          </DialogDescription>
        </DialogHeader>
        <CardContent className="py-4">
          <div className="grid gap-4">
            <h2 className="text-2xl font-bold">Benefits:</h2>
            <ul className="list-disc list-inside text-lg font-bold text-left">
              <li>Access to premium content</li>
              <li>Ad-free browsing</li>
              <li>Priority customer support</li>
            </ul>
          </div>
        </CardContent>
        <DialogFooter>
          <DialogClose
            asChild
            onClick={() => dispatch(setCloseSubscribeDialog())}
          >
            <Button variant="outline">Decline</Button>
          </DialogClose>
          <Button>Sign In With Google</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscribeDialog;
