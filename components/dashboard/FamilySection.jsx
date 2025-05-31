const FamilySection = () => {
  const teamMembers = [
    { name: "David Kim", role: "Developer", avatar: "DK", status: "online" },
    { name: "Sarah Chen", role: "Designer", avatar: "SC", status: "online" },
    { name: "Michael Brown", role: "Manager", avatar: "MB", status: "away" },
    { name: "Lisa Wong", role: "Analyst", avatar: "LW", status: "offline" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-400";
      case "away":
        return "bg-yellow-400";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Family Members
      </h3>

      <div className="space-y-3 mb-4">
        {teamMembers.map((member, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {member.avatar}
                </span>
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(
                  member.status
                )} rounded-full border-2 border-white`}
              ></div>
            </div>
            <div>
              <p className="font-medium text-gray-900">{member.name}</p>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-medium">
        + Add Family Member
      </button>
    </div>
  );
};

export default FamilySection;
