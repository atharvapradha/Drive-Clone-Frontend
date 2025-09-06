import { useState } from "react";
import client from "../api/client";

export default function ShareModal({ fileId, onClose }) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("viewer");
  const [shareLink, setShareLink] = useState("");

  async function handleShare() {
    try {
      await client.post(`/api/files/${fileId}/share`, { email, permission });
      alert("User added successfully!");
      setEmail("");
    } catch (err) {
      alert("Error sharing: " + err.response?.data?.message);
    }
  }

  async function generateLink() {
    try {
      const res = await client.post(`/api/files/${fileId}/share-link`);
      setShareLink(res.data.link);
    } catch (err) {
      alert("Error generating link");
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">Share File</h2>

        {/* Invite by email */}
        <div className="mb-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="border p-2 rounded w-full mb-2"
          />
          <select
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>
          <button
            onClick={handleShare}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Share
          </button>
        </div>

        {/* Generate share link */}
        <div>
          <button
            onClick={generateLink}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Generate Link
          </button>
          {shareLink && (
            <div className="mt-3">
              <input
                readOnly
                value={shareLink}
                className="border p-2 rounded w-full"
              />
              <button
                onClick={() => navigator.clipboard.writeText(shareLink)}
                className="mt-2 bg-gray-600 text-white px-3 py-1 rounded"
              >
                Copy Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
