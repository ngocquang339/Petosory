import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, KeyRound, CheckCircle2, ArrowRight } from 'lucide-react';
import { authService } from '../services/authService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { validateEmail } from '../utils/validators';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await authService.resetPassword(email);
      setSuccessMsg(res.message);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Lỗi gửi yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (resetCode.trim() !== '654321' && resetCode.trim() !== '123456') {
      setError('Mã xác thực không hợp lệ (Mã demo: 654321)');
      return;
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword('', newPassword);
      alert('Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md text-2xl">
          🔑
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Đặt lại Mật khẩu (Reset Password)
        </h1>
        <p className="text-xs text-slate-500">
          Khôi phục quyền truy cập vào tài khoản Petosory của bạn
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl space-y-6">
        {step === 1 ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <Input
              label="Email đã đăng ký"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              placeholder="nhap-email-cua-ban@gmail.com"
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
              Gửi mã khôi phục
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="bg-sky-50 dark:bg-slate-700/50 p-3.5 rounded-xl border border-sky-200 dark:border-slate-600 text-xs text-sky-800 dark:text-sky-300">
              {successMsg}
            </div>

            <Input
              label="Mã xác thực (Mã demo: 654321)"
              required
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              placeholder="654321"
            />

            <Input
              label="Mật khẩu mới"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              icon={Lock}
              placeholder="Ít nhất 6 ký tự"
            />

            <Input
              label="Xác nhận mật khẩu mới"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              icon={CheckCircle2}
            >
              Lưu mật khẩu mới
            </Button>
          </form>
        )}

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-700">
          Nhớ lại mật khẩu rồi?{' '}
          <Link to="/login" className="text-orange-600 font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ResetPasswordPage;
