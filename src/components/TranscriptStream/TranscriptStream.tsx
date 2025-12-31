import { useEffect, useRef } from 'react';
import { User, Bot } from 'lucide-react';
import type { TranscriptItem } from '../../types/call';
import { format } from 'date-fns';

interface TranscriptStreamProps {
    transcript: TranscriptItem[];
}

export function TranscriptStream({ transcript }: TranscriptStreamProps) {
    const endRef = useRef<HTMLDivElement>(null);

    const lastItemId = transcript[transcript.length - 1]?.id;

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript.length, lastItemId]);

    return (
        <div className="h-full overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {transcript.map((item) => {
                const isAI = item.speaker === 'AI';

                return (
                    <div
                        key={item.id}
                        className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isAI ? 'bg-gray-100' : 'bg-white border border-gray-300'
                            }`}>
                            {isAI ? (
                                <Bot className="w-4 h-4 text-gray-600" />
                            ) : (
                                <User className="w-4 h-4 text-gray-600" />
                            )}
                        </div>

                        <div className={`max-w-[70%] ${isAI ? '' : 'text-right'}`}>
                            <div className={`inline-block px-4 py-2 rounded-lg ${isAI
                                ? 'bg-gray-100 text-gray-900'
                                : 'bg-white border border-gray-200 text-gray-900'
                                }`}>
                                <p className="text-body">{item.text}</p>
                            </div>

                            <div className="text-meta text-gray-400 mt-1 px-1">
                                {format(item.timestamp, 'HH:mm:ss')}
                                {!item.isFinal && (
                                    <span className="ml-2 text-blue-500">typing...</span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            <div ref={endRef} />
        </div>
    );
}
