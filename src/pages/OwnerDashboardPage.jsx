import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Settings, Calendar, Sparkles, Building2 } from 'lucide-react';
import Dashboard from '../components/owner/Dashboard';
import Management from '../components/owner/Management';
import { spaService } from '../services/spaService';
import { useAuth } from '../hooks/useAuth';

export const OwnerDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [spa, setSpa] = useState(null);

  const refreshBookings = async () => {
    const bList = await spaService.getSpaBookings();
    setBookings(bList);
  };

  useEffect(() => {
    const loadData = async () => {
      const bList = await spaService.getSpaBookings();
      const s = await spaService.getSpaById('spa-1');
      setBookings(bList);
      setSpa(s);
    };
    loadData();
  }, []);

  const handleConfirmBooking = async (id) => {
    await spaService.confirmSpaBooking(id);
    await refreshBookings();
  };

  const handleRejectBooking = async (id, reason) => {
    await spaService.rejectSpaBooking(id, reason);
    await refreshBookings();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-white/10 rounded-xl">
              <Building2 className="w-5 h-5 text-purple-300" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black">
              Bảng điều khiển Chủ Spa & Đối tác (Owner Portal)
            </h1>
          </div>
          <p className="text-xs text-purple-200">
            Cơ sở: <b>{user?.spaName || 'Petosory Flagship Spa & Grooming'}</b> • Mã quản lý: SP-101
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl backdrop-blur-md">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-white text-purple-900 shadow-md'
                : 'text-purple-200 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Tổng quan
          </button>
          <button
            onClick={() => setActiveTab('management')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'management'
                ? 'bg-white text-purple-900 shadow-md'
                : 'text-purple-200 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" /> Quản lý dịch vụ & Menu
          </button>
        </div>
      </div>

      {/* Body content based on active tab */}
      {activeTab === 'dashboard' ? (
        <Dashboard
          bookings={bookings}
          onConfirmBooking={handleConfirmBooking}
          onRejectBooking={handleRejectBooking}
        />
      ) : (
        <Management spa={spa} />
      )}
    </div>
  );
};
export default OwnerDashboardPage;

