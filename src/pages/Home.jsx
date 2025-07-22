/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const AnimatedText = ({ children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px",
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={`transform transition-all ease-in-out duration-1000 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      {children}
    </div>
  );
};

const features = [
  {
    name: "Increase in Views",
    description:
      "Our tool helps you amplify your audience reach by using AI to analyze trends to help you create engaging content.",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6 stroke-purple-700"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
        />
      </svg>
    ),
  },
  {
    name: "Exposure to Brands",
    description:
      "With increased visibility, get discovered by top brands and secure collaborations that help monetize your efforts effectively.",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6 stroke-purple-700"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
  },
  {
    name: "Time Efficiency",
    description:
      "Say goodbye to wasting hours researching trends. SOCaiL does the work for you, compiling trending data in seconds.",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6 stroke-purple-700"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
  },
  {
    name: "Scheduler and Tracker",
    description:
      "Schedule your content accordingly for maximum reach and track your progress, for better productivity.",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6 stroke-purple-700"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
        />
      </svg>
    ),
  },
];

export default function Home() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const throttleRef = useRef(null);

  // Throttled cursor position tracking
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!throttleRef.current) {
        throttleRef.current = setTimeout(() => {
          setCursorPosition({ x: event.clientX, y: event.clientY });
          throttleRef.current = null;
        }, 16); // Approximately 60fps
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
    };
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[5%] h-[300px] w-[300px] rounded-full bg-purple-100 mix-blend-multiply filter blur-3xl opacity-70" />
        <div className="absolute right-[15%] top-[15%] h-[250px] w-[250px] rounded-full bg-pink-100 mix-blend-multiply filter blur-3xl opacity-70" />
        <div className="absolute left-[20%] bottom-[10%] h-[350px] w-[350px] rounded-full bg-blue-100 mix-blend-multiply filter blur-3xl opacity-70" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <header className="py-10 text-center">
          <AnimatedText>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Empower Your Social Media Presence with SOCaiL
            </h1>
          </AnimatedText>
          <AnimatedText>
            <p className="text-xl text-gray-800 mb-8">
              Analyze trends, generate content, and optimize your strategy
              effortlessly.
            </p>
          </AnimatedText>
          <AnimatedText>
            <Link
              to="/login"
              className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition-colors"
            >
              Get Started
            </Link>
          </AnimatedText>
        </header>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Trend Compiler", "Content Writer", "Chatbot"].map(
              (feature, index) => (
                <AnimatedText key={index}>
                  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                      {feature}
                    </h3>
                    <p className="text-gray-800 text-center">
                      {index === 0
                        ? "Easily compile and analyze the latest social media trends tailored to your niche."
                        : index === 1
                        ? "Craft quality content with , ensuring every post resonates with your audience."
                        : "Engage your followers with our smart chatbot designed for personalized interaction."}
                    </p>
                  </div>
                </AnimatedText>
              )
            )}
          </div>
        </section>

        {/* Features section */}
        <section className="relative py-24 sm:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-">
            <div className="mx-auto max-w-2xl lg:text-center">
              <AnimatedText>
                <h3 className="text-base font-semibold leading-7 text-purple-800">
                  Trend Faster
                </h3>
              </AnimatedText>
              <AnimatedText>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Everything you need to advance your Social Career
                </p>
              </AnimatedText>
              <AnimatedText>
                <p className="mt-6 text-lg leading-8 text-gray-700">
                  Why should you use SOCaiL?
                </p>
              </AnimatedText>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                {features.map((feature) => (
                  <AnimatedText key={feature.name}>
                    <div className="relative pl-16 p-6 bg-white bg-opacity-60 rounded-lg shadow-sm">
                      <dt className="text-base font-semibold leading-7 text-gray-900">
                        <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center">
                          {feature.icon()}
                        </div>
                        {feature.name}
                      </dt>
                      <dd className="mt-2 text-base leading-7 text-gray-700">
                        {feature.description}
                      </dd>
                    </div>
                  </AnimatedText>
                ))}
              </dl>
            </div>
          </div>
        </section>
        <section className="py-16 text-center">
          <AnimatedText>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join SOCaiL today and take your content to the next level.
            </h2>
          </AnimatedText>
          <AnimatedText>
            <Link
              to="/login"
              className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition-colors"
            >
              Sign Up
            </Link>
          </AnimatedText>
        </section>
      </div>
    </div>
  );
}
