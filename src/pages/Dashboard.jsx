import { useState } from "react";
import { useFiles } from "../hooks/useFiles";
import UploadArea from "../components/UploadArea";
import SearchBar from "../components/SearchBar";
import PreviewModal from "../components/PreviewModal";
import ShareModal from "../components/ShareModal";
import VersionHistoryModal from "../components/VersionHistoryModal";
import { FixedSizeList as List } from "react-window";
import SortBar from "../components/SortBar";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [folderId, setFolderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("name");
  const [previewFile, setPreviewFile] = useState(null);
  const [shareFileId, setShareFileId] = useState(null);
  const [versionFileId, setVersionFileId] = useState(null);

  const { data: files = [], refetch } = useFiles(folderId, searchQuery, sort);
  const nav = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    nav("/login");
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden sm:flex flex-col w-60 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold text-blue-600 mb-6">Cloudrive</h2>
        <nav className="flex flex-col gap-3">
          <button
            onClick={() => setFolderId(null)}
            className="text-left px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
          >
            📁 My Drive
          </button>
          <button
            onClick={() => nav("/trash")}
            className="text-left px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition"
          >
            🗑 Trash
          </button>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex items-center justify-between bg-white shadow-sm px-4 py-3">
          <div className="flex-1 max-w-md">
            <SearchBar onSearch={setSearchQuery} />
          </div>
          <div className="flex items-center gap-3">
            <SortBar onChange={setSort} />
            <button
              onClick={logout}
              className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Upload Section */}
        <div className="p-4">
          <UploadArea parentId={folderId} onComplete={() => refetch()} />
        </div>

        {/* File List */}
        <div className="flex-1 p-4">
          {files.length > 0 ? (
            <List
              height={500}
              itemCount={files.length}
              itemSize={90}
              width="100%"
            >
              {({ index, style }) => {
                const file = files[index];
                return (
                  <div
                    key={file.id}
                    style={style}
                    className="p-4 bg-white rounded-lg shadow hover:shadow-md transition flex justify-between items-center mb-2 mx-1"
                  >
                    <div
                      className="cursor-pointer flex-1"
                      onClick={() => setPreviewFile(file)}
                    >
                      <p className="font-medium text-gray-800 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {file.size} KB •{" "}
                        {new Date(file.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-3 ml-3">
                      <button
                        onClick={() => setShareFileId(file.id)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Share
                      </button>
                      <button
                        onClick={() => setVersionFileId(file.id)}
                        className="text-purple-600 hover:underline text-sm"
                      >
                        Versions
                      </button>
                    </div>
                  </div>
                );
              }}
            </List>
          ) : (
            <p className="text-gray-500 text-center mt-10">
              No files yet. Upload something!
            </p>
          )}
        </div>
      </div>

      {/* Modals */}
      {previewFile && (
        <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
      {shareFileId && (
        <ShareModal fileId={shareFileId} onClose={() => setShareFileId(null)} />
      )}
      {versionFileId && (
        <VersionHistoryModal
          fileId={versionFileId}
          onClose={() => setVersionFileId(null)}
        />
      )}
    </div>
  );
}
