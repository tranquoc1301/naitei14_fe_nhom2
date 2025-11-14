import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { RegisterFormData } from '../types/auth.types';
import { useRegister } from '../hooks/useRegister';
import { validateForm, ValidationErrors } from '../utils/authValidation';
import { sendActivationEmail } from '../services/emailService';
import {
    CLASS_SECTION_HEADING,
    CLASS_GRID_TWO_COL,
    CLASS_LABEL,
    CLASS_INPUT_BASE,
    CLASS_PASSWORD_INPUT,
    CLASS_TOGGLE_BUTTON,
    CLASS_ERROR,
} from '@/constants/common';
import { cn } from '@/lib/utils';

const RegisterForm: React.FC = () => {
    const { createUser, loading, error } = useRegister();

    const [formData, setFormData] = useState<RegisterFormData>({
        fullName: '',
        phone: '',
        email: '',
        website: '',
        password: '',
        confirmPassword: '',
        subscribeEmail: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const validationErrors = await validateForm(formData);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        try {
            const registeredUser = await createUser({
                fullName: formData.fullName,
                phone: formData.phone,
                email: formData.email,
                password: formData.password,
                website: formData.website,
                subscribeEmail: formData.subscribeEmail,
            });

            const activationLink = `${window.location.origin}/auth/activate?userId=${registeredUser.id}&token=${registeredUser.activationToken}`;
            try {
                const sanitizedEmail = formData.email.replace(/[\r\n]/g, '').replace(/\s+/g, ' ').trim();
                const sanitizedName = formData.fullName.replace(/[\r\n]/g, '').replace(/\s+/g, ' ').trim();
                await sendActivationEmail(sanitizedEmail, sanitizedName, activationLink);
                setSuccessMessage('Đăng ký thành công! Email xác nhận đã được gửi đến hộp thư của bạn.');
            } catch (emailErr) {
                const emailErrorMessage = emailErr instanceof Error ? emailErr.message : 'Unknown email error';
                console.error('Email send failed', { error: emailErr, message: emailErrorMessage });
                setSuccessMessage(`Không thể gửi email xác nhận. Vui lòng liên hệ hỗ trợ. Dữ liệu: ${emailErrorMessage}`);
            }
        } catch (err) {
            console.error('Registration failed', {
                error: err,
                message: err instanceof Error ? err.message : 'Unknown error'
            });
        }
    };

    const handleReset = () => {
        setFormData({
            fullName: '',
            phone: '',
            email: '',
            website: '',
            password: '',
            confirmPassword: '',
            subscribeEmail: false,
        });
        setErrors({});
    };

    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
                {/* THÔNG TIN CÁ NHÂN */}
                <div className="mb-8">
                    <h2 className={CLASS_SECTION_HEADING}>
                        THÔNG TIN CÁ NHÂN
                    </h2>

                    <div className={CLASS_GRID_TWO_COL}>
                        <div>
                            <label className={CLASS_LABEL}>
                                Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={cn(CLASS_INPUT_BASE, errors.fullName && 'border-red-500 focus:border-red-500')}
                            />
                            {errors.fullName && <div className={CLASS_ERROR}>{errors.fullName}</div>}
                        </div>

                        <div>
                            <label className={CLASS_LABEL}>
                                Số ĐT <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={cn(CLASS_INPUT_BASE, errors.phone && 'border-red-500 focus:border-red-500')}
                            />
                            {errors.phone && <div className={CLASS_ERROR}>{errors.phone}</div>}
                        </div>

                        <div>
                            <label className={CLASS_LABEL}>
                                Địa chỉ email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={cn(CLASS_INPUT_BASE, errors.email && 'border-red-500 focus:border-red-500')}
                            />
                            {errors.email && <div className={CLASS_ERROR}>{errors.email}</div>}
                        </div>

                        <div>
                            <label className={CLASS_LABEL}>
                                Website của bạn
                            </label>
                            <input
                                type="text"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                className={cn(CLASS_INPUT_BASE, errors.website && 'border-red-500 focus:border-red-500')}
                            />
                            {errors.website && <div className={CLASS_ERROR}>{errors.website}</div>}
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="subscribeEmail"
                                checked={formData.subscribeEmail}
                                onChange={handleChange}
                                className="w-4 h-4 text-green-primary border-gray-300 rounded focus:ring-green-dark"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                Đăng ký nhận thông tin qua email
                            </span>
                        </label>
                    </div>
                </div>

                {/* THÔNG TIN TÀI KHOẢN */}
                <div className="mb-8 mt-12">
                    <h2 className={CLASS_SECTION_HEADING}>
                        THÔNG TIN TÀI KHOẢN
                    </h2>

                    <div className={CLASS_GRID_TWO_COL}>
                        <div>
                            <label className={CLASS_LABEL}>
                                Mật khẩu <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    tabIndex={1}
                                    onChange={handleChange}
                                    className={cn(CLASS_PASSWORD_INPUT, errors.password && 'border-red-500 focus:border-red-500')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={CLASS_TOGGLE_BUTTON}
                                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && <div className={CLASS_ERROR}>{errors.password}</div>}
                        </div>

                        <div>
                            <label className={CLASS_LABEL}>
                                Nhập lại mật khẩu <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    tabIndex={2}
                                    onChange={handleChange}
                                    className={cn(CLASS_PASSWORD_INPUT, errors.confirmPassword && 'border-red-500 focus:border-red-500')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className={CLASS_TOGGLE_BUTTON}
                                    aria-label={showConfirmPassword ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.confirmPassword && <div className={CLASS_ERROR}>{errors.confirmPassword}</div>}
                        </div>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {/* Success message */}
                {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                        {successMessage}
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-8 py-3 border-2 border-green-primary text-green-primary rounded-full hover:bg-green-50 transition-colors"
                    >
                        QUAY LẠI
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-green-primary text-white rounded-full hover:bg-green-dark transition-colors disabled:opacity-50"
                    >
                        {loading ? 'ĐANG ĐĂNG KÝ...' : 'ĐĂNG KÝ'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;
