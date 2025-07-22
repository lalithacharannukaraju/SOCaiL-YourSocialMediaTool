import React, { useState, useEffect } from "react";
import gif from "../assets/okok-unscreen.gif";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Dashboard() {
  const [progress, setProgress] = useState({
    currentStreak: 0,
    highestStreak: 0,
    lastUpdated: null,
  });
  const [uploadSuggestion, setUploadSuggestion] = useState("");
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [history, setHistory] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostDate, setNewPostDate] = useState(null);

  const tips = [
    "Consistency is key—post regularly to engage your audience.",
    "Use eye-catching visuals to make your posts stand out.",
    "Experiment with posting times to discover what works best.",
    "Engage with your followers by responding to comments and messages.",
    "Plan your content in advance to maintain quality.",
    "Leverage trending hashtags to increase visibility.",
    "Analyze your performance metrics to refine your strategy.",
  ];

  // Fetch progress and history from backend
  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        // Fetch progress
        const progressRes = await axios.get(`${BACKEND_URL}/progress`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setProgress({
          currentStreak: progressRes.data.currentStreak,
          highestStreak: progressRes.data.highestStreak,
          lastUpdated: progressRes.data.lastUpdated,
        });
        // Fetch history (if you have a history endpoint, otherwise keep as is)
        // Example: const historyRes = await axios.get(`${BACKEND_URL}/progress/history`, ...)
        // setHistory(historyRes.data);
      } catch (err) {
        setError("Failed to load progress data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setTip(randomTip);
  }, []);

  const suggestUploadTime = () => {
    const day = new Date().getDay();
    const suggestions = [
      "Sunday: Best time is 9 AM - 12 PM",
      "Monday: Best time is 11 AM - 2 PM",
      "Tuesday: Best time is 10 AM - 1 PM",
      "Wednesday: Best time is 12 PM - 3 PM",
      "Thursday: Best time is 1 PM - 4 PM",
      "Friday: Best time is 3 PM - 6 PM",
      "Saturday: Best time is 10 AM - 12 PM",
    ];
    setUploadSuggestion(suggestions[day]);

    const now = new Date();
    const bestEndTime = new Date();
    const timeSlots = [
      [9, 12],
      [11, 14],
      [10, 13],
      [12, 15],
      [13, 16],
      [15, 18],
      [10, 12],
    ];
    const [_, endHour] = timeSlots[day];
    bestEndTime.setHours(endHour, 0, 0, 0);

    if (now < bestEndTime) {
      const diff = bestEndTime - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown({ hours, minutes, seconds });
    } else {
      setCountdown(null);
    }
  };

  useEffect(() => {
    suggestUploadTime();
    const interval = setInterval(suggestUploadTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const markSuccess = () => {
    // This should call a backend endpoint to update the streak and history
    // For now, just update local state
    setProgress((prev) => {
      const newCurrentStreak = prev.currentStreak + 1;
      return {
        ...prev,
        currentStreak: newCurrentStreak,
        highestStreak: Math.max(newCurrentStreak, prev.highestStreak),
      };
    });
    // Optionally, update backend here
  };

  const resetStreak = () => {
    // This should call a backend endpoint to reset the streak
    setProgress((prev) => ({ ...prev, currentStreak: 0 }));
    // Optionally, update backend here
  };

  const onMonthChange = (date) => {
    setCurrentMonth(date);
  };

  const isFutureDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  // Add a new scheduled post
  const handleSchedulePost = () => {
    if (!newPostContent || !newPostDate) return;
    setScheduledPosts([
      ...scheduledPosts,
      { content: newPostContent, date: newPostDate }
    ]);
    setNewPostContent("");
    setNewPostDate(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl text-gray-600">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center h-screen text-xl text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-purple-50 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Scheduler and Tracker Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mt-8 mb-8 w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-purple-700 mb-4">Scheduler and Tracker</h2>
        <p className="text-gray-700 mb-6">Schedule your content accordingly for maximum reach and track your progress, for better productivity.</p>
        <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter post content..."
            value={newPostContent}
            onChange={e => setNewPostContent(e.target.value)}
          />
          <DatePicker
            selected={newPostDate}
            onChange={date => setNewPostDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Pick date & time"
            className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSchedulePost}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Schedule
          </button>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Upcoming Scheduled Posts</h3>
          {scheduledPosts.length === 0 ? (
            <p className="text-gray-500">No posts scheduled yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {scheduledPosts
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((post, idx) => (
                  <li key={idx} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between">
                    <span className="text-gray-700">{post.content}</span>
                    <span className="text-gray-500 text-sm mt-1 md:mt-0">{post.date.toLocaleString()}</span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
      <div className="relative z-10 p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-10 text-center">
        {/* Countdown Timer */}
        <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-10 flex flex-col items-center justify-center space-y-6">
          <h1 className="text-4xl font-bold text-purple-700">
            Optimal Posting Time
          </h1>
          {countdown ? (
            <div className="grid grid-flow-col gap-8 text-center auto-cols-max">
              <div className="flex flex-col p-4 bg-purple-700 rounded-lg text-white">
                <span className="countdown font-mono text-7xl font-bold">
                  {countdown.hours}
                </span>
                <span className="text-xl">hours</span>
              </div>
              <div className="flex flex-col p-4 bg-purple-700 rounded-lg text-white">
                <span className="countdown font-mono text-7xl font-bold">
                  {countdown.minutes}
                </span>
                <span className="text-xl">minutes</span>
              </div>
              <div className="flex flex-col p-4 bg-purple-700 rounded-lg text-white">
                <span className="countdown font-mono text-7xl font-bold">
                  {countdown.seconds}
                </span>
                <span className="text-xl">seconds</span>
              </div>
            </div>
          ) : (
            <p className="text-red-500 font-bold text-xl">
              The best time has passed for today.
            </p>
          )}
          <p className="text-lg text-gray-600 mt-2">{uploadSuggestion}</p>
        </div>

        {/* GIF Streak Tracker */}
        <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-10 space-y-8 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <img
              src={gif}
              alt="Custom Streak GIF"
              className="h-48 w-48 object-cover"
            />
          </div>
          <p className="text-muted-foreground text-lg">
            Current: {progress.currentStreak} | Highest: {progress.highestStreak}
          </p>
          <div className="flex justify-center space-x-8 mt-4">
            <button
              onClick={markSuccess}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Mark Success
            </button>
            <button
              onClick={resetStreak}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Reset Streak
            </button>
          </div>
          <div className="text-center text-purple-700 text-lg font-medium">
            "Every streak starts with one step. Keep going, you're amazing!"
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-purple-700 text-white rounded-lg shadow-lg p-6 mt-8 mx-6 lg:mx-16 text-center">
        <h3 className="text-2xl font-semibold mb-4">Today's Tip</h3>
        <p className="text-lg font-medium">{tip}</p>
      </div>

      {/* Calendar Section */}
      {showCalendar && (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Full Calendar
          </h4>
          <Calendar
            onActiveStartDateChange={({ activeStartDate }) =>
              onMonthChange(activeStartDate)
            }
            value={currentMonth}
            tileDisabled={({ date }) => isFutureDate(date)}
            tileContent={({ date }) => {
              const day = history.find(
                (d) => d.date === date.toISOString().split("T")[0]
              );
              return day?.success ? (
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mt-1"></div>
              ) : null;
            }}
            maxDetail="month"
            minDetail="month"
            showNavigation={true}
            navigationLabel={({ label }) => (
              <span className="text-lg font-medium text-gray-800">
                {label}
              </span>
            )}
            className="border rounded-lg p-4"
            prev2Label={null}
            next2Label={null}
          />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
