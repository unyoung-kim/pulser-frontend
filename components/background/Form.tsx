'use client';

import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Building2,
  ChevronRight,
  FileText,
  Globe,
  Lightbulb,
  Link as LinkIcon,
  Loader2,
  MessageSquare,
  Package,
  Pencil,
  PlusCircle,
  Sparkles,
  Star,
  Tags,
  Target,
  Trash2,
  Trophy,
  Users,
} from 'lucide-react';
import { z } from 'zod';
import { AddInternalLinkDialog } from '@/components/background/AddInternalLinkDialog';
import { EditInternalLinkDialog } from '@/components/background/EditInternalLinkDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea2';
import { useToast } from '@/hooks/use-toast';
import { useAddInternalLink } from '@/lib/apiHooks/background/useAddInternalLink';
import { useDeleteInternalLink } from '@/lib/apiHooks/background/useDeleteInternalLink';
import { useFindInternalLinks } from '@/lib/apiHooks/background/useFindInternalLinks';
import { useGetInternalLinks } from '@/lib/apiHooks/background/useGetInternalLinks';
import { useGetKnowledgeBase } from '@/lib/apiHooks/background/useGetKnowledgeBase';
import { useUpdateBackground } from '@/lib/apiHooks/background/useUpdateBackground';
import { useUpdateInternalLink } from '@/lib/apiHooks/background/useUpdateInternalLink';
import { supabase } from '@/lib/supabaseClient';
import { getPathFromURL } from '@/lib/url';
import { cn } from '@/lib/utils';
import { AutofillDialog } from './AutofillDialog';
import { Separator } from '../ui/separator';

export const BackgroundSchema2 = z.object({
  basic: z.object({
    companyName: z.string().nullish(),
    companyUrl: z.string().nullish(),
    industryKeywords: z.string().nullish(),
    companyFunction: z.string().nullish(),
    // logo: z.string().nullish(),
    // brandColor: z.string().nullish(),
    additionalInfo: z.record(z.string()).optional(),
  }),
  product: z.object({
    valueProposition: z.string().nullish(),
    products: z.string().nullish(),
    competitiveAdvantage: z.string().nullish(),
    additionalInfo: z.record(z.string()).optional(),
  }),
  audience: z.object({
    painPoints: z.string().nullish(),
    customerProfile: z.string().nullish(),
    additionalInfo: z.record(z.string()).optional(),
  }),
  socialProof: z.object({
    testimonials: z.string().nullish(),
    caseStudies: z.string().nullish(),
    achievements: z.string().nullish(),
    additionalInfo: z.record(z.string()).optional(),
  }),
});

const tabs = [
  {
    id: 'basic',
    icon: Building2,
    label: 'Basic Information',
    required: true,
  },
  { id: 'product', icon: Package, label: 'Product Details' },
  { id: 'audience', icon: Users, label: 'Audience' },
  { id: 'socialProof', icon: Star, label: 'Social Proof' },
  {
    id: 'internalLinks',
    icon: Globe,
    label: 'Internal Links',
    required: true,
  },
];

