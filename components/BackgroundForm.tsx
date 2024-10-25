import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

export function BackgroundForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<Background>({
    resolver: zodResolver(BackgroundSchema),
  });

  const onSubmit = (data: Background) => {
    // Store data in localStorage
    localStorage.setItem('backgroundInfo', JSON.stringify(data));
    console.log('Background info saved:', data);
    // You can add a success message or redirect here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Basic Information</h2>
        <Input {...register("basic.nameAndCompanyUrl")} placeholder="Name & Company URL" />
        {errors.basic?.nameAndCompanyUrl && <p className="text-red-500">{errors.basic.nameAndCompanyUrl.message}</p>}
        <Input {...register("basic.industryKeywords")} placeholder="Industry Keywords (comma-separated)" />
        {errors.basic?.industryKeywords && <p className="text-red-500">{errors.basic.industryKeywords.message}</p>}
      </div>

      <div>
        <h2 className="text-lg font-semibold">Product Information</h2>
        <Input {...register("product.companyFunction")} placeholder="What does your company do/sell?" />
        {errors.product?.companyFunction && <p className="text-red-500">{errors.product.companyFunction.message}</p>}
        <Input {...register("product.valueProposition")} placeholder="Key value proposition" />
        {errors.product?.valueProposition && <p className="text-red-500">{errors.product.valueProposition.message}</p>}
        <Textarea {...register("product.productsToSell")} placeholder="Products to sell (max 3, one per line)" />
        {errors.product?.productsToSell && <p className="text-red-500">{errors.product.productsToSell.message}</p>}
        <Input {...register("product.competitiveAdvantage")} placeholder="Competitive advantage (optional)" />
        <Input {...register("product.companyMission")} placeholder="Company mission (optional)" />
      </div>

      <div>
        <h2 className="text-lg font-semibold">Audience Information</h2>
        <Textarea {...register("audience.customerStruggles")} placeholder="Customer struggles (2-3 points, one per line)" />
        {errors.audience?.customerStruggles && <p className="text-red-500">{errors.audience.customerStruggles.message}</p>}
        <Textarea {...register("audience.customerDescription")} placeholder="Describe your customers" />
        {errors.audience?.customerDescription && <p className="text-red-500">{errors.audience.customerDescription.message}</p>}
      </div>

      <div>
        <h2 className="text-lg font-semibold">Voice</h2>
        <Textarea {...register("voice.writingStyle")} placeholder="Preferred writing style (optional)" />
      </div>

      <Button type="submit">Save Background Information</Button>
    </form>
  );
}
