import { useQuery, useQueryClient } from "@tanstack/react-query";
import client from "../api/client";

export default function VersionHistoryModal({ fileId, onClose }) {
  const queryClient = useQueryClient();

  // Fetch versions for the file
  const { data: versions, isLoading, isError } = useQuery(
    ["versions", fileId],
    () => client.get(`/api/files/${fileId}/versions`).then((res) => res.data),
    { enabled: !!fileId }
  );

  async function restoreVersion(versionId) {
    try {
      await client.post(`/api/files/${fileId}/versions/${versionId}/restore`);
      alert("File restored to this version!");
      queryClient.invalidateQueries(["files"]); // refresh file list
      onClose();
    } catch (err) {
      alert("Error restoring version");
    }
  }

  if (!fileId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">File Versions</h2>

        {isLoading && <p>Loading versions...</p>}
        {isError && <p className="text-red-500">Failed to load versions.</p>}
        {!isLoading && versions?.length === 0 && <p>No versions found.</p>}

        <ul className="space-y-3 max-h-96 overflow-y-auto">
          {versions?.map((v) => (
            <li
              key={v.id}
              className="flex items-center justify-between border p-3 rounded"
            >
              <div>
                <p className="font-medium">{v.name || "Unnamed Version"}</p>
                <p className="text-sm text-gray-500">
                  {new Date(v.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={v.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Download
                </a>
                <button
                  onClick={() => restoreVersion(v.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Restore
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
