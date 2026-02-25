'use client';
import { useState, useRef } from 'react';
import PrivacyBadge from './PrivacyBadge';

interface Props {
  onUpload: (file: File) => Promise<void>;
}

export default function DocumentUpload({ onUpload }: Props) {
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setStatus('uploading');
    setMessage('Reading document... Extracting address... Verifying...');
    try {
      await onUpload(file);
      setStatus('done');
      setMessage('Verified! You can now leave reviews and read all reviews.');
    } catch (e: any) {
      setStatus('error');
      setMessage(e.message || 'Verification failed. Please try a clearer document.');
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition ${
          dragging ? 'border-gold-500 bg-gold-50' : 'border-navy-200 hover:border-navy-400'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        <div className="text-4xl mb-2">📄</div>
        <p className="font-medium text-navy-800">Drop your document here or tap to upload</p>
        <p className="text-xs text-navy-400 mt-1">Lease agreement, rent receipt, or utility bill</p>
      </div>

      {status !== 'idle' && (
        <div className={`text-sm text-center p-3 rounded-xl ${
          status === 'uploading' ? 'bg-blue-50 text-blue-700' :
          status === 'done' ? 'bg-emerald-50 text-emerald-700' :
          'bg-red-50 text-red-700'
        }`}>
          {status === 'uploading' && <span className="animate-pulse">⏳ </span>}
          {message}
        </div>
      )}

      <PrivacyBadge message="Your document will be permanently deleted after verification. We only keep the verified address." />
    </div>
  );
}
