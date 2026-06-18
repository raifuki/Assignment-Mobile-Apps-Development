import React, { useState } from "react";
import { 
  Folder, FileCode, Copy, Check, Download, 
  HelpCircle, BookOpen, Layers, Terminal, Grid
} from "lucide-react";
import { KOTLIN_SOURCE_FILES, SourceFile } from "../data/kotlinSourceFiles";

interface CodeExporterProps {
  syncedTopicId: string;
}

export default function CodeExporter({ syncedTopicId }: CodeExporterProps) {
  const [activeTab, setActiveTab] = useState<"code" | "instructions" | "architecture">("code");
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [copiedFileIndex, setCopiedFileIndex] = useState<number | null>(null);

  const selectedFile = KOTLIN_SOURCE_FILES[selectedFileIndex];

  // Helper to copy file code to clipboard
  const handleCopyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedFileIndex(index);
    setTimeout(() => {
      setCopiedFileIndex(null);
    }, 2000);
  };

  // Helper to download single file directly
  const handleDownloadFile = (file: SourceFile) => {
    const blob = new Blob([file.code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-xl overflow-hidden flex flex-col h-full min-h-[640px] select-text">
      
      {/* Exporter Tabs */}
      <div className="flex border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/20 p-2.5 gap-1">
        <button
          onClick={() => setActiveTab("code")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === "code"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800/60"
          }`}
        >
          <FileCode className="w-4 h-4" />
          Mã Nguồn (Android Files)
        </button>
        <button
          onClick={() => setActiveTab("instructions")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === "instructions"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800/60"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Hướng Dẫn Chạy
        </button>
        <button
          onClick={() => setActiveTab("architecture")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === "architecture"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800/60"
          }`}
        >
          <Layers className="w-4 h-4" />
          Sơ Đồ MVVM & Điểm Số
        </button>
      </div>

      {/* ===================== TAB 1: CODE EXPLORER ===================== */}
      {activeTab === "code" && (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* File Trees Directory Explorer - Left sidebar of IDE panel */}
          <div className="w-full lg:w-60 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-zinc-800 bg-gray-50/20 dark:bg-zinc-900/30 p-3 overflow-y-auto flex flex-col gap-2">
            <div className="text-[10px] uppercase font-black tracking-wider text-gray-400 dark:text-zinc-500 mb-1 flex items-center gap-1">
              <Folder className="w-3.5 h-3.5" />
              <span>Project Files Tree</span>
            </div>
            
            <div className="space-y-1">
              {KOTLIN_SOURCE_FILES.map((file, idx) => {
                const isSelected = selectedFileIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedFileIndex(idx)}
                    className={`w-full text-left p-2 rounded-lg text-xs font-mono transition flex items-center gap-2 ${
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold border-l-4 border-indigo-650"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-105 hover:bg-gray-100 dark:hover:bg-zinc-800/40"
                    }`}
                  >
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"}`} />
                    <span className="truncate">{file.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-3 border-t border-gray-100 dark:border-zinc-800">
              <div className="bg-indigo-50/50 dark:bg-indigo-950/10 p-2.5 rounded-xl border border-indigo-100/40 dark:border-indigo-950/20">
                <h4 className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                  Mô Tả File Đang Xem
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mt-1">
                  {selectedFile.description}
                </p>
              </div>
            </div>
          </div>

          {/* Code Viewer Panel - Right side of IDE panel */}
          <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950 text-zinc-100 font-mono relative">
            
            {/* Header of code editor */}
            <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-2 text-[11px] font-bold">
                <span className="text-zinc-600 font-normal">Path:</span>
                <span className="text-zinc-200">{selectedFile.path}</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Download target file */}
                <button
                  onClick={() => handleDownloadFile(selectedFile)}
                  title="Tải tệp tin"
                  className="p-1 px-2 hover:bg-zinc-800 hover:text-white rounded text-zinc-400 transition flex items-center gap-1 text-[10px]"
                >
                  <Download className="w-3 h-3" />
                  Tải Về
                </button>
                {/* Copy content */}
                <button
                  onClick={() => handleCopyCode(selectedFile.code, selectedFileIndex)}
                  className="p-1 px-2 hover:bg-zinc-800 hover:text-white rounded text-zinc-400 transition flex items-center gap-1 text-[10px]"
                >
                  {copiedFileIndex === selectedFileIndex ? (
                    <>
                      <Check className="w-3 h-3 text-green-500" />
                      <span className="text-green-500">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Sau chép
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Simulated Editor Workspace */}
            <div className="flex-1 overflow-auto p-4 text-xs leading-relaxed max-h-[520px]">
              <pre className="select-text overflow-x-auto whitespace-pre font-mono selection:bg-indigo-900 select-all block">
                <code>{selectedFile.code}</code>
              </pre>
            </div>
            
            {/* Tip Overlay banner */}
            <div className="absolute bottom-3 left-4 bg-zinc-900/80 p-2 py-1.5 border border-zinc-800 rounded-lg text-[10px] text-zinc-400 flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-indigo-400" />
              <span>Copy file này cho vào thư mục tương đương của Android Studio</span>
            </div>
          </div>

        </div>
      )}

      {/* ===================== TAB 2: RUN INSTRUCTIONS ===================== */}
      {activeTab === "instructions" && (
        <div className="flex-1 p-6 overflow-y-auto max-h-[540px] space-y-5">
          <div className="border-l-4 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/10 p-4 rounded-r-xl">
            <h3 className="font-bold text-sm text-indigo-700 dark:text-indigo-400">
              💡 Làm thế nào để đạt 10/10 Assignment này?
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
              Bạn chỉ cần sao chép chuẩn mã nguồn từ tab <strong>Mã Nguồn</strong> lắp vào một Kotlin Gradle Project mới trong Android Studio. Đề tài này đã cấu trúc chuẩn theo mô hình MVVM (ViewModel + LiveData) và ConstraintLayout.
            </p>
          </div>

          <h3 className="font-black text-gray-800 dark:text-gray-100 text-sm flex items-center gap-1.5 pt-2">
            <Terminal className="w-4 h-4 text-indigo-500" />
            Các Bước Thiết Lập Trong Android Studio
          </h3>

          <ol className="space-y-4 text-xs text-gray-600 dark:text-gray-300">
            <li className="flex gap-2">
              <span className="w-5 h-5 min-w-5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 flex items-center justify-center font-bold">1</span>
              <div>
                <strong className="text-gray-800 dark:text-white">Tạo một Project mới:</strong> Open Android Studio, chọn <strong className="text-indigo-500">Empty Views Activity</strong> (Bản sườn XML) hoặc Empty Activity. Đặt tên Package là <code className="bg-gray-100 dark:bg-zinc-800 p-0.5 rounded font-mono text-pink-600">com.kotlin.quiz</code> và Ngôn ngữ là <strong className="text-indigo-500">Kotlin</strong>.
              </div>
            </li>

            <li className="flex gap-2">
              <span className="w-5 h-5 min-w-5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 flex items-center justify-center font-bold">2</span>
              <div>
                <strong className="text-gray-800 dark:text-white">Cấu hình Build Gradle & View Binding:</strong> Mở tệp <code className="bg-gray-100 dark:bg-zinc-800 p-0.5 rounded font-mono text-indigo-500">app/build.gradle</code>. Dán đè hoặc bổ sung phần <code className="bg-gray-100 dark:bg-zinc-800 p-0.5 rounded font-mono text-indigo-500">viewBinding &#123; enabled = true &#125;</code> và các dependencies RecyclerView, Lifecycle ViewModel như liệt kê ở file Gradle mẫu. Click <strong className="text-indigo-500">Sync Now</strong>.
              </div>
            </li>

            <li className="flex gap-2">
              <span className="w-5 h-5 min-w-5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 flex items-center justify-center font-bold">3</span>
              <div>
                <strong className="text-gray-800 dark:text-white">Kiến tạo Thư mục (Package):</strong>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Trực tiếp Click chuột phải vào <code className="p-0.5 bg-gray-150 rounded dark:bg-zinc-800">com.kotlin.quiz</code>, chọn New &gt; Package để tạo các thư mục con:
                </p>
                <div className="grid grid-cols-3 gap-2 mt-2 font-mono text-[10px]">
                  <div className="bg-gray-50 dark:bg-zinc-800/60 p-2 rounded border border-gray-100 dark:border-zinc-800 text-center">com.kotlin.quiz.model</div>
                  <div className="bg-gray-50 dark:bg-zinc-800/60 p-2 rounded border border-gray-100 dark:border-zinc-800 text-center">com.kotlin.quiz.viewmodel</div>
                  <div className="bg-gray-50 dark:bg-zinc-800/60 p-2 rounded border border-gray-100 dark:border-zinc-800 text-center">com.kotlin.quiz.adapter</div>
                </div>
              </div>
            </li>

            <li className="flex gap-2">
              <span className="w-5 h-5 min-w-5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 flex items-center justify-center font-bold">4</span>
              <div>
                <strong className="text-gray-800 dark:text-white">Sao Chép Mã Nguồn:</strong> Lần lượt tạo các tệp tin <code className="p-0.5 bg-gray-100 dark:bg-zinc-800 font-mono text-pink-600">Question.kt</code>, <code className="p-0.5 bg-gray-100 dark:bg-zinc-800 font-mono text-pink-600">QuizViewModel.kt</code>, <code className="p-0.5 bg-gray-100 dark:bg-zinc-800 font-mono text-pink-600">QuizAdapter.kt</code> và dán toàn bộ mã nguồn có sẵn tương đương vào đó. Sửa đổi <code className="p-0.5 bg-gray-100 dark:bg-zinc-800 font-mono text-pink-600">MainActivity.kt</code> và <code className="p-0.5 bg-gray-100 dark:bg-zinc-800 font-mono text-pink-600">QuizActivity.kt</code> ở thư mục gốc.
              </div>
            </li>

            <li className="flex gap-2">
              <span className="w-5 h-5 min-w-5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 flex items-center justify-center font-bold">5</span>
              <div>
                <strong className="text-gray-800 dark:text-white">Dán Bố cục XML Layouts:</strong> Mở thư mục <code className="bg-gray-100 dark:bg-zinc-800 p-0.5 rounded font-mono text-indigo-500">res/layout/</code>. Thay đổi code của <code className="bg-gray-100 dark:bg-zinc-800 p-0.5 rounded font-mono text-indigo-400">activity_main.xml</code>, tạo mới <code className="bg-gray-100 dark:bg-zinc-800 p-0.5 rounded font-mono text-indigo-400">activity_quiz.xml</code> và <code className="bg-gray-100 dark:bg-zinc-800 p-0.5 rounded font-mono text-indigo-400">item_quiz_review.xml</code> với mã giao diện thiết kế ConstraintLayout đầy cảm hứng của chúng tôi.
              </div>
            </li>

            <li className="flex gap-2">
              <span className="w-5 h-5 min-w-5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 flex items-center justify-center font-bold">6</span>
              <div>
                <strong className="text-gray-800 dark:text-white">Biên dịch và Xuất APK:</strong> Vào Menu <code className="bg-gray-100 dark:bg-zinc-800 p-0.5 rounded font-mono">Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</code> để sinh file APK thật. Chúc mừng bạn đã hoàn thành bài tập xuất sắc!
              </div>
            </li>
          </ol>
        </div>
      )}

      {/* ===================== TAB 3: ARCHITECTURE STUDY ===================== */}
      {activeTab === "architecture" && (
        <div className="flex-1 p-6 overflow-y-auto max-h-[540px] space-y-6">
          
          {/* Architecture Chart */}
          <div className="bg-gray-50 dark:bg-zinc-800/40 p-4 border border-gray-150 dark:border-zinc-800/80 rounded-2xl">
            <h4 className="font-extrabold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3 text-center">
              Sơ Đồ Kiến Trúc MVVM Trong Đề Tài Lập Trình Kotlin Quiz
            </h4>
            
            {/* Visual graph layout */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-2 w-full justify-around text-center text-[10px] font-mono">
                <div className="flex-1 bg-cyan-600 text-white p-2 rounded-xl font-bold shadow-md">
                   XML Layout Components
                  <div className="text-[8px] font-normal opacity-90 mt-0.5">ConstraintLayout / Material UI</div>
                </div>
                <div className="flex items-center text-gray-400">◁ Lắng nghe (Observe)</div>
                <div className="flex-1 bg-indigo-600 text-white p-2 rounded-xl font-bold shadow-md">
                  View (Activities)
                  <div className="text-[8px] font-normal opacity-90 mt-0.5">MainActivity & QuizActivity</div>
                </div>
              </div>

              <div className="text-gray-400 text-xs py-1">⬇ Gọi hành động / Tương tác</div>

              <div className="flex gap-2 w-full justify-around text-center text-[10px] font-mono">
                <div className="flex-1 bg-emerald-600 text-white p-2 rounded-xl font-bold shadow-md">
                  Repository / Model
                  <div className="text-[8px] font-normal opacity-90 mt-0.5">Question Data Class</div>
                </div>
                <div className="flex items-center text-gray-400">Đẩy Dữ Liệu ▷</div>
                <div className="flex-1 bg-violet-700 text-white p-2 rounded-xl font-bold shadow-md">
                  ViewModel
                  <div className="text-[8px] font-normal opacity-90 mt-0.5">QuizViewModel & LiveData</div>
                </div>
              </div>
              
              <div className="text-gray-400 text-xs py-1">⬇ Lưu trữ cục bộ</div>
              
              <div className="w-1/2 bg-amber-500 text-white text-center p-2 rounded-xl text-[10px] font-mono font-bold shadow">
                SharedPreferences
                <div className="text-[8px] font-normal opacity-95 mt-0.5">Lưu trữ High Score bền vững</div>
              </div>
            </div>
          </div>

          {/* Assessment Criteria Checklist */}
          <div>
            <h3 className="font-black text-gray-800 dark:text-gray-100 text-xs uppercase tracking-wider mb-2.5">
              Tiêu Chí Đánh Giá Điểm Thầy Cô Giao (Checklist)
            </h3>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <div className="bg-emerald-100 dark:bg-emerald-950/80 p-0.5 rounded text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px]">ĐẠT</div>
                <div>
                  <strong className="text-gray-800 dark:text-zinc-200">Hoàn thành đầy đủ chức năng cơ bản (70 điểm):</strong> Ít nhất 10 câu hỏi trắc nghiệm chia theo chủ đề đa dạng, phản hồi feedback giải thích kết quả ngay tức thời, lưu High Score, thiết lập countdown.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="bg-emerald-100 dark:bg-emerald-950/80 p-0.5 rounded text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px]">ĐẠT</div>
                <div>
                  <strong className="text-gray-800 dark:text-zinc-200">Giao diện đẹp, Responsive (10 điểm):</strong> Sử dụng bộ CSS ConstraintLayout, card layout bóng mịn màng và thiết lập tối ưu khi xoay hướng điện thoại.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="bg-emerald-100 dark:bg-emerald-950/80 p-0.5 rounded text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px]">ĐẠT</div>
                <div>
                  <strong className="text-gray-800 dark:text-zinc-200">Xử lý lỗi & Lifecycle (10 điểm):</strong> Triệt tiêu Null Safety triệt để của Kotlin, huỷ bỏ CountDownTimer khi activity bị huỷ (<code className="p-0.5 bg-gray-100 dark:bg-zinc-800 font-mono text-[10px]">onDestroy</code>) để tránh crash.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="bg-emerald-100 dark:bg-emerald-950/80 p-0.5 rounded text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px]">ĐẠT</div>
                <div>
                  <strong className="text-gray-800 dark:text-zinc-200">Kiến trúc MVVM & clean code (10 điểm):</strong> Tách biệt logic game ra khỏi Activity và cài trong <code className="p-0.5 bg-gray-100 dark:bg-zinc-800 font-mono text-[10px]">QuizViewModel</code>, tận dụng LiveData để cập nhật dữ liệu.
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
