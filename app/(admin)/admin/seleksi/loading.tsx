import React from 'react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-white/50 backdrop-blur-sm rounded-lg">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Memuat data seleksi...</p>
    </div>
  );
};

export default Loading;
