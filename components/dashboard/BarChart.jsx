const BarChart = () => {
  const chartData = [
    { month: "Jan", value: 45, label: "45" },
    { month: "Feb", value: 65, label: "65" },
    { month: "Mar", value: 30, label: "30" },
    { month: "Apr", value: 80, label: "80" },
    { month: "May", value: 55, label: "55" },
    { month: "Jun", value: 90, label: "90" },
    { month: "Jul", value: 70, label: "70" },
    { month: "Aug", value: 40, label: "40" },
    { month: "Sep", value: 85, label: "85" },
    { month: "Oct", value: 60, label: "60" },
    { month: "Nov", value: 75, label: "75" },
    { month: "Dec", value: 95, label: "95" },
  ];

  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Monthly Analytics
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Sales</span>
          </div>
          <div className="text-gray-600">
            Total:{" "}
            <span className="font-semibold text-blue-600">
              {chartData.reduce((sum, item) => sum + item.value, 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between h-68 space-x-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="relative w-full flex items-end h-58">
              <div
                className={`w-full ${
                  index === 3 || index === 8 ? "bg-red-500" : "bg-blue-500"
                } rounded-t-sm relative transition-all duration-300 hover:opacity-80`}
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              >
                {/* Value label on top of bar */}
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                  {item.label}
                </span>
              </div>
            </div>
            <span className="text-xs text-gray-500 mt-2">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
