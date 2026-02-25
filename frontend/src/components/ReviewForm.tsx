'use client';
import { useState } from 'react';
import RatingStars from './RatingStars';
import CategoryRatings from './CategoryRatings';
import { CATEGORIES, PRO_TAGS, CON_TAGS } from '@/lib/types';

interface Props {
  buildingId: number;
  onSubmit: (data: any) => Promise<void>;
}

export default function ReviewForm({ buildingId, onSubmit }: Props) {
  const [step, setStep] = useState(1);
  const [overall, setOverall] = useState(0);
  const [cats, setCats] = useState<Record<string, number>>({});
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [rent, setRent] = useState('');
  const [moveIn, setMoveIn] = useState('');
  const [moveOut, setMoveOut] = useState('');
  const [renew, setRenew] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const toggle = (arr: string[], setArr: (v: string[]) => void, tag: string) => {
    setArr(arr.includes(tag) ? arr.filter((t) => t !== tag) : [...arr, tag]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSubmit({
      building_id: buildingId,
      overall_rating: overall,
      ...Object.fromEntries(CATEGORIES.map((c) => [`rating_${c}`, cats[c] || null])),
      pros, cons, text: text || null,
      rent_paid: rent ? parseInt(rent) : null,
      move_in_date: moveIn || null,
      move_out_date: moveOut || null,
      would_renew: renew,
    });
    setSubmitting(false);
  };

  const steps = [
    // Step 1: Overall
    <div key={1} className="text-center space-y-4">
      <h3 className="text-lg font-semibold">Overall Rating</h3>
      <RatingStars rating={overall} onRate={setOverall} size="lg" />
    </div>,
    // Step 2: Categories
    <div key={2} className="space-y-4">
      <h3 className="text-lg font-semibold">Rate Each Category</h3>
      <CategoryRatings ratings={cats} onRate={(c, n) => setCats({ ...cats, [c]: n })} />
    </div>,
    // Step 3: Pros
    <div key={3} className="space-y-4">
      <h3 className="text-lg font-semibold">What&apos;s Good?</h3>
      <div className="flex flex-wrap gap-2">
        {PRO_TAGS.map((t) => (
          <button key={t} type="button" onClick={() => toggle(pros, setPros, t)}
            className={`text-sm px-3 py-1.5 rounded-full border transition ${
              pros.includes(t) ? 'bg-emerald-500 text-white border-emerald-500' : 'border-navy-200 hover:border-emerald-400'
            }`}>{t}</button>
        ))}
      </div>
    </div>,
    // Step 4: Cons
    <div key={4} className="space-y-4">
      <h3 className="text-lg font-semibold">What Needs Improvement?</h3>
      <div className="flex flex-wrap gap-2">
        {CON_TAGS.map((t) => (
          <button key={t} type="button" onClick={() => toggle(cons, setCons, t)}
            className={`text-sm px-3 py-1.5 rounded-full border transition ${
              cons.includes(t) ? 'bg-red-500 text-white border-red-500' : 'border-navy-200 hover:border-red-400'
            }`}>{t}</button>
        ))}
      </div>
    </div>,
    // Step 5: Text
    <div key={5} className="space-y-4">
      <h3 className="text-lg font-semibold">Tell Your Story</h3>
      <textarea value={text} onChange={(e) => setText(e.target.value)}
        placeholder="What was your experience living here?"
        className="w-full h-32 p-3 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
    </div>,
    // Step 6: Optional
    <div key={6} className="space-y-4">
      <h3 className="text-lg font-semibold">Optional Details</h3>
      <input type="number" placeholder="Monthly rent ($)" value={rent} onChange={(e) => setRent(e.target.value)}
        className="w-full p-3 border border-navy-200 rounded-xl text-sm" />
      <div className="grid grid-cols-2 gap-2">
        <input type="text" placeholder="Move-in date" value={moveIn} onChange={(e) => setMoveIn(e.target.value)}
          className="p-3 border border-navy-200 rounded-xl text-sm" />
        <input type="text" placeholder="Move-out date" value={moveOut} onChange={(e) => setMoveOut(e.target.value)}
          className="p-3 border border-navy-200 rounded-xl text-sm" />
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={() => setRenew(true)}
          className={`flex-1 py-2 rounded-xl text-sm border ${renew === true ? 'bg-emerald-500 text-white' : 'border-navy-200'}`}>
          Would renew ✅
        </button>
        <button type="button" onClick={() => setRenew(false)}
          className={`flex-1 py-2 rounded-xl text-sm border ${renew === false ? 'bg-red-500 text-white' : 'border-navy-200'}`}>
          Would not ❌
        </button>
      </div>
    </div>,
    // Step 7: Submit
    <div key={7} className="text-center space-y-4">
      <h3 className="text-lg font-semibold">Ready to Submit?</h3>
      <p className="text-sm text-navy-500">Your review helps other renters make better decisions.</p>
      <button onClick={handleSubmit} disabled={submitting || overall === 0}
        className="w-full bg-gold-500 text-navy-950 py-3 rounded-xl font-semibold hover:bg-gold-400 disabled:opacity-50 transition">
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>,
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-1">
        {steps.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i + 1 <= step ? 'bg-gold-500' : 'bg-navy-100'}`} />
        ))}
      </div>
      {steps[step - 1]}
      <div className="flex justify-between">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="text-sm text-navy-500 hover:underline">← Back</button>
        )}
        {step < steps.length && (
          <button onClick={() => setStep(step + 1)}
            className="ml-auto text-sm bg-navy-950 text-white px-6 py-2 rounded-xl hover:bg-navy-800 transition">
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
