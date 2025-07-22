import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const faqs = [
  {
    question: "What is SOCaiL?",
    answer:
      "SOCaiL is a software platform designed to help content creators analyze social media trends, generate engaging content, and optimize their strategies for better audience engagement.",
  },
  {
    question: "How does SOCaiL help in trend analysis?",
    answer:
      "SOCaiL provides real-time trends across social media platforms, allowing users to identify what content resonates most with their audience.",
  },
  {
    question: "Can I create content directly within SOCaiL?",
    answer:
      "Yes, SOCaiL includes a content writing feature that assists users in generating high-quality posts, captions, and other forms of content based on current trends.",
  },
  {
    question: "Is there a chatbot feature in SOCaiL?",
    answer:
      "Yes, SOCaiL features a chatbot that can answer user queries, provide assistance, and suggest content ideas based on the latest trends.",
  },
  {
    question: "Is SOCaiL suitable for beginners in content creation?",
    answer:
      "SOCaiL is user-friendly and provides valuable resources for both beginners and experienced content creators to enhance their skills.",
  },
  {
    question: "Can I track my progress on SOCaiL?",
    answer:
      "Yes, SOCaiL offers progress tracking features that allow users to monitor their content's consistency and improve productivity.",
  },
  {
    question: "What platforms does SOCaiL support?",
    answer:
      "SOCaiL is designed to works primarily with social media platforms like Instagram, Facebook, Twitter, and TikTok, ensuring comprehensive trend analysis across channels.",
  },
  {
    question: "Is SOCaiL a subscription-based service?",
    answer:
      "Yes, SOCaiL operates on a subscription model, offering various plans to cater to different user needs, from individual content creators to larger teams.",
  },
  {
    question: "How can I get started with SOCaiL?",
    answer:
      "You can get started by signing up on our website. After creating an account, you can explore our features and begin optimizing your social media presence!",
  },
];

export default function FAQ() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Cursor follower */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(139, 92, 246, 0.15), transparent 80%)`,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center mb-12">
          <AnimatedText>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Frequently Asked Questions
            </h1>
          </AnimatedText>
          <AnimatedText>
            <p className="mt-6 text-xl leading-8 text-gray-600">
              Find answers to common questions about SOCaiL and how it can help
              you optimize your social media presence.
            </p>
          </AnimatedText>
        </div>

        <div className="mt-8 space-y-8">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-60 backdrop-blur-sm rounded-lg shadow-sm p-6 border-2 border-purple-500/35"
            >
              <AnimatedText>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h2>
              </AnimatedText>
              <AnimatedText>
                <p className="text-gray-600">{faq.answer}</p>
              </AnimatedText>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}


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
      } ${className}`}
    >
      {children}
    </div>
  );
};
