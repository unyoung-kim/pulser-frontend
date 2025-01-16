'use client';

import { Info, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentPlan: string;
  newPlan: string;
  leftoverCredits: number;
  newBillingDate: string;
}

export function ConfirmationPopup({
  isOpen,
  onClose,
  onConfirm,
  currentPlan,
  newPlan,
  leftoverCredits,
  newBillingDate,
}: ConfirmationPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">Confirm Plan</DialogTitle>
          <DialogDescription>
            Please review the details of your plan carefully before confirming.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            {currentPlan !== 'FREE_CREDIT' && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Current Plan:</span>
                <span className="font-semibold">{currentPlan}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                {currentPlan !== 'FREE_CREDIT' && 'New'} Plan:
              </span>
              <span className="font-semibold text-green-600">{newPlan}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Leftover Credits:</span>
              <span className="font-semibold">
                {leftoverCredits} <span className="text-sm text-gray-500">(Will roll over)</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">New Billing Date:</span>
              <span className="font-semibold">{newBillingDate}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <p className="flex items-center gap-2 text-sm text-gray-600">
            <Info className="h-6 w-6 text-gray-400" />
            Your account will be billed for the new plan immediately, and any leftover credits will
            roll over.
          </p>
        </div>
        <div className="mt-6">
          <Label
            htmlFor="referralCode"
            className="flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <Gift className="h-4 w-4 text-blue-500" />
            Have a Referral Code?
          </Label>
          <div className="relative mt-2">
            <Input
              id="referralCode"
              type="text"
              placeholder="Enter Code"
              className="pr-20 uppercase"
              maxLength={6}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
