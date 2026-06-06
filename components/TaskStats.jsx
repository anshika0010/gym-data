import React from "react";
import {
  CheckCircle,
  Clock,
  CalendarDays,
  BarChart3,
} from "lucide-react";

const TaskStats = () => {
  const stats = [
    {
      title: "Completed Tasks",
      value: "1,245",
      icon: <CheckCircle size={24} />,
      bg: "bg-green-100",
      text: "text-green-600",
      progress: "w-[85%]",
      progressColor: "bg-green-500",
    },
    {
      title: "Pending Tasks",
      value: "89",
      icon: <Clock size={24} />,
      bg: "bg-red-100",
      text: "text-red-600",
      progress: "w-[45%]",
      progressColor: "bg-red-500",
    },
    {
      title: "Today's Tasks",
      value: "34",
      icon: <CalendarDays size={24} />,
      bg: "bg-blue-100",
      text: "text-blue-600",
      progress: "w-[65%]",
      progressColor: "bg-blue-500",
    },
    {
      title: "Monthly Tasks",
      value: "786",
      icon: <BarChart3 size={24} />,
      bg: "bg-purple-100",
      text: "text-purple-600",
      progress: "w-[75%]",
      progressColor: "bg-purple-500",
    },
  ];

  return (
    <section className="w-full bg-gray-50 py-2 sm:py-8 md:py-10 mb-18">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-3 md:mb-4">
          <h2 className="text-xl sm:text-lg md:text-lg font-bold text-gray-800">
            Task Overview
          </h2>
          <p className="text-sm sm:text-sm text-gray-500 mt-1">
            Monitor your task performance and productivity.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-2 md:p-2 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs sm:text-xs text-gray-500 font-medium">
                    {item.title}
                  </p>

                  <h3 className="text-xl sm:text-xl font-bold text-gray-800 mt-1">
                    {item.value}
                  </h3>
                </div>

                <div
                  className={`${item.bg} ${item.text} p-1 sm:p-1 rounded-lg sm:rounded-xl flex-shrink-0`}
                >
                  {item.icon}
                </div>
              </div>

              <div className="mt-4">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.progress} ${item.progressColor}`}
                  ></div>
                </div>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-gray-500">
                Updated today
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TaskStats;