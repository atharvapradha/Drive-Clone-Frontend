import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import client from '../api/client';

export default function UploadArea({ parentId, onComplete }){
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (files) => {
    for (const file of files) {
      const form = new FormData();
      form.append('file', file);
      if (parentId) form.append('parentId', parentId);

      try {
        const res = await client.post('/api/files/upload', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total))
        });
        setProgress(0);
        onComplete?.(res.data);
      } catch (err) {
        console.error('Upload error', err);
      }
    }
  }, [parentId, onComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="border-2 border-dashed p-6 rounded text-center cursor-pointer">
      <input {...getInputProps()} />
      <p>{isDragActive ? 'Drop files here...' : 'Drag files here or click to upload'}</p>
      {progress > 0 && (
        <div className="mt-3 h-2 bg-gray-200 rounded">
          <div style={{width: `${progress}%`}} className="h-2 rounded bg-blue-600"/>
        </div>
      )}
    </div>
  );
}
