import {useState, useEffect} from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const GEMINI_URL = import.meta.env.VITE_GEMINI_URL || 'http://localhost:5001';

function Compiler() {
  const [twitterTrends, setTwitterTrends] = useState([]);
  const [twitterLoading, setTwitterLoading] = useState(true);
  const [twitterError, setTwitterError] = useState(null);
  const [instagramTrends, setInstagramTrends] = useState([]);
  const [tiktokTrends, setTiktokTrends] = useState([]);
  const [currentTrends, setCurrentTrends] = useState(null);
  const [incrementalIndex, setIncrementalIndex] = useState(0); // For incremental rendering
  const [userQuery, setUserQuery] = useState(''); // User question for RAG
  const [aiAnswer, setAiAnswer] = useState(''); // AI/RAG response
  const [loadingAI, setLoadingAI] = useState(false); // Loading state for Ask AI

  // Fetch Twitter trends
  useEffect(() => {
    setTwitterLoading(true);
    setTwitterError(null);
    fetch(`${BACKEND_URL}/twitter-trends`)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => setTwitterTrends(data))
      .catch((error) => setTwitterError(error.message))
      .finally(() => setTwitterLoading(false));
  }, []);

  // Fetch Instagram trends
  useEffect(() => {
    fetch(`${BACKEND_URL}/instagram-trends`)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => setInstagramTrends(data))
      .catch((error) => console.error('Error fetching Instagram trends:', error));
  }, []);

  // Fetch TikTok trends
  useEffect(() => {
    fetch(`${BACKEND_URL}/tiktok-trends`)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => setTiktokTrends(data))
      .catch((error) => console.error('Error fetching TikTok trends:', error));
  }, []);

  // Sort trends by ranking for incremental view (Twitter)
  const sortedTwitterTrends = Array.isArray(twitterTrends)
    ? [...twitterTrends].sort((a, b) => parseInt(b.Count) - parseInt(a.Count))
    : [];

  // Twitter Trends Incremental View
  const IncrementalTrendView = () => {
    if (twitterLoading) {
      return <div className="text-lg text-gray-500 mt-10">Loading Twitter trends...</div>;
    }
    if (twitterError) {
      return <div className="text-lg text-red-500 mt-10">Error: {twitterError}</div>;
    }
    const trendsToShow = sortedTwitterTrends.slice(0, incrementalIndex + 5); // Show 5 trends at a time

    return (
      <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4">
        <button
          className="bg-gray-500 text-white py-3 px-8 rounded-lg text-lg font-medium hover:bg-gray-600 transform transition duration-300 ease-in-out mb-8"
          onClick={() => setCurrentTrends(null)}
        >
          Back to Home
        </button>

        <div className="w-full max-w-4xl space-y-6">
          {trendsToShow.map((trend, index) => (
            <div
              key={index}
              className="flex items-center gap-6 bg-white shadow-md rounded-lg h-28 px-6 hover:bg-gray-100 transition duration-300"
            >
              <div className="text-blue-500 font-bold text-3xl">{index + 1}</div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-gray-800 truncate">{trend.Trend}</h3>
                <p className="text-sm text-gray-500">Popularity: {trend.Count}</p>
              </div>
            </div>
          ))}
        </div>

        {incrementalIndex + 5 < sortedTwitterTrends.length && (
          <button
            className="mt-10 bg-blue-500 text-white py-3 px-8 rounded-lg text-lg font-medium hover:bg-blue-600 transform transition duration-300 ease-in-out"
            onClick={() => setIncrementalIndex(incrementalIndex + 5)}
          >
            Load More
          </button>
        )}
      </div>
    );
  };

  // Instagram Trends View
  const InstagramTrendView = () => {
    const trendEntries = Array.isArray(instagramTrends)
      ? instagramTrends
      : Object.entries(instagramTrends);

    if (trendEntries.length === 0) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <p className="text-gray-500 text-lg">No Instagram trends available.</p>
          <button
            className="mt-6 bg-gray-500 text-white py-3 px-8 rounded-lg hover:bg-gray-600"
            onClick={() => setCurrentTrends(null)}
          >
            Back to Home
          </button>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4">
        <button
          className="bg-gray-500 text-white py-3 px-8 rounded-lg text-lg font-medium hover:bg-gray-600 transform transition duration-300 ease-in-out mb-8"
          onClick={() => setCurrentTrends(null)}
        >
          Back to Home
        </button>
        <div className="w-full max-w-4xl space-y-6">
          {trendEntries.map((trend, index) => (
            <div
              key={index}
              className="flex items-center gap-6 bg-white shadow-md rounded-lg h-28 px-6 hover:bg-gray-100 transition duration-300"
            >
              <div className="text-pink-500 font-bold text-3xl">{index + 1}</div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-gray-800 truncate">{trend.Trend || trend[0]}</h3>
                <p className="text-sm text-gray-500">Popularity: {trend.Count || trend[1]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // TikTok Trends View
  const TiktokTrendView = () => {
    const trendEntries = Array.isArray(tiktokTrends)
      ? tiktokTrends
      : Object.entries(tiktokTrends);

    if (trendEntries.length === 0) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <p className="text-gray-500 text-lg">No TikTok trends available.</p>
          <button
            className="mt-6 bg-gray-500 text-white py-3 px-8 rounded-lg hover:bg-gray-600"
            onClick={() => setCurrentTrends(null)}
          >
            Back to Home
          </button>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4">
        <button
          className="bg-gray-500 text-white py-3 px-8 rounded-lg text-lg font-medium hover:bg-gray-600 transform transition duration-300 ease-in-out mb-8"
          onClick={() => setCurrentTrends(null)}
        >
          Back to Home
        </button>
        <div className="w-full max-w-4xl space-y-6">
          {trendEntries.map((trend, index) => (
            <div
              key={index}
              className="flex items-center gap-6 bg-white shadow-md rounded-lg h-28 px-6 hover:bg-gray-100 transition duration-300"
            >
              <div className="text-red-500 font-bold text-3xl">{index + 1}</div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-gray-800 truncate">{trend.Trend || trend[0]}</h3>
                <p className="text-sm text-gray-500">Popularity: {trend.Count || trend[1]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Handle user RAG/AI query powered by the Gemini RAG service (Models/gemini.py)
  const handleAskAI = async () => {
    if (!userQuery.trim()) return;
    setLoadingAI(true);
    setAiAnswer('');
    try {
      const response = await fetch(`${GEMINI_URL}/askai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userQuery }),
      });
      const data = await response.json();
      setAiAnswer(data.content || data.error || 'No answer received.');
    } catch (error) {
      console.error('Error contacting Gemini RAG backend:', error);
      setAiAnswer('Error contacting AI backend.');
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4">
      {/* RAG/AI Query Section (Gemini RAG over Twitter trends) */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mb-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Ask the Trend Compiler (RAG)</h2>
        <p className="text-sm text-gray-500 mb-3">
          Ask questions about what&apos;s trending. Your query will be answered using the RAG model that reads the latest Twitter trends.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="e.g. What kind of content should I post around the top 5 trends?"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAskAI}
            disabled={loadingAI}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-60"
          >
            {loadingAI ? 'Thinking...' : 'Ask AI'}
          </button>
        </div>
        {aiAnswer && (
          <div className="mt-4 border border-blue-100 bg-blue-50 rounded-lg p-4 text-gray-800 whitespace-pre-line">
            {aiAnswer}
          </div>
        )}
      </div>

      {/* Main Trend Selection UI */}
      {currentTrends === null ? (
        <div className="flex gap-x-20">
          <button
            className="relative flex flex-col items-center justify-center h-[300px] w-[300px] bg-gray-800 text-white shadow-2xl rounded-full transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-blue-600 before:duration-500 before:ease-out hover:shadow-blue-600 hover:before:h-[300px] hover:before:w-[300px] hover:before:left-1/2 hover:before:top-1/2 hover:before:-translate-x-1/2 hover:before:-translate-y-1/2"
            onClick={() => {
              setCurrentTrends('twitter');
              setIncrementalIndex(0); // Reset index for incremental view
            }}
          >
            <svg className="z-10 w-24 h-24 text-white" xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" viewBox="0 0 16 16">
              <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H0.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
            </svg>
            <span className="text-2xl font-extrabold text-white z-10 mt-4">Twitter Trends</span>
          </button>

          <button
            className="relative flex flex-col items-center justify-center h-[300px] w-[300px] bg-gray-800 text-white shadow-2xl rounded-full transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-[#DD2A7B] before:duration-500 before:ease-out hover:shadow-[#DD2A7B] hover:before:h-[300px] hover:before:w-[300px] hover:before:left-1/2 hover:before:top-1/2 hover:before:-translate-x-1/2 hover:before:-translate-y-1/2"
            onClick={() => setCurrentTrends('instagram')}
          >
            <svg className="z-10 w-24 h-24 text-white" xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 15C4.14 15 1 11.86 1 8S4.14 1 8 1s7 3.14 7 7-3.14 7-7 7zm0-13C5.24 2 3 4.24 3 7c0 2.76 2.24 5 5 5s5-2.24 5-5c0-2.76-2.24-5-5-5zm0 9c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
            </svg>
            <span className="text-2xl font-extrabold text-white z-10 mt-4">Instagram Trends</span>
          </button>

          <button
            className="relative flex flex-col items-center justify-center h-[300px] w-[300px] bg-gray-800 text-white shadow-2xl rounded-full transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-red-600 before:duration-500 before:ease-out hover:shadow-red-600 hover:before:h-[300px] hover:before:w-[300px] hover:before:left-1/2 hover:before:top-1/2 hover:before:-translate-x-1/2 hover:before:-translate-y-1/2"
            onClick={() => setCurrentTrends('tiktok')}
          >
            <svg className="z-10 w-24 h-24 text-white" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50" fill="white">
            <path d="M 9 4 C 6.2495759 4 4 6.2495759 4 9 L 4 41 C 4 43.750424 6.2495759 46 9 46 L 41 46 C 43.750424 46 46 43.750424 46 41 L 46 9 C 46 6.2495759 43.750424 4 41 4 L 9 4 z M 9 6 L 41 6 C 42.671576 6 44 7.3284241 44 9 L 44 41 C 44 42.671576 42.671576 44 41 44 L 9 44 C 7.3284241 44 6 42.671576 6 41 L 6 9 C 6 7.3284241 7.3284241 6 9 6 z M 26.042969 10 A 1.0001 1.0001 0 0 0 25.042969 10.998047 C 25.042969 10.998047 25.031984 15.873262 25.021484 20.759766 C 25.016184 23.203017 25.009799 25.64879 25.005859 27.490234 C 25.001922 29.331679 25 30.496833 25 30.59375 C 25 32.409009 23.351421 33.892578 21.472656 33.892578 C 19.608867 33.892578 18.121094 32.402853 18.121094 30.539062 C 18.121094 28.675273 19.608867 27.1875 21.472656 27.1875 C 21.535796 27.1875 21.663054 27.208245 21.880859 27.234375 A 1.0001 1.0001 0 0 0 23 26.240234 L 23 22.039062 A 1.0001 1.0001 0 0 0 22.0625 21.041016 C 21.906673 21.031216 21.710581 21.011719 21.472656 21.011719 C 16.223131 21.011719 11.945313 25.289537 11.945312 30.539062 C 11.945312 35.788589 16.223131 40.066406 21.472656 40.066406 C 26.72204 40.066409 31 35.788588 31 30.539062 L 31 21.490234 C 32.454611 22.653646 34.267517 23.390625 36.269531 23.390625 C 36.542588 23.390625 36.802305 23.374442 37.050781 23.351562 A 1.0001 1.0001 0 0 0 37.958984 22.355469 L 37.958984 17.685547 A 1.0001 1.0001 0 0 0 37.03125 16.6875 C 33.886609 16.461891 31.379838 14.012216 31.052734 10.896484 A 1.0001 1.0001 0 0 0 30.058594 10 L 26.042969 10 z M 27.041016 12 L 29.322266 12 C 30.049047 15.2987 32.626734 17.814404 35.958984 18.445312 L 35.958984 21.310547 C 33.820114 21.201935 31.941489 20.134948 30.835938 18.453125 A 1.0001 1.0001 0 0 0 29 19.003906 L 29 30.539062 C 29 34.707538 25.641273 38.066406 21.472656 38.066406 C 17.304181 38.066406 13.945312 34.707538 13.945312 30.539062 C 13.945312 26.538539 17.066083 23.363182 21 23.107422 L 21 25.283203 C 18.286416 25.535721 16.121094 27.762246 16.121094 30.539062 C 16.121094 33.483274 18.528445 35.892578 21.472656 35.892578 C 24.401892 35.892578 27 33.586491 27 30.59375 C 27 30.64267 27.001859 29.335571 27.005859 27.494141 C 27.009759 25.65271 27.016224 23.20692 27.021484 20.763672 C 27.030884 16.376775 27.039186 12.849206 27.041016 12 z"></path>
            </svg>
            <span className="text-2xl font-extrabold text-white z-10 mt-4">TikTok Trends</span>
          </button>
        </div>
      ) : currentTrends === 'twitter' ? (
        <IncrementalTrendView />
      ) : currentTrends === 'instagram' ? (
        <InstagramTrendView />
      ) : (
        <TiktokTrendView />
      )}
    </div>
  );
}

export default Compiler;
