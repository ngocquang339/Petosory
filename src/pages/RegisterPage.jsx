import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { validateEmail, validatePhone } from '../utils/validators';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { loginAsDemo } = useAuth();

  // Step 1: Register fields, Step 2: Verify Email OTP (include -> Verify Email use case)
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [otpCode, setOtpCode] = useState('');
  const [simulatedCode, setSimulatedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.fullName.trim().length < 2) {
      setError('Vui lòng nhập họ và tên');
      return;
    }
    if (!validateEmail(formData.email)) {
      setError('Địa chỉ email không hợp lệ');
      return;
    }
    if (!validatePhone(formData.phone)) {
      setError('Số điện thoại không hợp lệ (10 chữ số)');
      return;
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.register(formData);
      setSimulatedCode(res.verificationCode);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Lỗi đăng ký tài khoản');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Email use case
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!otpCode.trim()) {
      setError('Vui lòng nhập mã OTP 6 số');
      return;
    }

    setLoading(true);
    try {
      await authService.verifyEmail(otpCode);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Mã xác thực không hợp lệ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md text-2xl">
          🐾
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          {step === 1 ? 'Đăng ký Tài khoản Petosory' : 'Xác thực Email của bạn'}
        </h1>
        <p className="text-xs text-slate-500">
          {step === 1
            ? 'Tham gia cộng đồng yêu thú cưng và nhận nhiều ưu đãi độc quyền'
            : `Mã OTP đã được gửi tới email ${formData.email}`}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl space-y-6">
        {step === 1 ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <Input
              label="Họ và tên"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              icon={User}
              placeholder="Nguyễn Văn A"
            />

            <Input
              label="Địa chỉ Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              icon={Mail}
              placeholder="nguyenvana@gmail.com"
            />

            <Input
              label="Số điện thoại"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              icon={Phone}
              placeholder="0912 345 678"
            />

            <Input
              label="Mật khẩu"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              icon={Lock}
              placeholder="Tối thiểu 6 ký tự"
            />

            <Input
              label="Xác nhận mật khẩu"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              icon={Lock}
              placeholder="Nhập lại mật khẩu"
            />

            {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold"
              loading={loading}
              icon={ArrowRight}
            >
              Tiếp tục (Nhận mã xác thực)
            </Button>
          </form>
        ) : (
          /* Step 2: Verify Email */
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="bg-orange-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-orange-200 dark:border-slate-600 text-center space-y-2">
              <span className="text-xs text-slate-600 dark:text-slate-300">
                Mã xác thực OTP gửi giả lập:
              </span>
              <div className="text-2xl font-black font-mono tracking-widest text-orange-600">
                {simulatedCode || '123456'}
              </div>
              <p className="text-[11px] text-slate-400">
                (Nhập mã 6 chữ số này hoặc 123456 để hoàn tất đăng ký)
              </p>
            </div>

            <Input
              label="Nhập mã OTP 6 số"
              required
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="VD: 123456"
              className="text-center font-mono text-base"
            />

            {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold"
              loading={loading}
              icon={CheckCircle2}
            >
              Xác thực & Hoàn tất
            </Button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white underline cursor-pointer"
            >
              Quay lại chỉnh sửa thông tin
            </button>
          </form>
        )}

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-700">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-orange-600 font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
