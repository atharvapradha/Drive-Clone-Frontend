import { useQuery, useQueryClient } from "@tanstack/react-query";
import client from "../api/client";
import { useState } from "react";

export default function Trash() {
  const queryClient = useQueryClient();
  const [loadingId, setLoadingId] = useState(null);

  // Fetch trashed files
  const { data: files, isLoading, isError } = useQuery(["trash"], () =>
    client.get("/api/files", { params: { trash: true } }).then((res) => res.data)
  );

  async function restoreFile(id) {
    setLoadingId(id);
    try {
      await client.post(`/api/files/${id}/restore`);
      queryClient.invalidateQueries(["trash"]);
      queryClient.invalidateQueries(["files"]); // refresh dashboard
    } catch (err) {
      alert("Error restoring file");
    } finally {
      setLoadingId(null);
    }
  }

  async function deleteFile(id) {
    if (!window.confirm("Delete permanently? This cannot be undone.")) return;
    setLoadingId(id);
    try {
      await client.delete(`/api/files/${id}`, { params: { permanent: true } });
      queryClient.invalidateQueries(["trash"]);
    } catch (err) {
      alert("Error deleting file");
    } finally {
      setLoadingId(null);
    }
  }

  if (isLoading) return <p className="p-4">Loading trash...</p>;
  if (isError) return <p className="p-4 text-red-500">Failed to load trash.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Trash</h1>
      {files?.length === 0 ? (
        <p className="text-gray-600">Trash is empty.</p>
      ) : (
        <ul className="space-y-3">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center justify-between border p-3 rounded"
            >
              <span>{file.name}</span>
              <div className="flex gap-2">
                <button
                  disabled={loadingId === file.id}
                  onClick={() => restoreFile(file.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
                >
                  Restore
                </button>
                <button
                  disabled={loadingId === file.id}
                  onClick={() => deleteFile(file.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50"
                >
                  Delete Permanently
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
