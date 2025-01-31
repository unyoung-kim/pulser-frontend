'use client';

import { useState } from 'react';
import { Activity, Gift, Linkedin, Search, Twitter, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (source: string, referralCode: string) => void;
}

export default function SurveyModal({ isOpen, onClose, onConfirm }: SurveyModalProps) {
  const [referralCode, setReferralCode] = useState('');
  const [source, setSource] = useState('');

  const handleConfirm = () => {
    if (!source) {
      return; // Don't allow confirmation without source
    }
    onConfirm(source, referralCode);
  };

  // Disable the close button if no source is selected
  const handleClose = () => {
    if (source) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-indigo-600" />
              <DialogTitle className="text-2xl font-bold">Welcome to Pulser!</DialogTitle>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-6">
          <p className="text-gray-600">We&apos;d love to know how you found us.</p>

          {/* Survey Section */}
          <div className="space-y-4">
            <Label className="text-base font-medium">How did you find Pulser?</Label>
            <RadioGroup value={source} onValueChange={setSource} className="space-y-1">
              <Label
                htmlFor="linkedin"
                className="flex cursor-pointer items-center space-x-2 rounded-lg border-2 border-transparent p-3 transition-colors hover:border-gray-200"
              >
                <RadioGroupItem value="linkedin" id="linkedin" />
                <div className="flex items-center gap-2">
                  <Linkedin className="h-5 w-5 text-[#0A66C2]" />
                  <span>LinkedIn</span>
                </div>
              </Label>

              <Label
                htmlFor="google"
                className="flex cursor-pointer items-center space-x-2 rounded-lg border-2 border-transparent p-3 transition-colors hover:border-gray-200"
              >
                <RadioGroupItem value="google" id="google" />
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-[#4285F4]" />
                  <span>Google Search</span>
                </div>
              </Label>

              <Label
                htmlFor="x"
                className="flex cursor-pointer items-center space-x-2 rounded-lg border-2 border-transparent p-3 transition-colors hover:border-gray-200"
              >
                <RadioGroupItem value="x" id="x" />
                <div className="flex items-center gap-2">
                  <Twitter className="h-5 w-5" />
                  <span>X (Twitter)</span>
                </div>
              </Label>

              <Label
                htmlFor="friend"
                className="flex cursor-pointer items-center space-x-2 rounded-lg border-2 border-transparent p-3 transition-colors hover:border-gray-200"
              >
                <RadioGroupItem value="friend" id="friend" />
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  <span>From a friend</span>
                </div>
              </Label>

              <Label
                htmlFor="other"
                className="flex cursor-pointer items-center space-x-2 rounded-lg border-2 border-transparent p-3 transition-colors hover:border-gray-200"
              >
                <RadioGroupItem value="other" id="other" />
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">
                    <span className="text-sm">?</span>
                  </div>
                  <span>Other</span>
                </div>
              </Label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Have a Referral Code?</span>
            </div>
            <Input
              placeholder="ENTER CODE"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="border-2"
            />
            <p className="text-sm font-medium text-green-600">
              Use a referral code and get 20% more credits for your lifetime!
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose} disabled={!source}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!source}>
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
