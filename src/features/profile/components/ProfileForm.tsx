import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ProfileFormData } from "../types";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { validateProfileForm } from "../utils/profileValidation";
import { RenderButton } from "@/components/ui/Button";
import {
  CLASS_GRID_TWO_COL,
  CLASS_INPUT_BASE,
  CLASS_ERROR,
} from "@/constants/common";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext/useAuth";
import {
  User,
  Phone,
  Mail,
  Globe,
  Check,
  X,
  CircleCheckBig,
  Edit,
} from "lucide-react";
import { maskEmail } from "../utils/maskEmail";
import { sendActivationEmail } from "@/features/auth/services/emailService";
const ProfileForm: React.FC = () => {
  const { user } = useAuth();
  const { updateUserProfile, loading, error } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormData>({
    defaultValues: {
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      email: "",
      website: user?.website || "",
      subscribeEmail: user?.subscribeEmail || false,
    },
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEmailEditing, setIsEmailEditing] = useState(false);

  useEffect(() => {
    if (isEmailEditing) {
      setValue("email", user?.email || "");
    } else {
      setValue("email", maskEmail(user?.email || ""));
    }
  }, [isEmailEditing, user?.email, setValue]);

  const handleVerifyEmail = async () => {
    const activationLink = `${window.location.origin}/auth/activate?userId=${user?.id}&token=${user?.activationToken}`;
    try {
      const sanitizedEmail = user?.email
        .replace(/[\r\n]/g, "")
        .replace(/\s+/g, " ")
        .trim();
      const sanitizedName = user?.fullName
        .replace(/[\r\n]/g, "")
        .replace(/\s+/g, " ")
        .trim();
      await sendActivationEmail(
        sanitizedEmail || "",
        sanitizedName || "",
        activationLink
      );
      setSuccessMessage(
        "Đăng ký thành công! Email xác nhận đã được gửi đến hộp thư của bạn."
      );
    } catch (emailErr) {
      const emailErrorMessage =
        emailErr instanceof Error ? emailErr.message : "Unknown email error";
      console.error("Email send failed", {
        error: emailErr,
        message: emailErrorMessage,
      });
      setSuccessMessage(
        `Không thể gửi email xác nhận. Vui lòng liên hệ hỗ trợ. Dữ liệu: ${emailErrorMessage}`
      );
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    // If not editing email, ensure email remains the same
    if (!isEmailEditing) {
      setValue("email", user?.email || "");
    }

    // Validation
    const validationErrors = await validateProfileForm(data, user?.email);
    const hasErrors = Object.keys(validationErrors).length > 0;
    if (hasErrors) {
      Object.entries(validationErrors).forEach(([field, message]) => {
        setError(field as keyof ProfileFormData, { message });
      });
      return;
    }

    try {
      await updateUserProfile(data);
      setSuccessMessage("Cập nhật hồ sơ thành công!");
      setIsEmailEditing(false); // Exit editing mode after successful update
    } catch (err) {
      console.error("Profile update failed", {
        error: err,
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  const handleReset = () => {
    setValue("fullName", user?.fullName || "");
    setValue("phone", user?.phone || "");
    setValue("email", maskEmail(user?.email || ""));
    setValue("website", user?.website || "");
    setValue("subscribeEmail", user?.subscribeEmail || false);
    setSuccessMessage(null);
    setIsEmailEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Personal Information Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-6">
            <User className="w-6 h-6 text-green-primary mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">
              THÔNG TIN CÁ NHÂN
            </h2>
          </div>

          <div className={CLASS_GRID_TWO_COL}>
            <div className="relative">
              <label className="flex text-sm font-medium text-gray-700 mb-2 items-center">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("fullName")}
                className={cn(
                  CLASS_INPUT_BASE,
                  "pl-4",
                  errors.fullName && "border-red-500 focus:border-red-500"
                )}
              />
              {errors.fullName?.message && (
                <div className={CLASS_ERROR}>{errors.fullName.message}</div>
              )}
            </div>

            <div className="relative">
              <label className="flex text-sm font-medium text-gray-700 mb-2 items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                Số ĐT <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("phone")}
                className={cn(
                  CLASS_INPUT_BASE,
                  "pl-4",
                  errors.phone && "border-red-500 focus:border-red-500"
                )}
              />
              {errors.phone?.message && (
                <div className={CLASS_ERROR}>{errors.phone.message}</div>
              )}
            </div>

            <div className="relative">
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                Địa chỉ email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register("email")}
                  readOnly={!isEmailEditing}
                  className={cn(
                    CLASS_INPUT_BASE,
                    "pl-4 pr-12",
                    errors.email && "border-red-500 focus:border-red-500"
                  )}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-2">
                  {!isEmailEditing && (
                    <Edit
                      className="w-5 h-5 text-gray-500 cursor-pointer"
                      onClick={() => setIsEmailEditing(true)}
                    />
                  )}
                  {user?.emailVerified ? (
                    <CircleCheckBig className="text-green-primary w-5 h-5" />
                  ) : (
                    <button
                      type="button"
                      onClick={handleVerifyEmail}
                      className="bg-green-100 text-green-primary hover:text-green-700 text-xs px-2 py-1 rounded-md border border-green-200 transition-colors"
                    >
                      Xác minh
                    </button>
                  )}
                </div>
              </div>
              {errors.email?.message && (
                <div className={CLASS_ERROR}>{errors.email.message}</div>
              )}
            </div>

            <div className="relative">
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Globe className="w-4 h-4 mr-2 text-gray-500" />
                Website của bạn
              </label>
              <input
                type="text"
                {...register("website")}
                className={cn(
                  CLASS_INPUT_BASE,
                  "pl-4",
                  errors.website && "border-red-500 focus:border-red-500"
                )}
              />
              {errors.website?.message && (
                <div className={CLASS_ERROR}>{errors.website.message}</div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register("subscribeEmail")}
                className="w-5 h-5 text-green-primary border-gray-300 rounded focus:ring-green-dark"
              />
              <span className="ml-3 text-sm text-gray-700 font-medium">
                Đăng ký nhận thông tin qua email
              </span>
            </label>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
            <X className="w-5 h-5 mr-3 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
            <Check className="w-5 h-5 mr-3 flex-shrink-0" />
            {successMessage}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4">
          <RenderButton
            type="button"
            variant="outline"
            size="md"
            onClick={handleReset}
            className="rounded-full px-8 py-3"
          >
            HỦY
          </RenderButton>
          <RenderButton
            type="submit"
            variant="primary-rounded"
            size="md"
            isLoading={loading}
            loadingText="ĐANG CẬP NHẬT..."
          >
            CẬP NHẬT
          </RenderButton>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
