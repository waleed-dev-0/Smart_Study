import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import {
  Search,
  FileText,
  Calendar,
  HardDrive,
  ChevronRight,
  ArrowLeft,
  Library,
  Trash2,
} from "lucide-react";
import { useEffect } from "react";

export default function DocumentLibraryPage({
  isAdmin,
}: {
  isAdmin?: boolean;
}) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  type document = {
    _id: string;
    title: string;
    file_path: string;
    file_size_bytes?: number;
    file_format?: string;
    page_count?: number;
    processing_status?: string;
    is_secondary?: boolean;
    createdAt: string;
    updatedAt: string;
  };

  const [documents, setDocuments] = useState<document[]>([]);

  useEffect(() => {
   fetch("http://localhost:5000/api/documents",{
       headers: {
           Authorization: `Bearer ${localStorage.getItem("token")}`,
       }
   }).then(res=>res.json())
       .then(data=>{
           setDocuments(data.data)
       })
  }, []);

  const filteredDocs = documents.filter((document) =>
    document.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatSize = (bytes?: number) => {
    if (!bytes) return "0 MB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/documents/${id}`, {
            method: "DELETE",
                headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        const data = await res.json();
        if (data.success) {
            const updatedDocuments = documents.filter((document) => document._id !== id);
            setDocuments(updatedDocuments);
        } else {
            alert("Failed to delete document");
        }
    } catch (error) {
        console.error("Delete error:", error);
    }
};

  return (
    <div className="flex min-h-screen bg-academic-paper">
      <Sidebar currentScreen="dashboard" isAdmin={isAdmin} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-academic-navy/5 flex items-center px-6 md:px-10 shrink-0 z-10 gap-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-3 bg-slate-50 hover:bg-academic-navy hover:text-white rounded-xl text-slate-500 transition-all shrink-0 hover:shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <Library className="w-6 h-6 text-academic-navy" />
            <h1 className="text-2xl font-serif font-bold text-academic-navy tracking-tight">
              Scholarly Archive
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 pb-24 md:pb-10">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 flex flex-col sm:flex-row gap-6">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-slate-300" />
                </div>
                <input
                  type="text"
                  placeholder="Query source materials by nomenclature or classification..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4.5 bg-white border border-slate-200 rounded-[1.5rem] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-academic-blue/5 focus:border-academic-blue shadow-xl shadow-academic-navy/5 transition-all font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {documents.map((document: document) => (
                <div
                  key={document._id}
                  onClick={() => navigate("/chat")}
                  className="bg-white rounded-3xl border border-slate-100 p-7 hover:border-academic-blue/30 hover:shadow-2xl transition-all cursor-pointer group flex flex-col justify-between h-full relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-academic-blue -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>

                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-academic-blue/10 text-academic-blue flex items-center justify-center group-hover:bg-academic-blue group-hover:text-white transition-all">
                      <FileText className="w-7 h-7" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <h3
                        className="text-2xl font-bold text-academic-blue truncate"
                        title={document.title}
                      >
                        {document.title}
                      </h3>

                      <span className="text-sm font-medium text-academic-blue/70 uppercase tracking-widest mt-1">
                        {document.file_format}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto space-y-4">
                    <div className="flex flex-col gap-1 text-sm text-academic-blue/70">
                      <span>
                        Uploaded:{" "}
                        {new Date(document.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center pt-4 border-t border-academic-blue/10">
                      <span className="flex items-center gap-2 text-sm text-academic-blue font-medium">
                        <HardDrive className="w-5 h-5" />
                        {formatSize(document.file_size_bytes)}
                      </span>

                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(document._id);
                          }}
                          className="p-2 rounded-xl text-red-500 hover:bg-red-100 hover:text-red-700 hover:scale-110
                                          transition-all duration-200"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                        <ChevronRight className="w-6 h-6 text-academic-blue/60 group-hover:text-academic-blue transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredDocs.length === 0 && (
              <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-slate-200 border-dashed">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-slate-100">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-academic-navy mb-2">
                  No Records Found
                </h3>
                <p className="text-slate-500 font-medium">
                  Your search query did not correlate with any archives in this
                  repository.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-8 text-academic-blue font-bold uppercase tracking-widest text-xs hover:text-academic-navy transition-colors"
                >
                  Clear All Parameters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