export default function BackgroundForm2({ projectId }: { projectId: string }) {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<z.infer<typeof BackgroundSchema2>>({
    basic: {
      companyName: '',
      companyUrl: '',
      industryKeywords: '',
      companyFunction: '',
      // logo: "",
      // brandColor: "#6366F1",
    },
    product: { valueProposition: '', products: '', competitiveAdvantage: '' },
    audience: { painPoints: '', customerProfile: '' },
    socialProof: { testimonials: '', caseStudies: '', achievements: '' },
  });
  const [domain, setDomain] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isAutofillDialogOpen, setIsAutofillDialogOpen] = useState(false);
  const [isAddLinkDialogOpen, setIsAddLinkDialogOpen] = useState(false);
  const [isEditLinkDialogOpen, setIsEditLinkDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<{
    id: string;
    url: string;
    summary?: string;
  } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useGetKnowledgeBase(projectId);
  const { data: internalLinks, isLoading: isLoadingLinks } = useGetInternalLinks(projectId);
  const { mutate: updateBackground } = useUpdateBackground(projectId);
  const { mutate: findInternalLinks, isPending: isFindingLinks } = useFindInternalLinks(projectId);
  const addInternalLinkMutation = useAddInternalLink(projectId);
  const updateInternalLinkMutation = useUpdateInternalLink(projectId);
  const deleteInternalLinkMutation = useDeleteInternalLink(projectId);

  useEffect(() => {
    if (project?.background) {
      setFormData({
        basic: {
          companyName: project.background.basic?.companyName || '',
          companyUrl: project.background.basic?.companyUrl || '',
          industryKeywords: project.background.basic?.industryKeywords || '',
          companyFunction: project.background.basic?.companyFunction || '',
          // logo: project.background.basic?.logo || "",
          // brandColor: project.background.basic?.brandColor || "#6366F1",
        },
        product: {
          valueProposition: project.background.product?.valueProposition || '',
          products: project.background.product?.products || '',
          competitiveAdvantage: project.background.product?.competitiveAdvantage || '',
        },
        audience: {
          painPoints: project.background.audience?.painPoints || '',
          customerProfile: project.background.audience?.customerProfile || '',
        },
        socialProof: {
          testimonials: project.background.socialProof?.testimonials || '',
          caseStudies: project.background.socialProof?.caseStudies || '',
          achievements: project.background.socialProof?.achievements || '',
        },
      });

      if (project.background.basic?.logo) {
        setLogoPreview(project.background.basic.logo);
      }
    }
  }, [project]);

  useEffect(() => {
    if (formData.basic.companyUrl) {
      setDomain(formData.basic.companyUrl);
    }
  }, [formData.basic.companyUrl]);

  const handleInputChange = (section: keyof typeof formData, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    const updatedDetails = {
      ...(project?.background || {}),
      [activeTab]: {
        ...(project?.background?.[activeTab as keyof typeof formData] || {}),
        ...formData[activeTab as keyof typeof formData],
      },
    };
    updateBackground(updatedDetails);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'File size must be less than 2MB',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${projectId}-logo.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('logos')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('logos').getPublicUrl(fileName);

      // Update form data
      handleInputChange('basic', 'logo', publicUrl);
      setLogoPreview(publicUrl);

      toast({
        title: '🎉 Success',
        description: 'Logo uploaded successfully',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to upload logo',
        variant: 'destructive',
      });
    }
  };

  const handleColorChange = (value: string) => {
    handleInputChange('basic', 'brandColor', value);
  };

  const handleAutofillClick = () => {
    if (formData.basic.companyUrl) {
      setDomain(formData.basic.companyUrl);
    }
    setIsAutofillDialogOpen(true);
  };

  const handleInternalLinksPrompt = () => {
    setActiveTab('internalLinks');
    // Small delay to ensure tab switch happens before clicking the button
    setTimeout(() => {
      findInternalLinks();
    }, 100);
  };

  const handleAddLink = (url: string, summary: string) => {
    addInternalLinkMutation.mutate({ url, summary });
  };

  const handleEditLink = (id: string, url: string, summary: string) => {
    updateInternalLinkMutation.mutate({ id, url, summary });
  };

  const handleDeleteLink = (id: string) => {
    deleteInternalLinkMutation.mutate(id);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Essential details about your company.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="gap-2 text-indigo-600 hover:text-indigo-700"
                    variant="outline"
                    onClick={handleAutofillClick}
                    style={{
                      borderColor: '#6366F1',
                      borderWidth: '1px',
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                    Autofill with AI
                  </Button>
                  <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700" onClick={handleSave}>
                    Save Info
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="font-semibold">Company Name</span>
                  <Badge variant="secondary" className="ml-2">
                    Required
                  </Badge>
                </Label>
                <Input
                  id="name"
                  placeholder="Your Company Name"
                  value={formData.basic.companyName || ''}
                  onChange={(e) => handleInputChange('basic', 'companyName', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">The official name of your company.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="font-semibold">Company URL</span>
                  <Badge variant="secondary" className="ml-2">
                    Required
                  </Badge>
                </Label>
                <Input
                  id="url"
                  placeholder="example.com"
                  value={formData.basic.companyUrl || ''}
                  onChange={(e) => handleInputChange('basic', 'companyUrl', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">Your company name and website URL.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords" className="flex items-center gap-2">
                  <Tags className="h-4 w-4" />
                  <span className="font-semibold">Industry Keywords</span>
                  <Badge variant="secondary" className="ml-2">
                    Required
                  </Badge>
                </Label>
                <Input
                  id="keywords"
                  placeholder="e.g. UI/UX, Web Design, Digital Marketing"
                  value={formData.basic.industryKeywords || ''}
                  onChange={(e) => handleInputChange('basic', 'industryKeywords', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Keywords that best describe your industry and business focus.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="function" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span className="font-semibold">Company Function</span>
                  <Badge variant="secondary" className="ml-2">
                    Required
                  </Badge>
                </Label>
                <Textarea
                  id="function"
                  placeholder="Describe what your company does"
                  value={formData.basic.companyFunction || ''}
                  onChange={(e) => handleInputChange('basic', 'companyFunction', e.target.value)}
                />
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="logo" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span className="font-semibold">Company Logo</span>
                </Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-4">
                  {logoPreview ? (
                    <div className="space-y-4">
                      <Image
                        src={logoPreview}
                        alt="Company logo preview"
                        width={100}
                        height={100}
                        className="max-h-32 mx-auto"
                        style={{ objectFit: "contain" }}
                      />
                      <Button
                        variant="outline"
                        onClick={() => setLogoPreview(null)}
                      >
                        Remove Logo
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer space-y-2 block">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Click to upload logo
                        </span>
                        <span className="text-xs text-muted-foreground">
                          SVG, PNG, JPG (max. 2MB)
                        </span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandColor" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-semibold">Brand Color</span>
                </Label>
                <div className="flex gap-4 items-center">
                  <Input
                    type="color"
                    id="brandColor"
                    className="w-16 h-10 p-1 cursor-pointer"
                    value={formData.basic.brandColor || "#6366F1"}
                    onChange={(e) => handleColorChange(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="#6366F1"
                    className="font-mono"
                    value={formData.basic.brandColor || "#6366F1"}
                    onChange={(e) => handleColorChange(e.target.value)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Choose your primary brand color.
                </p>
              </div> */}
            </CardContent>
          </Card>
        );

      case 'product':
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>
                    Tell us about your products and what makes them unique.
                  </CardDescription>
                </div>
                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700" onClick={handleSave}>
                  Save Info
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="value" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  <span className="font-semibold">Key Value Proposition</span>
                </Label>
                <Textarea
                  id="value"
                  placeholder="What makes your offering unique?"
                  value={formData.product.valueProposition || ''}
                  onChange={(e) => handleInputChange('product', 'valueProposition', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="products" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span className="font-semibold">Products to Sell</span>
                </Label>
                <Textarea
                  id="products"
                  placeholder="Maximum 3 products. Format: Name - Description"
                  value={formData.product.products || ''}
                  onChange={(e) => handleInputChange('product', 'products', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Maximum 3 products. Format: Name - Description (one per line)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="advantage" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-semibold">Competitive Advantage</span>
                </Label>
                <Textarea
                  id="advantage"
                  placeholder="What sets you apart from competitors?"
                  value={formData.product.competitiveAdvantage || ''}
                  onChange={(e) =>
                    handleInputChange('product', 'competitiveAdvantage', e.target.value)
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Optional, but helps us highlight your unique selling points
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 'audience':
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Target Audience</CardTitle>
                  <CardDescription>
                    Help us understand who your customers are and their needs.
                  </CardDescription>
                </div>
                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700" onClick={handleSave}>
                  Save Info
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="painPoints" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span className="font-semibold">Customer Pain Points</span>
                </Label>
                <Textarea
                  id="painPoints"
                  placeholder="2-3 points that describe what problems your customers are trying to solve"
                  value={formData.audience.painPoints || ''}
                  onChange={(e) => handleInputChange('audience', 'painPoints', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  2-3 points that describe what problems your customers are trying to solve
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-semibold">Customer Profile</span>
                </Label>
                <Textarea
                  id="profile"
                  placeholder="Be specific about who makes the purchasing decisions"
                  value={formData.audience.customerProfile || ''}
                  onChange={(e) => handleInputChange('audience', 'customerProfile', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Be specific about who makes the purchasing decisions
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 'socialProof':
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Social Proof</CardTitle>
                  <CardDescription>
                    We will naturally embed these into your articles for credibility.
                  </CardDescription>
                </div>
                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700" onClick={handleSave}>
                  Save Info
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="testimonials" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="font-semibold">Customer Testimonials</span>
                </Label>
                <Textarea
                  id="testimonials"
                  placeholder={`Enter one or more testimonials. Including the person/company's name and industry helps enhance the articles.`}
                  value={formData.socialProof?.testimonials || ''}
                  onChange={(e) => handleInputChange('socialProof', 'testimonials', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="caseStudies" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="font-semibold">Case Studies</span>
                </Label>
                <Textarea
                  id="caseStudies"
                  placeholder="Summarize your best case studies"
                  value={formData.socialProof?.caseStudies || ''}
                  onChange={(e) => handleInputChange('socialProof', 'caseStudies', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="achievements" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <span className="font-semibold">Key Achievements</span>
                </Label>
                <Textarea
                  id="achievements"
                  placeholder="List notable awards, statistics, or milestones"
                  value={formData.socialProof?.achievements || ''}
                  onChange={(e) => handleInputChange('socialProof', 'achievements', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 'internalLinks':
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Internal Links</CardTitle>
                  <CardDescription>
                    Specify your website domain for internal linking.
                  </CardDescription>
                </div>
                <Button
                  className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => findInternalLinks()}
                  disabled={!domain || isFindingLinks}
                >
                  {isFindingLinks ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finding Links...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Find Internal Links
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="domain" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="font-semibold">Domain</span>
                </Label>
                <Input
                  id="domain"
                  placeholder="https://example.com"
                  value={domain}
                  disabled={true}
                />
                {!domain && (
                  <p className="text-sm text-muted-foreground">
                    Domain will be automatically loaded from Basic Information {'>'} Company URL.
                  </p>
                )}
                {domain && (
                  <p className="text-sm text-muted-foreground">
                    Enter your website&apos;s domain for internal linking purposes.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="font-semibold">Found Internal Links</span>
                </Label>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    These links will be strategically incorporated into your generated articles to
                    improve internal linking and SEO performance of your website.
                  </p>
                  <Button
                    variant="ghost"
                    onClick={() => setIsAddLinkDialogOpen(true)}
                    className="gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add Link
                  </Button>
                </div>
                <div className="rounded-lg border">
                  {isLoadingLinks ? (
                    <p className="p-4">Loading links...</p>
                  ) : !internalLinks?.length ? (
                    <p className="p-4 text-sm text-muted-foreground">
                      No internal links found yet. Click &quot;Find Internal Links&quot; to scan
                      your website.
                    </p>
                  ) : (
                    <div className="divide-y">
                      {internalLinks.map((link) => (
                        <div key={link.id} className="flex items-start gap-3 p-4">
                          <LinkIcon className="mt-1 h-4 w-4 flex-shrink-0" />
                          <div className="flex flex-1 flex-col justify-center">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="break-all text-sm font-bold hover:underline"
                            >
                              {getPathFromURL(link.url)}
                            </a>
                            {link.summary && (
                              <span className="break-words text-xs text-muted-foreground">
                                {link.summary}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingLink(link);
                                setIsEditLinkDialogOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => {
                                setDeletingLinkId(link.id);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {isFindingLinks && (
                <div className="mt-4 rounded-lg bg-muted p-4">
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-lg">⏳</span>
                    This process may take a few minutes as we scan your website for internal links.
                    Please keep this tab open.
                  </p>
                </div>
              )}
            </CardContent>
            <AddInternalLinkDialog
              isOpen={isAddLinkDialogOpen}
              onClose={() => setIsAddLinkDialogOpen(false)}
              onAdd={handleAddLink}
            />

            <EditInternalLinkDialog
              isOpen={isEditLinkDialogOpen}
              onClose={() => setIsEditLinkDialogOpen(false)}
              onEdit={handleEditLink}
              link={editingLink}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the internal link.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      if (deletingLinkId) {
                        handleDeleteLink(deletingLinkId);
                      }
                      setIsDeleteDialogOpen(false);
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Card>
        );
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Help us get to know your business to generate relevant articles. The more information
            you provide, the better content we can create for you.
          </p>
        </div>

        <Separator className="" />

        <div className="mt-2 grid gap-6 md:grid-cols-[240px_1fr]">
          {/* Navigation Sidebar */}
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg border bg-white p-3 text-left text-sm transition-colors hover:bg-accent',
                  activeTab === tab.id && 'bg-accent'
                )}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
                {tab.required && <span className="text-lg text-red-600">*</span>}
                {activeTab === tab.id && <ChevronRight className="ml-auto h-5 w-5" />}
              </button>
            ))}
          </nav>

          {/* Main Form Content */}
          <div className="space-y-6">{renderContent()}</div>
        </div>
      </div>

      <AutofillDialog
        isOpen={isAutofillDialogOpen}
        onClose={() => setIsAutofillDialogOpen(false)}
        projectId={projectId}
        initialUrl={formData.basic.companyUrl || ''}
        onSuccess={(data) => {
          setFormData((prev) => ({
            ...prev,
            [activeTab]: {
              ...prev[activeTab as keyof typeof formData],
              ...data[activeTab],
            },
          }));
          queryClient.invalidateQueries({ queryKey: ['project', projectId] });
        }}
        toast={toast}
        internalLinksCount={internalLinks?.length || 0}
        onInternalLinksPrompt={handleInternalLinksPrompt}
      />
    </div>
  );
}
