'use client';
import { useState, useEffect } from 'react';
import RatingStars from './RatingStars';
import { ServiceTypeData } from '@/lib/types';
import { api } from '@/lib/api';

interface Props {
  buildingId: number;
  serviceType?: string;
  onSubmit: (data: any) => Promise<void>;
}

export default function ReviewForm({ buildingId, onSubmit }: Props) {
  const [step, setStep] = useState(1);
  const [typeData, setTypeData] = useState<ServiceTypeData | null>(null);
  const [overall, setOverall] = useState(0);
  const [catRatings, setCatRatings] = useState<Record<string, number>>({});
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [optFields, setOptFields] = useState<Record<string, string>>({});
  const [yesNo, setYesNo] = useState<boolean | null>(null);
  // Apartment-specific extras
  const [floorNumber, setFloorNumber] = useState('');
  const [unitSize, setUnitSize] = useState('');
  const [leaseLength, setLeaseLength] = useState('');
  const [rentIncreased, setRentIncreased] = useState<boolean | null>(null);
  const [utilityCost, setUtilityCost] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getCategoriesForType('apartment').then(setTypeData).catch(() => {});
  }, []);

  const toggle = (arr: string[], setArr: (v: string[]) => void, tag: string) => {
    setArr(arr.includes(tag) ? arr.filter((t) => t !== tag) : [...arr, tag]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const optionalParsed: Record<string, any> = {};
    (typeData?.optional_fields || []).forEach((f) => {
      if (optFields[f.key]) {
        optionalParsed[f.key] = f.type === 'number' ? parseInt(optFields[f.key]) : optFields[f.key];
      }
    });
    // Include apartment extras
    if (floorNumber) optionalParsed.floor_number = parseInt(floorNumber);
    if (unitSize) optionalParsed.unit_size_sqft = parseInt(unitSize);
    if (leaseLength) optionalParsed.lease_length = leaseLength;
    if (rentIncreased !== null) optionalParsed.rent_increased = rentIncreased;
    if (utilityCost) optionalParsed.utility_cost = parseInt(utilityCost);

    await onSubmit({
      building_id: buildingId,
      overall_rating: overall,
      service_type: 'apartment',
      category_ratings: catRatings,
      pros, cons, text: text || null,
      optional_fields: optionalParsed,
      would_renew: yesNo,
      rent_paid: optionalParsed.rent_paid || null,
      move_in_date: optionalParsed.move_in_date || null,
      move_out_date: optionalParsed.move_out_date || null,
    });
    setSubmitting(false);
  };

  const totalSteps = 8; // overall, categories, pros, cons, text, details, apartment extras, submit

  const renderStep = () => {
    if (step === 1) return (
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold">Overall Rating</h3>
        <p className="text-sm text-navy-500">🏠 How was your apartment overall?</p>
        <RatingStars rating={overall} onRate={setOverall} size="lg" />
      </div>
    );

    if (step === 2 && typeData) return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Rate Each Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {typeData.categories.map((cat) => (
            <div key={cat} className="flex items-center justify-between gap-2">
              <span className="text-sm text-navy-800">{cat}</span>
              <RatingStars rating={catRatings[cat] || 0} onRate={(n) => setCatRatings({ ...catRatings, [cat]: n })} size="sm" />
            </div>
          ))}
        </div>
      </div>
    );

    if (step === 3 && typeData) return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">What&apos;s Good?</h3>
        <div className="flex flex-wrap gap-2">
          {typeData.pro_tags.map((t) => (
            <button key={t} type="button" onClick={() => toggle(pros, setPros, t)}
              className={`text-sm px-3 py-1.5 rounded-full border transition ${
                pros.includes(t) ? 'bg-emerald-500 text-white border-emerald-500' : 'border-navy-200 hover:border-emerald-400'
              }`}>{t}</button>
          ))}
        </div>
      </div>
    );

    if (step === 4 && typeData) return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">What Needs Improvement?</h3>
        <div className="flex flex-wrap gap-2">
          {typeData.con_tags.map((t) => (
            <button key={t} type="button" onClick={() => toggle(cons, setCons, t)}
              className={`text-sm px-3 py-1.5 rounded-full border transition ${
                cons.includes(t) ? 'bg-red-500 text-white border-red-500' : 'border-navy-200 hover:border-red-400'
              }`}>{t}</button>
          ))}
        </div>
      </div>
    );

    if (step === 5) return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tell Your Story</h3>
        <textarea value={text} onChange={(e) => setText(e.target.value)}
          placeholder="What was your experience living here? How was the landlord? Any issues with the apartment?"
          className="w-full h-32 p-3 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
      </div>
    );

    if (step === 6 && typeData) return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Lease Details</h3>
        {typeData.optional_fields.map((f) => (
          <input key={f.key} type={f.type} placeholder={f.label}
            value={optFields[f.key] || ''}
            onChange={(e) => setOptFields({ ...optFields, [f.key]: e.target.value })}
            className="w-full p-3 border border-navy-200 rounded-xl text-sm" />
        ))}
        <div className="flex gap-3 mt-3">
          <button type="button" onClick={() => setYesNo(true)}
            className={`flex-1 py-2 rounded-xl text-sm border ${yesNo === true ? 'bg-emerald-500 text-white' : 'border-navy-200'}`}>
            Would renew lease ✅
          </button>
          <button type="button" onClick={() => setYesNo(false)}
            className={`flex-1 py-2 rounded-xl text-sm border ${yesNo === false ? 'bg-red-500 text-white' : 'border-navy-200'}`}>
            Would not renew ❌
          </button>
        </div>
      </div>
    );

    if (step === 7) return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Apartment Details (Optional)</h3>
        <p className="text-xs text-navy-500">Help future tenants understand the unit better.</p>
        <input type="number" placeholder="Floor number"
          value={floorNumber} onChange={(e) => setFloorNumber(e.target.value)}
          className="w-full p-3 border border-navy-200 rounded-xl text-sm" />
        <input type="number" placeholder="Unit size (sq ft)"
          value={unitSize} onChange={(e) => setUnitSize(e.target.value)}
          className="w-full p-3 border border-navy-200 rounded-xl text-sm" />
        <input type="text" placeholder="Lease length (e.g., 12 months)"
          value={leaseLength} onChange={(e) => setLeaseLength(e.target.value)}
          className="w-full p-3 border border-navy-200 rounded-xl text-sm" />
        <input type="number" placeholder="Average monthly utility cost ($)"
          value={utilityCost} onChange={(e) => setUtilityCost(e.target.value)}
          className="w-full p-3 border border-navy-200 rounded-xl text-sm" />
        <div>
          <label className="text-sm text-navy-700 block mb-2">Did rent increase at renewal?</label>
          <div className="flex gap-3">
            <button type="button" onClick={() => setRentIncreased(true)}
              className={`flex-1 py-2 rounded-xl text-sm border ${rentIncreased === true ? 'bg-red-500 text-white' : 'border-navy-200'}`}>
              Yes, it went up 📈
            </button>
            <button type="button" onClick={() => setRentIncreased(false)}
              className={`flex-1 py-2 rounded-xl text-sm border ${rentIncreased === false ? 'bg-emerald-500 text-white' : 'border-navy-200'}`}>
              No / Stayed the same
            </button>
          </div>
        </div>
      </div>
    );

    if (step === 8) return (
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold">Ready to Submit?</h3>
        <p className="text-sm text-navy-500">Your review helps other tenants make better decisions.</p>
        <button onClick={handleSubmit} disabled={submitting || overall === 0}
          className="w-full bg-gold-500 text-navy-950 py-3 rounded-xl font-semibold hover:bg-gold-400 disabled:opacity-50 transition">
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    );

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i + 1 <= step ? 'bg-gold-500' : 'bg-navy-100'}`} />
        ))}
      </div>
      {renderStep()}
      <div className="flex justify-between">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="text-sm text-navy-500 hover:underline">← Back</button>
        )}
        {step < totalSteps && (
          <button onClick={() => setStep(step + 1)}
            className="ml-auto text-sm bg-navy-950 text-white px-6 py-2 rounded-xl hover:bg-navy-800 transition">
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
