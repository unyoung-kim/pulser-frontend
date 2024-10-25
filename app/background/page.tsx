'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { Loader } from "@/components/ui/loader";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl!, supabaseKey!);

const BackgroundSchema = z.object({
  basic: z.object({
    nameAndCompanyUrl: z.string().nonempty("Name & Company URL is required"),
    industryKeywords: z.string().nonempty("At least one industry/keyword is required"),
  }),
  product: z.object({
    companyFunction: z.string().nonempty("Company function is required"),
    valueProposition: z.string().nonempty("Key value proposition is required"),
    productsToSell: z.string().nonempty("At least one product is required"),
    competitiveAdvantage: z.string().optional(),
    companyMission: z.string().optional(),
  }),
  audience: z.object({
    customerStruggles: z.string().nonempty("At least 2 customer struggles are required"),
    customerDescription: z.string().nonempty("Customer description is required"),
  }),
  voice: z.object({
    writingStyle: z.string().optional(),
  }),
});

type Background = z.infer<typeof BackgroundSchema>;

export default function BackgroundPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Project ID:', projectId);
  }, [projectId]);

  const form = useForm<Background>({
    resolver: zodResolver(BackgroundSchema),
    defaultValues: {
      basic: { nameAndCompanyUrl: "", industryKeywords: "" },
      product: { companyFunction: "", valueProposition: "", productsToSell: "", competitiveAdvantage: "", companyMission: "" },
      audience: { customerStruggles: "", customerDescription: "" },
      voice: { writingStyle: "" },
    },
  });

  async function onSubmit(data: Background) {
    console.log('onSubmit function called');
    console.log('Form submitted with data:', data);
    setLoading(true);

    if (!projectId) {
      console.error('Project ID is missing');
      toast({
        title: "Error",
        description: "Project ID is missing. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting to update background for project:', projectId);
      const response = await fetch('/api/update-background', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId, background: data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update background');
      }

      const result = await response.json();
      console.log('Background updated successfully', result);
      toast({
        title: "Background Updated",
        description: "Your company background has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating background:', error);
      let errorMessage = "Failed to update background. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {loading && <Loader />}
      <main className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-6">Company Background</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => {
            console.log('Form is valid, calling onSubmit');
            onSubmit(data);
          }, (errors) => {
            console.log('Form validation failed:', errors);
          })} className="space-y-8">
            <FormField
              control={form.control}
              name="basic.nameAndCompanyUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name & Company URL</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe - www.example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name and company website.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="basic.industryKeywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry Keywords</FormLabel>
                  <FormControl>
                    <Input placeholder="Technology, SaaS, B2B" {...field} />
                  </FormControl>
                  <FormDescription>
                    Comma-separated keywords describing your industry.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="product.companyFunction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Function</FormLabel>
                  <FormControl>
                    <Textarea placeholder="We provide cloud-based project management software for small to medium-sized businesses." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="product.valueProposition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Value Proposition</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Our software increases team productivity by 30% through streamlined communication and task management." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="product.productsToSell"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Products to Sell</FormLabel>
                  <FormControl>
                    <Textarea placeholder="1. Basic Plan: $9.99/month
2. Pro Plan: $29.99/month
3. Enterprise Plan: Custom pricing" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="product.competitiveAdvantage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Competitive Advantage (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Our unique AI-powered task prioritization sets us apart from competitors." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="product.companyMission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Mission (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="To empower teams to achieve more through intuitive and efficient project management tools." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="audience.customerStruggles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Struggles</FormLabel>
                  <FormControl>
                    <Textarea placeholder="1. Difficulty in tracking project progress across multiple teams.
2. Inefficient communication leading to missed deadlines.
3. Lack of visibility into resource allocation and utilization." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="audience.customerDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Our target customers are project managers and team leads in small to medium-sized businesses (10-500 employees) across various industries who are looking to improve their team's productivity and project outcomes." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="voice.writingStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Writing Style (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Professional yet approachable, focusing on the benefits our software provides to busy professionals." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={loading} 
              onClick={() => console.log('Update Background button clicked')}
            >
              Update Background
            </Button>
          </form>
        </Form>
      </main>
    </div>
  );
}
