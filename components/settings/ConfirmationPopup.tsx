import { AlertTriangle, CheckCircle, CreditCard, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            Confirm Plan Change
          </DialogTitle>
          <DialogDescription>
            Please review the details of your plan change carefully before confirming.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Current Plan:</span>
              <span className="font-semibold">{currentPlan}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">New Plan:</span>
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
          <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900">
            <CheckCircle className="h-4 w-4 text-green-500" />
            What happens next:
          </h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-400" />
              Your account will be billed for the new plan immediately.
            </li>
            <li className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              The new billing cycle will start from today.
            </li>
          </ul>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm Change</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
