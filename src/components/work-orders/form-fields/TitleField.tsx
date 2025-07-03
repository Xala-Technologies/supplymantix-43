import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface TitleFieldProps {
  form: UseFormReturn<any>;
}

export const TitleField = ({ form }: TitleFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input 
              placeholder="What needs to be done?" 
              className="text-lg font-medium border-0 border-b border-gray-200 rounded-none px-0 focus:border-blue-500"
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};