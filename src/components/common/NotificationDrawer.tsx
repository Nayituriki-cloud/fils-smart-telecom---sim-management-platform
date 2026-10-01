import React, { useState } from 'react';
import { useFils } from '../../context/FilsContext';
import { X, Bell, CheckCircle2, AlertTriangle, Info, MessageSquare, Smartphone, CheckCheck } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useFils();
  const [filterChannel, setFilterChannel] = useState<'All' | 'SMS' | 'Push' | 'In-App'>('All');

  if (!isOpen) return null;

  const filtered = notifications.filter((n) =>
    filterChannel === 'All' ? true : n.channel === filterChannel
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400" />
            <h2 className="font-semibold text-white text-base">Network Notifications</h2>
            <span className="text-xs text-slate-400 font-mono">
              ({notifications.filter((n) => !n.read).length} new)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              title="Mark all as read"
              className="text-xs text-slate-400 hover:text-emerald-400 p-1 flex items-center gap-1 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Mark read</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Channel Filter */}
        <div className="p-3 border-b border-slate-800 bg-slate-900/60 flex items-center gap-1.5 overflow-x-auto">
          {(['All', 'SMS', 'Push', 'In-App'] as const).map((ch) => (
            <button
              key={ch}
              onClick={() => setFilterChannel(ch)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterChannel === ch
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-sm">
              No notifications in this channel
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => markNotificationRead(item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  item.read
                    ? 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {item.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : item.type === 'alert' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    ) : (
                      <Info className="w-4 h-4 text-sky-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4
                        className={`text-xs font-semibold truncate ${
                          item.read ? 'text-slate-300' : 'text-white'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {item.channel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-1.5">
                      {item.message}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{item.timestamp}</span>
                      {item.msisdn && <span>{item.msisdn}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer simulation info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            Carrier Gateway SMS Sync Active
          </span>
          <span className="text-emerald-400 font-medium">99.98% Deliverability</span>
        </div>
      </div>
    </div>
  );
};
