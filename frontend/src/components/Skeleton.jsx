import React from 'react';

export function CardSkeleton() {
  return (
    <div className="glass-card p-6 rounded-2xl animate-pulse">
      <div className="h-4 bg-slate-800 rounded w-1/3 mb-4"></div>
      <div className="h-8 bg-slate-800 rounded w-2/3 mb-2.5"></div>
      <div className="h-3 bg-slate-800 rounded w-1/2"></div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="w-full space-y-3.5 animate-pulse mt-4">
      <div className="grid grid-cols-5 gap-4 py-3 border-b border-slate-800">
        <div className="h-4 bg-slate-800 rounded"></div>
        <div className="h-4 bg-slate-800 rounded col-span-2"></div>
        <div className="h-4 bg-slate-800 rounded"></div>
        <div className="h-4 bg-slate-800 rounded"></div>
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="grid grid-cols-5 gap-4 py-4 border-b border-slate-900">
          <div className="h-3.5 bg-slate-900 rounded"></div>
          <div className="h-3.5 bg-slate-900 rounded col-span-2"></div>
          <div className="h-3.5 bg-slate-900 rounded"></div>
          <div className="h-3.5 bg-slate-900 rounded"></div>
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="glass-card p-8 rounded-2xl animate-pulse space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-slate-800 rounded-full"></div>
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-slate-800 rounded w-1/4"></div>
          <div className="h-4 bg-slate-800 rounded w-1/3"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-800">
        <div className="space-y-4">
          <div className="h-4 bg-slate-800 rounded w-2/3"></div>
          <div className="h-4 bg-slate-800 rounded w-1/2"></div>
          <div className="h-4 bg-slate-800 rounded w-3/4"></div>
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-slate-800 rounded w-1/2"></div>
          <div className="h-4 bg-slate-800 rounded w-2/3"></div>
          <div className="h-4 bg-slate-800 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
}
