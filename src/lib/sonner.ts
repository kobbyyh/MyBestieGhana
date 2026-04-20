import { toast } from "sonner";

export const sonner = {
  success: (message: string, description?: string) =>
    toast.success(message, description ? { description } : undefined),
  error: (message: string, description?: string) =>
    toast.error(message, description ? { description } : undefined),
  message: (message: string, description?: string) =>
    toast(message, description ? { description } : undefined),
};

