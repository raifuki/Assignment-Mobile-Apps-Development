/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Smartphone, GraduationCap, CheckCircle2, Award } from "lucide-react";
import DeviceSimulator from "./components/DeviceSimulator";

export default function App() {
  // Empty handler since code exporter is removed as requested by the user
  const handleSelectTopicCode = () => {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 font-sans text-gray-800 dark:text-gray-100 transition-colors duration-300">
      
      {/* Dynamic Header */}
      <header className="border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/15">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-gray-950 dark:text-white font-display">
                Kotlin Android Quiz Studio
              </h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                Assignments & Learning Companion • MVVM Architecture
              </p>
            </div>
          </div>

          {/* Core Info badge */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100/30 dark:border-indigo-950/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
              Chuẩn Kotlin 1.9 & SDK 34
            </span>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 select-none">
        
        {/* Banner Alert for quick instructions */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-950/15 dark:to-cyan-950/5 border border-indigo-100/50 dark:border-indigo-950/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex gap-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-750 dark:text-indigo-300 rounded-xl shrink-0 mt-0.5 sm:mt-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-extrabold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
                <span>🚀 GIẢI PHÁP HỌC TẬP KOTLIN ANDROID</span>
              </h2>
              <p className="text-[11px] text-gray-650 dark:text-gray-400 mt-1 leading-relaxed">
                Trải nghiệm ứng dụng thi trắc nghiệm trực quan được thiết kế theo chuẩn mô hình <strong>MVVM Architecture</strong>. Quản lý trạng thái thông qua ViewModel và lưu trữ SharedPreferences giả lập tuyệt vời!
              </p>
            </div>
          </div>
        </div>

        {/* Master Panel Grid Layout - Centered Device Simulator */}
        <div className="flex justify-center transition-all">
          <div className="w-full max-w-[420px] bg-white dark:bg-zinc-900 rounded-[40px] shadow-2xl overflow-hidden border border-gray-200/50 dark:border-zinc-800/50">
            <div className="p-2">
              <DeviceSimulator onSelectTopicCode={handleSelectTopicCode} />
            </div>
          </div>
        </div>

      </main>

      {/* Premium minimal Footer */}
      <footer className="border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal">
            Ứng dụng giả lập Kotlin Android Quiz được phát triển độc quyền dành cho thế hệ lập trình viên tài năng.
          </p>
          <p className="text-[10px] text-gray-400 dark:text-zinc-650 font-mono">
            Vite + React 19 • Tailwind CSS v4 • Web Audio API Synth • SharedPreferences Mock
          </p>
        </div>
      </footer>
    </div>
  );
}
