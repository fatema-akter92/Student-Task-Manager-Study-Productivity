import React, { useState } from 'react';
import { Sparkles, Quote, RefreshCw } from 'lucide-react';
import Card from './Card';

const STUDY_QUOTES = [
  {
    quote: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
    tip: "Break assignments into 20-minute chunks to overcome initial friction."
  },
  {
    quote: "Focus on being productive instead of busy.",
    author: "Tim Ferriss",
    tip: "Tackle your highest priority task first before checking emails or social feeds."
  },
  {
    quote: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma",
    tip: "Even reviewing 5 flashcards today compounds into an effortless A."
  },
  {
    quote: "Action is the foundational key to all success.",
    author: "Pablo Picasso",
    tip: "Set a 5-minute timer just to write the first outline bullet. Momentum will follow."
  },
  {
    quote: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
    tip: "Crossing off small tasks releases dopamine that fuels larger breakthroughs."
  }
];

export default function MotivationCard() {
  const [index, setIndex] = useState(0);

  const nextQuote = () => {
    setIndex((prev) => (prev + 1) % STUDY_QUOTES.length);
  };

  const item = STUDY_QUOTES[index];

  return (
    <Card
      title="Study Spark"
      icon={<Sparkles className="w-5 h-5 text-indigo-400" />}
      className="bg-slate-900/60 border-indigo-500/20"
      action={
        <button
          onClick={nextQuote}
          className="text-slate-400 hover:text-indigo-300 transition p-1.5 rounded-lg hover:bg-slate-800"
          title="Next tip"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      }
    >
      <div className="space-y-3">
        <div className="relative pl-6">
          <Quote className="w-4 h-4 text-indigo-400/50 absolute left-0 top-0.5" />
          <p className="text-sm font-medium text-slate-200 italic leading-relaxed">
            "{item.quote}"
          </p>
          <p className="text-xs text-indigo-400 font-semibold mt-1">— {item.author}</p>
        </div>

        <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-200">
          <span className="font-bold text-amber-300 mr-1">💡 Study Tip:</span>
          {item.tip}
        </div>
      </div>
    </Card>
  );
}
