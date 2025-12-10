import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip
} from 'recharts';

const DashboardAreaChart = () => {
    // Dummy data matching the chart in the image
    const chartData = [
        { month: 'Apr 2025', series1: 75000, series2: 150000, series3: 310000 },
        { month: 'May 2025', series1: 125000, series2: 200000, series3: 290000 },
        { month: 'Jun 2025', series1: 145000, series2: 230000, series3: 280000 },
        { month: 'Jul 2025', series1: 105000, series2: 205000, series3: 285000 },
        { month: 'Aug 2025', series1: 115000, series2: 215000, series3: 300000 },
        { month: 'Sep 2025', series1: 45000, series2: 220000, series3: 270000 },
        { month: 'Oct 2025', series1: 40000, series2: 150000, series3: 290000 },
        { month: 'Nov 2025', series1: 80000, series2: 185000, series3: 255000 },
        { month: 'Dec 2025', series1: 15000, series2: 175000, series3: 215000 },
        { month: 'Jan 2026', series1: 75000, series2: 135000, series3: 285000 },
        { month: 'Feb 2026', series1: 30000, series2: 180000, series3: 250000 },
        { month: 'Mar 2026', series1: 35000, series2: 200000, series3: 270000 }
    ];

    /* biar bisa break ke bawah labalnya */
    const CustomXAxisTick = ({ x, y, payload }) => {
        const parts = payload.value.split(' ');
        const month = parts[0]; // e.g., "Jan"
        const year = parts[1];  // e.g., "2025"

        return (
            <g transform={`translate(${x},${y})`}>
                <text
                    x={0}
                    y={0}
                    dy={16}
                    textAnchor="middle"
                    fill="#9ca3af"
                    fontSize={14}
                >
                    {month}
                </text>
                <text
                    x={0}
                    y={0}
                    dy={32}
                    textAnchor="middle"
                    fill="#9ca3af"
                    fontSize={14}
                >
                    {year}
                </text>
            </g>
        );
    };

    // Format Y-axis values
    const formatYAxis = (value) => {
        if (value >= 1000) {
            return `${value / 1000} K`;
        }
        return value;
    };

    return (
        <div 
            className="bg-white"
        >
            <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 0, right: 5, left: -5, bottom: 0 }}
                    >
                        {/* Subtle grid lines */}
                        <CartesianGrid
                            strokeDasharray="0"
                            stroke="#e5e7eb"
                            horizontal={false}
                        />

                        {/* X-Axis styling */}
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={<CustomXAxisTick />}
                            height={60}
                            dy={10}
                        />

                        {/* Y-Axis styling */}
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 14, fill: '#9ca3af' }}
                            domain={[0, 350000]}
                            ticks={[0, 50000, 100000, 150000, 200000, 250000, 300000]}
                            tickFormatter={formatYAxis}
                            dx={-10}
                        />

                        {/* Tooltip */}
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '12px'
                            }}
                            formatter={(value) => `$${value.toLocaleString()}`}
                        />

                        {/* Color Fill Gradients */}
                        <defs>
                            {/* Blue gradient */}
                            <linearGradient id="colorSeries1" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#dbeafe" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#dbeafe" stopOpacity={0} />
                            </linearGradient>
                            {/* Orange gradient */}
                            <linearGradient id="colorSeries2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fed7aa" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#fed7aa" stopOpacity={0} />
                            </linearGradient>
                            {/* Teal gradient */}
                            <linearGradient id="colorSeries3" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ccfbf1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ccfbf1" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        {/* Area 3 - Teal (Draw first, appears at back) */}
                        <Area
                            type="monotone"
                            dataKey="series3"
                            stroke="#14b8a6"
                            strokeWidth={2}
                            fill="url(#colorSeries3)"
                            fillOpacity={1}
                            dot={{ fill: '#14b8a6', strokeWidth: 0, r: 3 }}
                            activeDot={{ r: 5, fill: '#0d9488', strokeWidth: 2, stroke: '#fff' }}
                        />

                        {/* Area 2 - Orange (Draw second, appears in middle) */}
                        <Area
                            type="monotone"
                            dataKey="series2"
                            stroke="#f97316"
                            strokeWidth={2}
                            fill="url(#colorSeries2)"
                            fillOpacity={1}
                            dot={{ fill: '#f97316', strokeWidth: 0, r: 3 }}
                            activeDot={{ r: 5, fill: '#ea580c', strokeWidth: 2, stroke: '#fff' }}
                            baseLine={0}
                        />

                        {/* Area 1 - Blue (Draw last, appears at front) */}
                        <Area
                            type="monotone"
                            dataKey="series1"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fill="url(#colorSeries1)"
                            fillOpacity={1}
                            dot={{ fill: '#3b82f6', strokeWidth: 0, r: 3 }}
                            activeDot={{ r: 5, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                            baseLine={0}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DashboardAreaChart;