import { useMemo } from 'react';

export function CallVolumeChart() {
    // Mock data for 12 hours (9 AM to 9 PM)
    const data = useMemo(() => [
        { hour: '9 AM', calls: 12 },
        { hour: '10 AM', calls: 18 },
        { hour: '11 AM', calls: 25 },
        { hour: '12 PM', calls: 32 },
        { hour: '1 PM', calls: 22 },
        { hour: '2 PM', calls: 28 },
        { hour: '3 PM', calls: 35 },
        { hour: '4 PM', calls: 42 },
        { hour: '5 PM', calls: 38 },
        { hour: '6 PM', calls: 20 },
        { hour: '7 PM', calls: 15 },
        { hour: '8 PM', calls: 8 },
    ], []);

    const maxCalls = Math.max(...data.map(d => d.calls));
    const chartHeight = 160;
    const barWidth = 32;
    const gap = 16;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Call Volume Trends</h2>
                    <p className="text-sm text-gray-500">Hourly call distribution for today</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        Phone
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 ml-2">
                        <span className="w-2 h-2 rounded-full bg-gray-200"></span>
                        Web
                    </span>
                </div>
            </div>

            <div className="relative h-[200px] w-full overflow-x-auto custom-scrollbar">
                <div className="min-w-[600px] h-full flex items-end justify-between px-2 pb-6">
                    {data.map((item, index) => {
                        const height = (item.calls / maxCalls) * chartHeight;

                        return (
                            <div key={index} className="flex flex-col items-center gap-3 group relative">
                                {/* Tooltip */}
                                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                                    {item.calls} Calls
                                </div>

                                {/* Bar */}
                                <div
                                    className="w-8 rounded-t-lg bg-red-100 relative overflow-hidden group-hover:bg-red-200 transition-colors"
                                    style={{ height: `${height}px` }}
                                >
                                    <div
                                        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-red-600 to-red-400 opacity-80"
                                        style={{ height: `${height * 0.7}px` }}
                                    ></div>
                                </div>

                                {/* Label */}
                                <span className="text-xs font-medium text-gray-400">{item.hour}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Horizontal Grid lines */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="border-b border-dashed border-gray-100 w-full absolute top-[0%]"></div>
                    <div className="border-b border-dashed border-gray-100 w-full absolute top-[50%]"></div>
                    <div className="border-b border-dashed border-gray-100 w-full absolute top-[100%]"></div>
                </div>
            </div>
        </div>
    );
}
