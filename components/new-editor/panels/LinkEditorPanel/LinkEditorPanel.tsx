import { Button } from "@/components/ui/Button-editor";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabaseClient";
import { getPathFromURL } from "@/lib/url";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

export type LinkEditorPanelProps = {
  initialUrl?: string;
  initialOpenInNewTab?: boolean;
  onSetLink: (url: string, openInNewTab?: boolean) => void;
};

export const useLinkEditorState = ({
  initialUrl,
  initialOpenInNewTab,
  onSetLink,
}: LinkEditorPanelProps) => {
  const [url, setUrl] = useState(initialUrl || "");
  const [openInNewTab, setOpenInNewTab] = useState(
    initialOpenInNewTab || false
  );
  const [searchTerm, setSearchTerm] = useState("");

  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const { data: internalLinks } = useQuery({
    queryKey: ["internalLinks", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from("InternalLink")
        .select("*")
        .eq("project_id", projectId);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!projectId,
  });

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  }, []);

  const isValidUrl = useMemo(() => /^(\S+):(\/\/)?\S+$/.test(url), [url]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isValidUrl) {
        onSetLink(url, openInNewTab);
      }
    },
    [url, isValidUrl, openInNewTab, onSetLink]
  );

  return {
    url,
    setUrl,
    openInNewTab,
    setOpenInNewTab,
    onChange,
    handleSubmit,
    isValidUrl,
    searchTerm,
    setSearchTerm,
    internalLinks,
  };
};

export const LinkEditorPanel = ({
  onSetLink,
  initialOpenInNewTab,
  initialUrl,
}: LinkEditorPanelProps) => {
  const state = useLinkEditorState({
    onSetLink,
    initialOpenInNewTab,
    initialUrl,
  });

  const filteredLinks = state.internalLinks?.filter(
    (link) =>
      link.summary.toLowerCase().includes(state.url.toLowerCase()) ||
      link.url.toLowerCase().includes(state.url.toLowerCase())
  );

  return (
    <Card className="w-full max-w-[425px]">
      <CardContent className="space-y-3 mt-4">
        <div className="space-y-2">
          <Label htmlFor="url-input" className="font-bold">
            URL
          </Label>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2">
              <Icon
                name="Link"
                className="absolute ml-3 text-muted-foreground"
              />
              <Input
                id="url-input"
                type="url"
                className="pl-10"
                placeholder="Enter URL or search internal links..."
                value={state.url}
                onChange={state.onChange}
              />
            </div>
            <Button
              variant="primary"
              buttonSize="small"
              type="submit"
              disabled={!state.isValidUrl}
              onClick={state.handleSubmit}
            >
              Set Link
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="new-tab"
            checked={state.openInNewTab}
            onCheckedChange={state.setOpenInNewTab}
          />
          <Label htmlFor="new-tab">Open in new tab</Label>
        </div>

        <div>
          <Label htmlFor="url-input" className="font-bold">
            Internal Links
          </Label>
        </div>
        <ScrollArea className="h-[200px] w-full rounded-md border">
          <div className="p-1 space-y-2">
            {filteredLinks?.map((link) => (
              <Button
                key={link.id}
                variant="ghost"
                className="w-full justify-start group"
                onClick={() => onSetLink(link.url, state.openInNewTab)}
              >
                <Icon name="Link" className="h-4 w-4 mr-1 flex-shrink-0" />
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="font-bold text-indigo-600">
                    {getPathFromURL(link.url)}
                  </span>

                  {link.summary && (
                    <span
                      className="text-xs text-muted-foreground truncate w-full group-hover:whitespace-normal group-hover:text-wrap font-normal"
                      title={link.summary}
                    >
                      {link.summary}
                    </span>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
