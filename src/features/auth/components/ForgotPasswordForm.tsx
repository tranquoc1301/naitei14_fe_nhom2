import React from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { ForgotPasswordFormData } from "../types/auth.types";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { validateForgotPasswordForm } from "../utils/authValidation";
import { RenderButton } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  CLASS_FORM_HEADING,
  CLASS_FORM_LABEL,
  CLASS_FORM_INPUT,
  CLASS_FORM_ERROR,
  CLASS_FORM_SUCCESS_MESSAGE,
  CLASS_FORM_ERROR_MESSAGE,
  CLASS_FORM_BUTTON_CONTAINER,
} from "@/constants/common";

const ForgotPasswordForm: React.FC = () => {
  const { forgotPassword, loading, error, success } = useForgotPassword();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const validationErrors = await validateForgotPasswordForm(data);
    const hasErrors = Object.keys(validationErrors).length > 0;

    if (hasErrors) {
      Object.entries(validationErrors).forEach(([field, message]) => {
        setError(field as keyof ForgotPasswordFormData, { message });
      });
      return;
    }

    await forgotPassword({
      email: data.email,
    });
  };

  return (
    <>
      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className={CLASS_FORM_HEADING}>QUÊN MẬT KHẨU</h2>
        <p className="text-gray-600">
          Vui lòng nhập email của bạn để nhận liên kết đặt lại mật khẩu.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className={CLASS_FORM_LABEL}>
            Email của bạn
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={cn(
              CLASS_FORM_INPUT,
              errors.email ? "border-red-500" : "border-gray-300"
            )}
            placeholder="Email của bạn"
          />
          {errors.email?.message && (
            <p className={CLASS_FORM_ERROR}>{errors.email.message}</p>
          )}
        </div>

        {/* Success Message */}
        {success && (
          <div className={CLASS_FORM_SUCCESS_MESSAGE}>{success}</div>
        )}

        {/* Error Message */}
        {error && (
          <div className={CLASS_FORM_ERROR_MESSAGE}>{error}</div>
        )}

        <div className={CLASS_FORM_BUTTON_CONTAINER}>
          <RenderButton
            type="submit"
            variant="primary-rounded"
            isLoading={loading}
            loadingText="ĐANG GỬI..."
          >
            GỬI LIÊN KẾT ĐẶT LẠI
          </RenderButton>
        </div>

        <div className="text-center pt-4 border-t border-gray-200">
          <a
            href="/auth/login"
            className="inline-flex items-center gap-1 text-sm text-green-primary hover:underline"
          >
            <ArrowLeft size={16} />
            Quay lại đăng nhập
          </a>
        </div>
      </form>
    </>
  );
};

export default ForgotPasswordForm;
