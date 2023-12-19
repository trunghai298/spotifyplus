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
  const clerk = useClerk();

  if (!openDialog) return null;

  return (
    <Dialog open={openDialog}>
      <DialogClose onClick={() => dispatch(setCloseSubscribeDialog())}>
        <DialogContent className="rounded-3xl border-none p-8 bg-gray-900 flex flex-col justify-center text-center items-center">
          <DialogHeader>
            <DialogTitle>Premium Subscription</DialogTitle>
            <DialogDescription>
              Join our premium subscription to enjoy exclusive content.
            </DialogDescription>
          </DialogHeader>
          <CardContent className="py-4">
            <div className="grid gap-4">
              <h2 className="text-2xl font-bold">Benefits:</h2>
              <ul className="list-disc list-inside text-lg text-gray-500">
                <li>Access to premium content</li>
                <li>Ad-free browsing</li>
                <li>Priority customer support</li>
              </ul>
            </div>
          </CardContent>
          <DialogFooter>
            <Button variant="outline">Decline</Button>
            <Button onClick={() => clerk.openSignIn({ path: "/sign-in" })}>
              Sign In With Google
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogClose>
    </Dialog>
  );
};

export default SubscribeDialog;
