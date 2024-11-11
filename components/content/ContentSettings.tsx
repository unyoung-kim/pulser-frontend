import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PencilIcon, Settings2, Wand2 } from "lucide-react";

interface ContentSettingsProps {
  onNext: () => void;
  initialTitle: string;
  initialKeywords: string[];
}

export default function ContentSettings({
  onNext,
  initialTitle,
  initialKeywords,
}: ContentSettingsProps) {
  return (
    <div className="container mx-auto max-w-5xl">
      <div className="space-y-8">
        {/* Main Content */}
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Blog Title */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <PencilIcon className="h-4 w-4" />
                <Label>Blog Title</Label>
              </div>
              <Input defaultValue={initialTitle} className="max-w-2xl" />
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                <Label>Keywords</Label>
              </div>
              <Input
                defaultValue={initialKeywords.join(", ")}
                className="max-w-xs"
              />
            </div>

            {/* Tone */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                <Label>Tone</Label>
              </div>
              <Select defaultValue="bold">
                <SelectTrigger className="max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Content Sections */}
            {/* <div className="space-y-4 pt-4">
              <div className="border rounded-lg p-4 text-muted-foreground text-sm">
                A Blog Intro will be added here
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Redesigned Tables</h3>
                <h3 className="font-semibold text-lg">Smart Tables</h3>
                <div className="flex items-center gap-2 border rounded-lg p-4">
                  <span className="text-sm text-muted-foreground">Section</span>
                  <h3 className="font-semibold">High-Tech Tables</h3>
                </div>
                <h3 className="font-semibold text-lg">
                  How technology is affecting furniture
                </h3>
              </div>

              <div className="border rounded-lg p-4 text-muted-foreground text-sm">
                A Blog Conclusion will be added here
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                Regenerate All
              </Button>
              <Button variant="outline" className="gap-2">
                <Wand2 className="h-4 w-4" />
                Generate More
              </Button>
            </div>*/}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button variant="outline">← Go back</Button>
          <Button onClick={onNext}>Continue to Editor →</Button>
        </div>
      </div>
    </div>
  );
}
