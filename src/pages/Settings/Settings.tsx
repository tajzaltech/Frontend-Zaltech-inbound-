import { useState } from 'react';
import { Header } from '../../components/layout/Header';
import { Save, Play, Mic, MessageSquare } from 'lucide-react';

export function Settings() {
    const [agentName, setAgentName] = useState('Sarah');
    const [voiceId, setVoiceId] = useState('female-1');
    const [greeting, setGreeting] = useState("Hi! I'm calling from Zaltech to discuss your recent inquiry. Is this a good time to talk?");

    // Mock save handler
    const handleSave = () => {
        // In a real app, this would save to backend/store
        alert('Settings saved successfully!');
    };

    const voices = [
        { id: 'female-1', name: 'Sarah (US)', gender: 'Female', description: 'Professional, warm, and clear.' },
        { id: 'male-1', name: 'Michael (US)', gender: 'Male', description: 'Deep, trustworthy, and authoritative.' },
        { id: 'female-2', name: 'Emma (UK)', gender: 'Female', description: 'Polite, sophisticated British accent.' },
    ];

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAFA]">
            <Header title="Agent Settings" />

            <div className="flex-1 overflow-auto p-4 lg:p-8">
                <div className="max-w-3xl mx-auto space-y-8">

                    {/* General Settings */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Mic className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Voice Configuration</h2>
                                <p className="text-sm text-gray-500">Choose how your AI agent sounds to customers.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">Select Voice</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {voices.map((voice) => (
                                    <div
                                        key={voice.id}
                                        onClick={() => setVoiceId(voice.id)}
                                        className={`cursor-pointer border rounded-xl p-4 transition-all relative ${voiceId === voice.id
                                                ? 'border-red-600 bg-red-50 ring-1 ring-red-600'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-sm font-bold ${voiceId === voice.id ? 'text-red-700' : 'text-gray-900'}`}>{voice.name}</span>
                                            {voiceId === voice.id && (
                                                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 leading-snug mb-3">{voice.description}</p>
                                        <button className="text-xs flex items-center gap-1.5 text-gray-600 font-medium hover:text-red-600 transition-colors" onClick={(e) => { e.stopPropagation(); /* play sample */ }}>
                                            <Play className="w-3 h-3 fill-current" />
                                            Play Sample
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Script Settings */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Conversation Script</h2>
                                <p className="text-sm text-gray-500">Customize how the agent starts the conversation.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Agent Name</label>
                                <input
                                    type="text"
                                    value={agentName}
                                    onChange={(e) => setAgentName(e.target.value)}
                                    className="w-full max-w-md px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Greeting Message</label>
                                <div className="relative">
                                    <textarea
                                        value={greeting}
                                        onChange={(e) => setGreeting(e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm resize-none custom-scrollbar"
                                    />
                                    <span className="absolute bottom-3 right-3 text-xs text-gray-400">
                                        {greeting.length} chars
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Tip: Keep the greeting short and friendly. Ask a question to engage the user immediately.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Save Action */}
                    <div className="flex justify-end pt-4 pb-12">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-xl font-medium shadow-lg shadow-red-600/20 hover:bg-red-700 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-sm"
                        >
                            <Save className="w-4 h-4" />
                            Save Configuration
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
