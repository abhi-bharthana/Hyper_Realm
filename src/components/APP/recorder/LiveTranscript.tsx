import { useEffect, useRef } from 'react';
import { listen } from '@tauri-apps/api/event';
import { useRecorderStore } from '../../../store/useRecorderStore';

export const LiveTranscript = () => {
  const { transcripts, addTranscript } = useRecorderStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let unlisten: () => void;
    const setupListener = async () => {
      unlisten = await listen<string>('transcript-update', (event) => {
        addTranscript(event.payload);
      });
    };
    setupListener();
    return () => { if (unlisten) unlisten(); };
  }, [addTranscript]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  // Themed background replacing hardcoded gray-900
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-100 dark:bg-black/20 rounded-[1.25rem] border border-slate-200 dark:border-white/5 shadow-inner my-4 transition-colors duration-300">
      {transcripts.length === 0 ? (
        <p className="text-slate-500 dark:text-gray-500 italic text-center mt-4">Transcripts will appear here...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {transcripts.map((item, idx) => (
            <p key={item.id || idx} className="text-slate-800 dark:text-zinc-300 text-lg leading-relaxed animate-fade-in-up">
              {item.text}
            </p>
          ))}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};