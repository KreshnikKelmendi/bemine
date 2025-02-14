'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import loveSong from '../../public/assets/music.mp3'; // Import your song

const cards = [
  { title: 'MEMORIES', image: '/assets/kujtimet-2.jpg', question: 'When you saw me for the first time, what were your thoughts about me? What was your first impression of me?' },
  { title: 'LOVE', image: '/assets/dashuria-2.jpg', question: 'What makes me unique in your eyes?' },
  { title: 'THE FUTURE', image: '/assets/future-3.jpg', question: 'What dreams and plans do you have for our future together?' }
];

export default function Home() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [disabledCards, setDisabledCards] = useState<number[]>([]);
  const [showFinalQuestion, setShowFinalQuestion] = useState(false);
  const [noClickCount, setNoClickCount] = useState(0);
  const [showLoveResult, setShowLoveResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loveText, setLoveText] = useState('');
  const [showLoveScore, setShowLoveScore] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(0); // Track answered questions
  const yesButtonSize = 8 + noClickCount * 2; // Increases size
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    gsap.fromTo(
      '.card-title',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.3, ease: 'power3.out' }
    );
  }, []);

  useEffect(() => {
    if (answeredQuestions === cards.length) {
      gsap.to('.cards-container', { opacity: 0, duration: 1, onComplete: () => setShowFinalQuestion(true) });
    }
  }, [answeredQuestions]);

  const openModal = (index: number) => {
    if (!disabledCards.includes(index)) {
      setActiveCard(index);
      gsap.fromTo('.modal', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5 });
    }
  };

  const handleCardAnswer = () => {
    setAnsweredQuestions((prev) => prev + 1); // Increment the answered questions
    setDisabledCards((prev) => [...prev, activeCard!]); // Disable the card
    setActiveCard(null); // Close the modal
  };

  const handleNoClick = () => {
    setNoClickCount((prev) => prev + 1);
  };

  const handleYesClick = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    setShowFinalQuestion(false);
    setIsLoading(true);

    // Simulate a loading delay
    setTimeout(() => {
      setIsLoading(false);
      setShowLoveScore(true);

      // Show the love score for 2 seconds
      setTimeout(() => {
        setShowLoveScore(false);
        setShowLoveResult(true);
        startTypingAnimation();
      }, 2000); // 2 seconds delay for love score
    }, 2000); // 2 seconds delay for loader
  };

  const startTypingAnimation = () => {
    const text = "- From the moment I met you, I knew you were the one. My love for you grows every day, and I can't wait to spend the rest of my life with you. 💕";
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setLoveText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50); // Adjust typing speed here
  };

  const noButtonTexts = ['No 😢', 'Are you sure? 😢', 'Please think again 🥺', 'Last chance... 💔'];
  const noButtonText = noClickCount < noButtonTexts.length ? noButtonTexts[noClickCount] : 'Really? 😭';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4 sm:p-8">
      <audio ref={audioRef} src={loveSong} preload="auto" />
      <main className="flex items-center justify-center absolute bottom-5 right-5 z-50">
        <div className="text-red-500 animate-heartbeat text-3xl">❤️</div>
      </main>
      <main className="flex items-center justify-center absolute top-5 right-64 z-50">
        <div className="text-red-500 animate-heartbeat text-3xl">❤️</div>
      </main>
      {!showFinalQuestion && !showLoveResult && !showLoveScore ? (
        <>
          <h2 className="text-xl mb-8 text-black lg:text-2xl">LOVE TEST</h2>
          <div className="cards-container grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 w-full max-w-6xl">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`relative w-full h-60 sm:h-80 lg:h-[70vh] overflow-hidden shadow-lg transition-opacity duration-500 ${disabledCards.includes(index) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => openModal(index)}
              >
                {/* Background Image */}
                <Image src={card.image} alt={card.title} layout="fill" objectFit="cover" className="absolute inset-0" />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30"></div>
                {/* Title in the Middle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="card-title text-2xl font-bold text-white">{card.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : isLoading ? (
        <div className="loader-container text-center">
          <div className="loader">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <p className="mt-4 text-xl text-black">Calculating your love... 💖</p>
        </div>
      ) : showLoveScore ? (
        <div className="love-score text-center">
          <h2 className="text-4xl font-bold mb-6 text-black">Your love is 100% true ❤️</h2>
        </div>
      ) : showLoveResult ? (
        <div className="love-result text-center max-w-2xl px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-black">You are my everything ❤️</h2>
          <p className="text-lg sm:text-xl whitespace-pre-line text-black bg-white p-4 rounded-[30px] italic">{loveText}</p>
        </div>
      ) : (
        <div className="final-question text-center w-full px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-black">Will you be my Valentine? ❤️</h2>
          <div className="flex flex-row gap-4 items-center justify-center w-full sm:w-auto">
            <button
              className={`px-4 py-3 sm:px-${yesButtonSize} sm:py-${yesButtonSize / 2} bg-red-900 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-110 text-lg sm:text-xl`}
              onClick={handleYesClick}
            >
              Yes 😊
            </button>
            <button
              className="px-6 py-4 sm:px-8 sm:py-4 bg-red-700 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 text-lg sm:text-xl"
              onClick={handleNoClick}
            >
              {noButtonText}
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {activeCard !== null && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white text-black p-6 rounded-lg w-11/12 sm:w-96 text-center shadow-lg">
            <h2 className="text-xl font-semibold mb-4">{cards[activeCard].question}</h2>
            <button onClick={handleCardAnswer} className="mt-4 px-6 py-2 bg-gray-100 text-black rounded-lg">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
