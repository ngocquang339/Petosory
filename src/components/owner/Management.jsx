import React, { useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { formatCurrency } from '../../utils/helpers';

export const Management = ({ spa }) => {
  const [spaName, setSpaName] = useState(spa?.name || 'Petosory Spa');
  const [phone, setPhone] = useState(spa?.phone || '0988 123 456');
  const [address, setAddress] = useState(spa?.address || '142 Hoàng Cầu, Đống Đa, Hà Nội');
  const [openTime, setOpenTime] = useState(spa?.openTime || '08:00 - 20:30');
  const [services, setServices] = useState(spa?.services || []);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [saved, setSaved] = useState(false);

  const handleAddService = (e) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice) return;
    setServices([
      ...services,
      { name: newServiceName, price: Number(newServicePrice), duration: '60 phút' },
    ]);
    setNewServiceName('');
    setNewServicePrice('');
  };

  const handleRemoveService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-xs space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Cấu hình thông tin cơ sở Spa
        </h3>
        <p className="text-xs text-slate-400">
          Chỉnh sửa thông tin xuất hiện trên bản đồ Pet Map và hệ thống đặt lịch
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Tên Spa" value={spaName} onChange={(e) => setSpaName(e.target.value)} />
        <Input label="Số điện thoại CSKH" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input label="Địa chỉ" value={address} onChange={(e) => setAddress(e.target.value)} />
        <Input label="Thời gian hoạt động" value={openTime} onChange={(e) => setOpenTime(e.target.value)} />
      </div>

      {/* Services List Management */}
      <div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3">
          Bảng giá dịch vụ chăm sóc:
        </h4>

        <div className="space-y-2 mb-4">
          {services.map((srv, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 text-xs"
            >
              <div>
                <span className="font-bold text-slate-800 dark:text-white">{srv.name}</span>
                <span className="text-slate-400 ml-2">({srv.duration})</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-orange-600 dark:text-orange-400">
                  {formatCurrency(srv.price)}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveService(idx)}
                  className="text-rose-500 hover:text-rose-700 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add new service */}
        <form onSubmit={handleAddService} className="flex gap-2">
          <input
            type="text"
            placeholder="Tên dịch vụ mới (VD: Nhuộm tai, Tắm thảo mộc...)"
            value={newServiceName}
            onChange={(e) => setNewServiceName(e.target.value)}
            className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
          <input
            type="number"
            placeholder="Giá (VNĐ)"
            value={newServicePrice}
            onChange={(e) => setNewServicePrice(e.target.value)}
            className="w-32 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
          <Button type="submit" size="sm" variant="secondary" icon={Plus}>
            Thêm
          </Button>
        </form>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
        {saved && <span className="text-xs text-emerald-600 font-bold">✓ Đã lưu thay đổi thành công!</span>}
        <Button variant="primary" size="md" icon={Save} onClick={handleSave} className="ml-auto">
          Lưu cấu hình Spa
        </Button>
      </div>
    </div>
  );
};
export default Management;

