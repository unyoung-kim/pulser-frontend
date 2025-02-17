'use client';

import { useState } from 'react';
import { Activity, Check, Gift, Linkedin, Loader2, Search, Twitter, Users } from 'lucide-react';
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

const COUPON_CODE_LIST = new Set([
  'QXD12D',
  'JKT45Z',
  'LNP78X',
  'ZQR34C',
  'XDF91T',
  'VBG63M',
  'PKT29W',
  'TYH84P',
  'WQM57K',
  'NZX32L',
]);

const sources = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: <Linkedin className="h-5 w-5 text-[#0A66C2]" />,
  },
  {
    id: 'google',
    label: 'Google Search',
    icon: <Search className="h-5 w-5 text-[#4285F4]" />,
  },
  { id: 'x', label: 'X (Twitter)', icon: <Twitter className="h-5 w-5" /> },
  {
    id: 'friend',
    label: 'From a friend',
    icon: <Users className="h-5 w-5 text-indigo-600" />,
  },
  {
    id: 'other',
    label: 'Other',
    icon: (
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">?</div>
    ),
  },
];

export default function SurveyModal({ isOpen, onClose, onConfirm }: SurveyModalProps) {
  const [referralCode, setReferralCode] = useState('');
  const [source, setSource] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValidCode, setIsValidCode] = useState<boolean | null>(null);

  const handleConfirm = () => {
    if (!source || isValidCode === false) return;
    onConfirm(source, isValidCode ? referralCode : '');
  };

  const handleClose = () => {
    if (source) onClose();
  };

  const handleReferralCodeChange = (code: string) => {
    setReferralCode(code);

    if (!code.trim()) {
      setIsValidCode(null);
      return;
    }

    setIsValidating(true);

    setTimeout(() => {
      const isValid = COUPON_CODE_LIST.has(code.toUpperCase());
      setIsValidCode(isValid);
      setIsValidating(false);
    }, 500);
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
              {sources.map(({ id, label, icon }) => (
                <Label
                  key={id}
                  htmlFor={id}
                  className="flex cursor-pointer items-center space-x-2 rounded-lg border-2 border-transparent p-3 transition-colors hover:border-gray-200"
                >
                  <RadioGroupItem value={id} id={id} />
                  <div className="flex items-center gap-2">
                    {icon}
                    <span>{label}</span>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Have a Referral Code?</span>
            </div>
            <div className="relative">
              <Input
                placeholder="ENTER CODE"
                value={referralCode}
                onChange={(e) => handleReferralCodeChange(e.target.value)}
                className="pr-10"
                maxLength={6}
              />
              {isValidating && (
                <Loader2 className="absolute right-3 top-2 h-5 w-5 animate-spin text-gray-400" />
              )}
              {isValidCode && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-green-500 p-0.5">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            {isValidCode === false && (
              <p className="text-sm font-medium text-red-600">
                Invalid referral code. Please try again.
              </p>
            )}
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
