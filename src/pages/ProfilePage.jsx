import React, { useState } from 'react';
import {
  User,
  PawPrint,
  KeyRound,
  Plus,
  Trash2,
  Check,
  ShieldCheck,
  Camera,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

export const ProfilePage = () => {
  const { user, updateUserProfile, addPet, deletePet } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');

  // Profile edit state
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Change password state (Account Feature: Change Password)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Add pet modal
  const [addPetOpen, setAddPetOpen] = useState(false);
  const [petForm, setPetForm] = useState({
    name: '',
    type: 'cat',
    breed: '',
    age: '',
    weight: '',
    gender: 'Đực',
  });
  const [addingPet, setAddingPet] = useState(false);

  // Save profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateUserProfile(profileForm);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 2500);
    } catch (err) {
      alert(err.message || 'Lỗi lưu thông tin');
    } finally {
      setSavingProfile(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không trùng khớp');
      return;
    }

    setSavingPassword(true);
    try {
      await authService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      setPasswordSuccess('Đổi mật khẩu thành công!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.message || 'Lỗi đổi mật khẩu');
    } finally {
      setSavingPassword(false);
    }
  };

  // Add pet
  const handleAddPet = async (e) => {
    e.preventDefault();
    if (!petForm.name) return;
    setAddingPet(true);
    try {
      await addPet(petForm);
      setAddPetOpen(false);
      setPetForm({ name: '', type: 'cat', breed: '', age: '', weight: '', gender: 'Đực' });
    } catch (err) {
      alert(err.message || 'Lỗi thêm thú cưng');
    } finally {
      setAddingPet(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          Quản lý Tài khoản (Account Features)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Cập nhật thông tin cá nhân, hồ sơ thú cưng và bảo mật mật khẩu.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Navigation */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs text-center space-y-3">
            <div className="relative w-24 h-24 mx-auto">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
                alt={user?.fullName}
                className="w-full h-full rounded-full object-cover border-4 border-orange-100 dark:border-slate-700 shadow-md"
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 p-2 rounded-full bg-orange-500 text-white shadow-md hover:bg-orange-600 transition-colors cursor-pointer"
                title="Thay đổi ảnh đại diện"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {user?.fullName}
              </h3>
              <p className="text-xs text-slate-400">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 text-xs font-semibold uppercase">
                {user?.role}
              </span>
            </div>
          </div>

          {/* Navigation Pills */}
          <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-orange-500 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Thông tin cá nhân (Manage Profile)</span>
            </button>

            <button
              onClick={() => setActiveTab('pets')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'pets'
                  ? 'bg-orange-500 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <PawPrint className="w-4 h-4" />
              <span>Hồ sơ thú cưng ({user?.pets?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-orange-500 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Đổi mật khẩu (Change Password)</span>
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-8">
          {/* Tab 1: Manage Profile */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs space-y-5">
              <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Thông tin cá nhân
                </h3>
                <p className="text-xs text-slate-400">
                  Cập nhật họ tên và địa chỉ mặc định để thanh toán nhanh hơn
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <Input
                  label="Email tài khoản"
                  value={user?.email || ''}
                  disabled={true}
                  helperText="Email không thể thay đổi sau khi xác thực"
                />

                <Input
                  label="Họ và tên"
                  required
                  value={profileForm.fullName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, fullName: e.target.value })
                  }
                />

                <Input
                  label="Số điện thoại"
                  required
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                />

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Địa chỉ nhận hàng mặc định:
                  </label>
                  <textarea
                    rows={2}
                    value={profileForm.address}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, address: e.target.value })
                    }
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  {profileSuccess && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" /> Cập nhật hồ sơ thành công!
                    </span>
                  )}
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={savingProfile}
                    className="ml-auto"
                  >
                    Lưu thông tin
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 2: Pets */}
          {activeTab === 'pets' && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Danh sách thú cưng của bạn
                  </h3>
                  <p className="text-xs text-slate-400">
                    Lưu hồ sơ sức khỏe và dễ dàng đặt lịch spa chỉ với 1 chạm
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  icon={Plus}
                  onClick={() => setAddPetOpen(true)}
                >
                  Thêm thú cưng
                </Button>
              </div>

              {(!user?.pets || user.pets.length === 0) ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <span className="text-4xl">🐾</span>
                  <p className="text-xs">Chưa có thú cưng nào được thêm vào danh sách.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.pets.map((pet) => (
                    <div
                      key={pet.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center gap-4 relative group"
                    >
                      <img
                        src={pet.avatar}
                        alt={pet.name}
                        className="w-16 h-16 rounded-xl object-cover bg-white border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">
                            {pet.name}
                          </h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">
                            {pet.type === 'cat' ? 'Mèo' : 'Chó'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{pet.breed}</p>
                        <p className="text-[11px] text-slate-400">
                          {pet.age} • {pet.weight} • Giới tính: {pet.gender}
                        </p>
                      </div>

                      <button
                        onClick={() => deletePet(pet.id)}
                        className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-700 p-1.5 transition-opacity"
                        title="Xóa hồ sơ thú cưng này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Security & Change Password (Account Feature: Change Password) */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs space-y-5">
              <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-orange-500" /> Đổi mật khẩu tài khoản
                </h3>
                <p className="text-xs text-slate-400">
                  Bảo vệ tài khoản bằng mật khẩu có độ dài tối thiểu 6 ký tự
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <Input
                  label="Mật khẩu hiện tại"
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  placeholder="••••••••"
                />

                <Input
                  label="Mật khẩu mới"
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  placeholder="Ít nhất 6 ký tự"
                />

                <Input
                  label="Xác nhận mật khẩu mới"
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  placeholder="Nhập lại mật khẩu mới"
                />

                {passwordError && (
                  <p className="text-xs text-rose-500 font-medium">{passwordError}</p>
                )}
                {passwordSuccess && (
                  <p className="text-xs text-emerald-600 font-bold">{passwordSuccess}</p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={savingPassword}
                >
                  Cập nhật mật khẩu mới
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Add Pet Modal */}
      <Modal
        isOpen={addPetOpen}
        onClose={() => setAddPetOpen(false)}
        title="Thêm hồ sơ thú cưng mới"
      >
        <form onSubmit={handleAddPet} className="space-y-4">
          <Input
            label="Tên bé cưng"
            required
            value={petForm.name}
            onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
            placeholder="VD: Kem, Bông, Bắp..."
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1.5">Loài:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPetForm({ ...petForm, type: 'cat' })}
                  className={`py-2 text-xs font-bold rounded-xl border ${
                    petForm.type === 'cat'
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-slate-200'
                  }`}
                >
                  🐱 Mèo
                </button>
                <button
                  type="button"
                  onClick={() => setPetForm({ ...petForm, type: 'dog' })}
                  className={`py-2 text-xs font-bold rounded-xl border ${
                    petForm.type === 'dog'
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-slate-200'
                  }`}
                >
                  🐶 Chó
                </button>
              </div>
            </div>

            <Input
              label="Giống loài"
              value={petForm.breed}
              onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })}
              placeholder="VD: Poodle, Golden, Mèo Ba Tư..."
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Độ tuổi"
              value={petForm.age}
              onChange={(e) => setPetForm({ ...petForm, age: e.target.value })}
              placeholder="VD: 1 tuổi"
            />
            <Input
              label="Cân nặng"
              value={petForm.weight}
              onChange={(e) => setPetForm({ ...petForm, weight: e.target.value })}
              placeholder="VD: 5 kg"
            />
            <div>
              <label className="block text-xs font-bold mb-1.5">Giới tính:</label>
              <select
                value={petForm.gender}
                onChange={(e) => setPetForm({ ...petForm, gender: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Đực">Đực</option>
                <option value="Cái">Cái</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="outline" size="md" onClick={() => setAddPetOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" size="md" loading={addingPet}>
              Thêm bé cưng
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default ProfilePage;

