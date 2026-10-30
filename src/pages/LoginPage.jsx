import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginAsDemo } = useAuth();

  const [email, setEmail] = useState('customer@petosory.vn');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Email hoặc mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setLoading(true);
    try {
      await loginAsDemo(role);
      navigate(role === ROLES.SPA_OWNER ? '/owner-dashboard' : '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md text-2xl">
          🐾
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Đăng nhập vào Petosory
        </h1>
        <p className="text-xs text-slate-500">
          Chăm sóc thú cưng và trải nghiệm dịch vụ tiện ích
        </p>
      </div>

      {/* Main Login Card */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Địa chỉ Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            placeholder="example@petosory.vn"
          />

          <Input
            label="Mật khẩu"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            placeholder="••••••••"
          />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-400">
              <input type="checkbox" defaultChecked className="rounded accent-orange-500" />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <Link
              to="/reset-password"
              className="text-orange-600 dark:text-orange-400 font-bold hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-bold"
            loading={loading}
            icon={LogIn}
          >
            Đăng nhập
          </Button>
        </form>

        {/* Demo Fast Logins Strip */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            Hoặc đăng nhập nhanh chế độ Demo:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin(ROLES.CUSTOMER)}
              className="p-2.5 rounded-xl border border-orange-200 dark:border-slate-700 bg-orange-50 dark:bg-slate-700/50 hover:bg-orange-100 text-xs font-bold text-orange-700 dark:text-orange-300 transition-colors cursor-pointer text-center"
            >
              👤 Khách hàng (Customer)
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin(ROLES.SPA_OWNER)}
              className="p-2.5 rounded-xl border border-purple-200 dark:border-slate-700 bg-purple-50 dark:bg-slate-700/50 hover:bg-purple-100 text-xs font-bold text-purple-700 dark:text-purple-300 transition-colors cursor-pointer text-center"
            >
              🏪 Chủ Spa (Owner)
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-2">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-orange-600 font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;

