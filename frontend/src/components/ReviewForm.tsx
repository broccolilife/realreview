'use client';
import { useState, useEffect } from 'react';
import RatingStars from './RatingStars';
import { ServiceType, ServiceTypeData, SERVICE_TYPE_ICONS, SERVICE_TYPE_LABELS } from '@/lib/types';
import { api } from '@/lib/api';

interface Props {
  buildingId: number;
  serviceType?: ServiceType;
  onSubmit: (data: any) => Promise<void>;
}

const ALL_TYPES: ServiceType[] = ['apartment', 'restaurant', 'hospital', 'school', 'workplace', 'gym', 'hotel'];

export default function ReviewForm({ buildingId, serviceType: initialType, onSubmit }: Props) {
  const [step, setStep] = useState(initialType ? 2 : 1);
  const [serviceType, setServiceType] = useState<ServiceType>(initialType || 'apartment');
  const [typeData, setTypeData] = useState<ServiceTypeData | null>(null);
  const [overall, setOverall] = useState(0);
  const [catRatings, setCatRatings] = useState<Record<string, number>>({});
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [optFields, setOptFields] = useState<Record<string, string>>({});
  const [yesNo, setYesNo] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getCategoriesForType(serviceType).then(setTypeData).catch(() => {});
  }, [serviceType]);

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
    await onSubmit({
      building_id: buildingId,
      overall_rating: overall,
      service_type: serviceType,
      category_ratings: catRatings,
      pros, cons, text: text || null,
      optional_fields: optionalParsed,
      would_renew: yesNo,
      // Legacy compat for apartment
      rent_paid: optionalParsed.rent_paid || null,
      move_in_date: optionalParsed.move_in_date || null,
      move_out_date: optionalParsed.move_out_date || null,
    });
    setSubmitting(false);
  };

  const totalSteps = initialType ? 7 : 8;
  const stepOffset = initialType ? 1 : 0;

  // Build steps dynamically
  const renderStep = () => {
    const effectiveStep = step - (initialType ? 0 : 0);

    // Step 1: Service type selection (only if no initial type)
    if (!initialType && step === 1) {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">What are you reviewing?</h3>
          <div className="grid grid-cols-2 gap-2">
            {ALL_TYPES.map((t) => (
              <button key={t} type="button" onClick={() => setServiceType(t)}
                className={`p-3 rounded-xl border text-left transition ${
                  serviceType === t ? 'border-gold-500 bg-gold-50 ring-2 ring-gold-500' : 'border-navy-200 hover:border-gold-400'
                }`}>
                <span className="text-xl">{SERVICE_TYPE_ICONS[t]}</span>
                <span className="ml-2 text-sm font-medium">{SERVICE_TYPE_LABELS[t]}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    const s = initialType ? step : step - 1; // normalize to 1-7

    if (s === 1) return (
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold">Overall Rating</h3>
        <p className="text-sm text-navy-500">{SERVICE_TYPE_ICONS[serviceType]} {SERVICE_TYPE_LABELS[serviceType]}</p>
        <RatingStars rating={overall} onRate={setOverall} size="lg" />
      </div>
    );

    if (s === 2 && typeData) return (
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

    if (s === 3 && typeData) return (
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

    if (s === 4 && typeData) return (
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

    if (s === 5) return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tell Your Story</h3>
        <textarea value={text} onChange={(e) => setText(e.target.value)}
          placeholder="What was your experience?"
          className="w-full h-32 p-3 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
      </div>
    );

    if (s === 6 && typeData) return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Optional Details</h3>
        {typeData.optional_fields.map((f) => (
          <input key={f.key} type={f.type} placeholder={f.label}
            value={optFields[f.key] || ''}
            onChange={(e) => setOptFields({ ...optFields, [f.key]: e.target.value })}
            className="w-full p-3 border border-navy-200 rounded-xl text-sm" />
        ))}
        {typeData.optional_fields.length === 0 && (
          <p className="text-sm text-navy-400">No additional details needed for this type.</p>
        )}
        <div className="flex gap-3 mt-3">
          <button type="button" onClick={() => setYesNo(true)}
            className={`flex-1 py-2 rounded-xl text-sm border ${yesNo === true ? 'bg-emerald-500 text-white' : 'border-navy-200'}`}>
            {typeData.yes_no_question} ✅
          </button>
          <button type="button" onClick={() => setYesNo(false)}
            className={`flex-1 py-2 rounded-xl text-sm border ${yesNo === false ? 'bg-red-500 text-white' : 'border-navy-200'}`}>
            No ❌
          </button>
        </div>
      </div>
    );

    if (s === 7) return (
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold">Ready to Submit?</h3>
        <p className="text-sm text-navy-500">Your review helps others make better decisions.</p>
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
