import React, { useState } from 'react';
import { Notice, CalendarEvent } from '../../types.ts';
import { Bell, Calendar, Pin, ChevronRight, X, Clock, FileText } from 'lucide-react';

interface NoticesCalendarProps {
  notices: Notice[];
  calendar: CalendarEvent[];
}

export const NoticesCalendar: React.FC<NoticesCalendarProps> = ({ notices, calendar }) => {
  const [activeTab, setActiveTab] = useState<'notices' | 'calendar'>('notices');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [noticeFilter, setNoticeFilter] = useState<string>('all');

  const filteredNotices = notices.filter((n) => {
    if (noticeFilter === 'all') return true;
    return n.category.toLowerCase() === noticeFilter.toLowerCase();
  });

  return (
    <section id="notices" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Section Header with Segmented Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-900">
              Communication & Institutional Timelines
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Notices, Circulars & Academic Calendar
            </h2>
            <p className="text-sm text-slate-600">
              Stay informed with official circulars, examination schedules, gazetted holidays, and school community events.
            </p>
          </div>

          {/* Interactive Tab Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              onClick={() => setActiveTab('notices')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-all flex items-center gap-2 ${
                activeTab === 'notices'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bell className="w-3.5 h-3.5 text-indigo-900" />
              <span>Official Notices ({notices.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-all flex items-center gap-2 ${
                activeTab === 'calendar'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-900" />
              <span>Academic Calendar ({calendar.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Notices & Circulars */}
        {activeTab === 'notices' && (
          <div className="space-y-6">
            {/* Filter buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-medium mr-1">Filter by:</span>
              {['all', 'admission', 'examination', 'academic', 'general'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setNoticeFilter(cat)}
                  className={`px-3 py-1 rounded-md transition-colors capitalize ${
                    noticeFilter === cat
                      ? 'bg-indigo-900 text-white font-medium'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Notices List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNotices.map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => setSelectedNotice(notice)}
                  className={`p-6 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    notice.isImportant
                      ? 'border-amber-300 bg-amber-50/40 hover:bg-amber-50/70'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        {notice.isImportant && (
                          <span className="text-amber-700 font-semibold flex items-center gap-1">
                            <Pin className="w-3 h-3 rotate-45" /> Urgent Notice
                          </span>
                        )}
                        <span className="capitalize text-slate-600">{notice.category}</span>
                      </div>
                      <span className="tabular-nums">{notice.date}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 hover:text-indigo-950">
                      {notice.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {notice.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-indigo-900">
                    <span>Read full circular</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>

            {filteredNotices.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-sm">
                No circulars match the selected category.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Academic Calendar Planner */}
        {activeTab === 'calendar' && (
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="p-4 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">
              <span>Annual Academic Session 2026-27</span>
              <span>Events & Examination Timetable</span>
            </div>

            <div className="divide-y divide-slate-100">
              {calendar.map((event) => (
                <div
                  key={event.id}
                  className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/75 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-800 shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {event.startDate.slice(5, 7) === '10' ? 'OCT' :
                         event.startDate.slice(5, 7) === '11' ? 'NOV' :
                         event.startDate.slice(5, 7) === '12' ? 'DEC' : 'DATE'}
                      </span>
                      <span className="text-lg font-bold tabular-nums">
                        {event.startDate.slice(8, 10)}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                          event.eventType === 'Holiday' ? 'bg-rose-100 text-rose-800' :
                          event.eventType === 'Exam' ? 'bg-amber-100 text-amber-900' :
                          event.eventType === 'PTM' ? 'bg-indigo-100 text-indigo-900' :
                          'bg-emerald-100 text-emerald-900'
                        }`}>
                          {event.eventType}
                        </span>
                        {event.endDate && event.endDate !== event.startDate && (
                          <span className="text-slate-500 text-xs">
                            Through {event.endDate}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{event.title}</h3>
                      {event.description && (
                        <p className="text-xs text-slate-600">{event.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-1.5 self-start sm:self-center">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Campus Event</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notice Modal Viewer */}
        {selectedNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-xl border border-slate-200">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-indigo-900">{selectedNotice.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{selectedNotice.date}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    {selectedNotice.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed space-y-3">
                <p>{selectedNotice.content}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Modern Public Sr. Sec. School, Swarghat</span>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-xs font-semibold"
                >
                  Close Circular
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
