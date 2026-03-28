import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { UploadCloud, File, X, CheckCircle2, AlertCircle, FileText, ShieldCheck, GraduationCap, Clock } from 'lucide-react';

export default function UploadPage({ onNavigate, isAdmin }: { onNavigate: (screen: string) => void, isAdmin?: boolean }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        setUploadStatus('idle');
      } else {
        setUploadStatus('error');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        setUploadStatus('idle');
      } else {
        setUploadStatus('error');
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus('success');
          setTimeout(() => {
            onNavigate('dashboard');
          }, 1500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="flex min-h-screen bg-academic-paper">
      <Sidebar currentScreen="upload" onNavigate={onNavigate} isAdmin={isAdmin} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-academic-navy/5 flex items-center px-10 shrink-0 z-10">
          <h1 className="text-2xl font-serif font-bold text-academic-navy tracking-tight">Archive Ingestion</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 pb-24 md:pb-10 flex items-center justify-center">
          <div className="w-full max-w-3xl">
            
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-academic-navy/5 p-8 md:p-14 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-academic-navy via-academic-blue to-academic-gold opacity-30"></div>
              
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-academic-blue/5 rounded-full mb-6">
                  <ShieldCheck className="w-4 h-4 text-academic-blue" />
                  <span className="text-[10px] font-bold text-academic-blue uppercase tracking-widest">Secure Scholar Ingestion</span>
                </div>
                <h2 className="text-4xl font-serif font-bold text-academic-navy mb-4">Ingest New Source Material</h2>
                <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
                  Provide your academic documentation to initiate semantic synthesis and evaluation generation.
                </p>
              </div>

              {/* Drag & Drop Area */}
              {!selectedFile && uploadStatus !== 'error' && (
                <div 
                  className={`border-2 border-dashed rounded-[2rem] p-16 flex flex-col items-center justify-center transition-all group ${
                    isDragging 
                      ? 'border-academic-blue bg-academic-blue/5 scale-[0.99]' 
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-academic-blue/30 hover:shadow-xl hover:shadow-academic-navy/5'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 mb-6 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-10 h-10 text-academic-navy" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-academic-navy mb-2">Deposit Manuscript</h3>
                  <p className="text-sm text-slate-400 font-medium mb-10 tracking-wide uppercase">PDF Format • Maximum 50MB</p>
                  
                  <label className="bg-academic-navy text-white px-10 py-4 rounded-2xl text-sm font-bold hover:bg-academic-blue transition-all shadow-xl shadow-academic-navy/20 cursor-pointer active:scale-95">
                    Browse Local Archive
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}

              {/* Error State */}
              {uploadStatus === 'error' && !selectedFile && (
                <div className="border-2 border-dashed border-red-200 bg-red-50/50 rounded-[2rem] p-16 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6 border border-red-100">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-red-900 mb-2">Format Rejection</h3>
                  <p className="text-sm text-red-600 font-medium mb-10 leading-relaxed">
                    The provided document does not adhere to the accepted PDF standard. Please verification the file format and try again.
                  </p>
                  <button 
                    onClick={() => setUploadStatus('idle')}
                    className="bg-white border border-red-200 text-red-700 px-10 py-4 rounded-2xl text-sm font-bold hover:bg-red-50 transition-all shadow-sm"
                  >
                    Reset Ingestion
                  </button>
                </div>
              )}

              {/* Selected File State */}
              {selectedFile && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white border border-slate-100 shadow-xl shadow-academic-navy/5 rounded-[1.5rem] p-6 flex items-center justify-between">
                    <div className="flex items-center gap-6 overflow-hidden">
                      <div className="w-16 h-16 bg-academic-blue/5 text-academic-blue rounded-2xl flex items-center justify-center shrink-0 border border-academic-blue/10">
                        <FileText className="w-8 h-8" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-lg font-serif font-bold text-academic-navy truncate">{selectedFile.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {uploadStatus === 'idle' && (
                      <button 
                        onClick={() => setSelectedFile(null)}
                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    )}
                    
                    {uploadStatus === 'success' && (
                      <div className="p-3 bg-emerald-50 rounded-xl">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {uploadStatus === 'uploading' && (
                    <div className="space-y-4 px-2">
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-academic-blue uppercase tracking-widest">Status</span>
                          <span className="text-sm font-bold text-academic-navy">Ingesting and Indexing...</span>
                        </div>
                        <span className="text-2xl font-serif font-bold text-academic-blue">{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                        <div 
                          className="h-full bg-academic-navy rounded-full transition-all duration-300 relative"
                          style={{ width: `${uploadProgress}%` }}
                        >
                          <div className="absolute top-0 right-0 w-8 h-full bg-white/20 skew-x-12 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-50">
                    <button 
                      onClick={() => onNavigate('dashboard')}
                      disabled={uploadStatus === 'uploading'}
                      className="flex-1 bg-white border border-slate-200 text-slate-500 px-8 py-4 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all disabled:opacity-50 uppercase tracking-widest"
                    >
                      Archive Navigation
                    </button>
                    <button 
                      onClick={handleUpload}
                      disabled={uploadStatus === 'uploading' || uploadStatus === 'success'}
                      className="flex-[2] bg-academic-navy text-white px-8 py-4 rounded-2xl text-sm font-bold hover:bg-academic-blue transition-all shadow-xl shadow-academic-navy/20 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
                    >
                      {uploadStatus === 'uploading' ? (
                        <>
                          <Clock className="w-5 h-5 animate-spin" />
                          Processing Archive...
                        </>
                      ) : uploadStatus === 'success' ? (
                        <>
                          <ShieldCheck className="w-5 h-5" />
                          Archive Secured
                        </>
                      ) : (
                        <>
                          <GraduationCap className="w-5 h-5" />
                          Initiate Synthesis
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
