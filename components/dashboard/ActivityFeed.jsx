const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      user: "John Doe",
      action: "completed project milestone",
      time: "2 minutes ago",
      avatar: "JD",
      type: "success",
    },
    {
      id: 2,
      user: "Sarah Wilson",
      action: "uploaded new documents",
      time: "15 minutes ago",
      avatar: "SW",
      type: "info",
    },
    {
      id: 3,
      user: "Mike Chen",
      action: "requested budget approval",
      time: "1 hour ago",
      avatar: "MC",
      type: "warning",
    },
    {
      id: 4,
      user: "Lisa Brown",
      action: "updated team schedule",
      time: "3 hours ago",
      avatar: "LB",
      type: "info",
    },
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "info":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Activities
        </h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div
              className={`w-8 h-8 ${getTypeColor(
                activity.type
              )} rounded-full flex items-center justify-center flex-shrink-0`}
            >
              <span className="text-white text-xs font-medium">
                {activity.avatar}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.user}</span>{" "}
                {activity.action}
              </p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
          Load More Activities
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;
