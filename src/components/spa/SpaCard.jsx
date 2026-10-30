import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Phone, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import Button from '../common/Button';

export const SpaCard = ({ spa, onSelect, onBook, isSelected = false }) => {
  return (
    <div
      onClick={() => onSelect && onSelect(spa)}
      className={`group bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-300 p-4 flex flex-col sm:flex-row gap-4 cursor-pointer ${
        isSelected
          ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-lg'
          : 'border-slate-100 dark:border-slate-700/70 hover:border-orange-300 shadow-xs hover:shadow-md'
      }`}
    >
      {/* Thumbnail */}
      <div className="relative w-full sm:w-44 h-36 rounded-xl overflow-hidden bg-slate-100 shrink-0">
        <img
          src={spa.image}
          alt={spa.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3 text-emerald-400" /> {spa.openTime}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors">
                  {spa.name}
                </h3>
                {spa.verified && (
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" title="Đã chứng nhận" />
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="line-clamp-1">{spa.address}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-amber-50 dark:bg-slate-700 px-2 py-1 rounded-lg text-amber-600 font-bold text-xs shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{spa.rating}</span>
              <span className="text-slate-400 font-normal">({spa.reviewCount})</span>
            </div>
          </div>

          {/* Services list highlights */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {spa.services.map((srv, idx) => (
              <span
                key={idx}
                className="text-[11px] bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-md font-medium"
              >
                {srv.name} • <b className="text-orange-600 dark:text-orange-400">{formatCurrency(srv.price)}</b>
              </span>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 dark:border-slate-700">
          <span className="text-xs text-slate-400">
            Hotline: <strong className="text-slate-700 dark:text-slate-200">{spa.phone}</strong>
          </span>

          <div className="flex items-center gap-2">
            <Link
              to={`/spa/${spa.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-orange-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Xem chi tiết
            </Link>
            <Button
              size="sm"
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                onBook && onBook(spa);
              }}
            >
              Đặt lịch ngay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SpaCard;

