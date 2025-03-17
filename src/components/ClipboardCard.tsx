import { memo } from 'react';
import { invoke } from '@tauri-apps/api/core';
import toast from 'react-hot-toast';

interface ClipboardCardProps {
  text: string;
  appTitle: string;
}

const ClipboardCard = memo(({ text, appTitle }: ClipboardCardProps) => {
  const handleCopy = async () => {
    await invoke('set_clipboard_text', { text });
    toast.success('Copied to clipboard!');
  };

  return (
    <div 
      onClick={handleCopy}
      className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
    >
      <p className="text-sm line-clamp-3 mb-2">{text}</p>
      <p className="text-xs text-gray-500">{appTitle}</p>
    </div>
  );
});

export default ClipboardCard; 