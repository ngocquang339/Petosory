import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Phone, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';

export const SpaMapCard = ({ spa, onBookClick }) => {
  if (!spa) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-4 space-y-3 max-w-sm w-full">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100">
        <img src={spa.image} alt={spa.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3 text-emerald-400" />
          <span>{spa.openTime}</span>
        </div>
        {spa.verified && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
            <CheckCircle2 className="w-3 h-3" />
            <span>Đối tác xác thực</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">
            {spa.name}
          </h4>
          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{spa.rating}</span>
          </div>
        </div>

        <div className="flex items-start gap-1.5 text-xs text-slate-500">
          <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{spa.address}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Phone className="w-3.5 h-3.5 text-sky-500 shrink-0" />
          <span>{spa.phone}</span>
        </div>
      </div>

      {/* Services tags */}
      <div className="flex flex-wrap gap-1">
        {spa.services.slice(0, 2).map((srv, idx) => (
          <span
            key={idx}
            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-orange-50 dark:bg-slate-800 text-orange-700 dark:text-orange-300 border border-orange-100 dark:border-slate-700"
          >
            {srv.name}
          </span>
        ))}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <Link to={`/spa/${spa.id}`}>
          <Button variant="outline" size="sm" className="w-full text-xs">
            Chi tiết <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
        <Button
          variant="primary"
          size="sm"
          className="w-full text-xs"
          onClick={() => onBookClick && onBookClick(spa)}
        >
          Đặt lịch Spa
        </Button>
      </div>
    </div>
  );
};
export default SpaMapCard;

