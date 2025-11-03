import React, { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

type Phase1Form = {
  school: string;
  age: string;
  department: string;
  cvFileName?: string;
};

type Phase2Form = {
  q1: string; // Team vs Solo
  q2: string; // Structured vs Creative
  q3: string; // Persistence scale
  q4: string; // Communication scale
};

type Phase3Form = {
  a1: string;
  a2: string;
  a3: string;
  a4: string;
  a5: string;
};

type Phase4Form = {
  questionIndex: number;
  answers: string[];
};

export type OnboardingData = {
  phase1: Phase1Form;
  phase2: Phase2Form;
  phase3: Phase3Form;
  phase4: Phase4Form;
  version: number;
};

export default function TestWizard({
  open,
  onClose,
  onComplete,
}: {
  open: boolean;
  onClose?: () => void;
  onComplete: (data: OnboardingData) => void;
}) {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);

  const [phase1, setPhase1] = useState<Phase1Form>({
    school: "",
    age: "",
    department: "",
    cvFileName: undefined,
  });
  const [phase2, setPhase2] = useState<Phase2Form>({ q1: "", q2: "", q3: "3", q4: "3" });
  const [phase3, setPhase3] = useState<Phase3Form>({ a1: "", a2: "", a3: "", a4: "", a5: "" });
  const phase4Questions = useMemo(
    () => [
      t('testWizard.videoQuestions.introduce'),
      t('testWizard.videoQuestions.challenge'),
      t('testWizard.videoQuestions.project'),
      t('testWizard.videoQuestions.curiosity'),
      t('testWizard.videoQuestions.spaceYouth'),
    ],
    [t]
  );
  const [phase4, setPhase4] = useState<Phase4Form>({
    questionIndex: 0,
    answers: Array(5).fill(""),
  });


  useEffect(() => {
    if (!open) setStep(1);
  }, [open]);


  const canNext = useMemo(() => {
    if (step === 1) {
      const required = [
        phase1.school,
        phase1.age,
        phase1.department,
      ];
      return required.every((v) => String(v || "").trim().length > 0);
    }
    if (step === 2) {
      return phase2.q1 !== "" && phase2.q2 !== "" && phase2.q3 !== "" && phase2.q4 !== "";
    }
    if (step === 3) {
      return [phase3.a1, phase3.a2, phase3.a3, phase3.a4, phase3.a5].every((v) => v.trim().length > 0);
    }
    if (step === 4) {
      // Phase 4 is always valid - optional video questions
      return true;
    }
    return false;
  }, [step, phase1, phase2, phase3, phase4]);

  const handleComplete = () => {
    const version = 1;
    const payload: OnboardingData = { phase1, phase2, phase3, phase4, version};
    onComplete(payload);
  };


  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white text-foreground">
      {/* Header with logo and profile */}
      <div className="h-14 border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img src="/2.png" alt="SpaceYouth" className="h-8 w-auto" />
          <div className="text-sm text-muted-foreground hidden sm:block">{t('testWizard.studentOnboardingTest')}</div>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <div className="text-xs text-muted-foreground hidden sm:block">{t('testWizard.welcome')}</div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-indigo-500 text-white grid place-items-center text-sm font-bold">
            S
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-3.5rem)] overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-2.5 rounded-full transition-all ${step === i ? "bg-foreground w-10" : "bg-muted w-6"}`} />
          ))}
        </div>

        <div className="rounded-2xl border bg-card shadow-sm">
          {step === 1 && (
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">{t('testWizard.phase1')}</h2>
                <p className="text-sm text-muted-foreground">{t('testWizard.phase1Description')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <Field label={t('testWizard.school')}>
                  <input
                    className="w-full h-10 rounded-xl border px-3 text-sm"
                    value={phase1.school}
                    onChange={(e) => setPhase1((p) => ({ ...p, school: e.target.value }))}
                  />
                </Field>
                <Field label={t('testWizard.age')}>
                  <input
                    type="number"
                    min={10}
                    className="w-full h-10 rounded-xl border px-3 text-sm"
                    value={phase1.age}
                    onChange={(e) => setPhase1((p) => ({ ...p, age: e.target.value }))}
                  />
                </Field>
                <Field label={t('testWizard.department')}>
                  <input
                    className="w-full h-10 rounded-xl border px-3 text-sm"
                    value={phase1.department}
                    onChange={(e) => setPhase1((p) => ({ ...p, department: e.target.value }))}
                  />
                </Field>
                <Field label={t('testWizard.cv')}>
                  <label className="h-10 rounded-xl border px-3 text-sm flex items-center justify-between cursor-pointer bg-secondary/50">
                    <span className="truncate">{phase1.cvFileName || t('testWizard.chooseFile')}</span>
                    <input
                      type="file"
                      accept="application/pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setPhase1((p) => ({ ...p, cvFileName: f.name }));
                      }}
                    />
                  </label>
                </Field>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="p-6">
                  <div className="text-xs text-muted-foreground mb-2">{t('testWizard.question')} {phase4.questionIndex + 1} {t('testWizard.of')} {phase4Questions.length}</div>
                  <div className="text-sm font-medium mb-3">{phase4Questions[phase4.questionIndex]}</div>
                  <textarea
                    className="w-full min-h-28 rounded-xl border px-3 py-2 text-sm"
                    placeholder={t('testWizard.optionalAnswer')}
                    value={phase4.answers[phase4.questionIndex]}
                    onChange={(e) =>
                      setPhase4((p) => {
                        const next = [...p.answers];
                        next[p.questionIndex] = e.target.value;
                        return { ...p, answers: next };
                      })
                    }
                  />
                  <div className="flex items-center justify-between mt-3">
                    <button
                      type="button"
                      className="rounded-full border px-3 py-1.5 text-sm"
                      onClick={() => setPhase4((p) => ({ ...p, questionIndex: (p.questionIndex - 1 + phase4Questions.length) % phase4Questions.length }))}
                    >
                      {t('testWizard.prev')}
                    </button>
                    <div className="flex items-center gap-1">
                      {phase4Questions.map((_, i) => (
                        <span key={i} className={`h-1.5 w-4 rounded-full ${i === phase4.questionIndex ? "bg-foreground" : "bg-muted"}`} />
                      ))}
                    </div>
                    <button
                      type="button"
                      className="rounded-full border px-3 py-1.5 text-sm"
                      onClick={() => setPhase4((p) => ({ ...p, questionIndex: (p.questionIndex + 1) % phase4Questions.length }))}
                    >
                      {t('testWizard.next')}
                    </button>
                  </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">{t('testWizard.phase2')}</h2>
                <p className="text-sm text-muted-foreground">{t('testWizard.phase2Description')}</p>
              </div>

              <div className="space-y-5">
                <ChoiceRow
                  label={t('testWizard.teamVsSolo')}
                  name="q1"
                  value={phase2.q1}
                  onChange={(v) => setPhase2((p) => ({ ...p, q1: v }))}
                  options={[
                    { value: 'team', label: t('testWizard.team') },
                    { value: 'solo', label: t('testWizard.solo') },
                  ]}
                />
                <ChoiceRow
                  label={t('testWizard.structuredVsCreative')}
                  name="q2"
                  value={phase2.q2}
                  onChange={(v) => setPhase2((p) => ({ ...p, q2: v }))}
                  options={[
                    { value: 'structured', label: t('testWizard.structured') },
                    { value: 'creative', label: t('testWizard.creative') },
                  ]}
                />
                <ScaleRow
                  label={t('testWizard.perseverance')}
                  name="q3"
                  value={phase2.q3}
                  onChange={(v) => setPhase2((p) => ({ ...p, q3: v }))}
                />
                <ScaleRow
                  label={t('testWizard.communication')}
                  name="q4"
                  value={phase2.q4}
                  onChange={(v) => setPhase2((p) => ({ ...p, q4: v }))}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">{t('testWizard.phase3')}</h2>
                <p className="text-sm text-muted-foreground">{t('testWizard.phase3Description')}</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Field label={t('testWizard.psychologicalTest1')}>
                  <textarea
                    className="w-full min-h-28 rounded-xl border px-3 py-2 text-sm"
                    value={phase3.a1}
                    onChange={(e) => setPhase3((p) => ({ ...p, a1: e.target.value }))}
                  />
                </Field>

                <Field label={t('testWizard.psychologicalTest2')}>
                  <textarea
                    className="w-full min-h-28 rounded-xl border px-3 py-2 text-sm"
                    value={phase3.a2}
                    onChange={(e) => setPhase3((p) => ({ ...p, a2: e.target.value }))}
                  />
                </Field>

                <Field label={t('testWizard.psychologicalTest3')}>
                  <textarea
                    className="w-full min-h-28 rounded-xl border px-3 py-2 text-sm"
                    value={phase3.a3}
                    onChange={(e) => setPhase3((p) => ({ ...p, a3: e.target.value }))}
                  />
                </Field>

                <Field label={t('testWizard.psychologicalTest4')}>
                  <textarea
                    className="w-full min-h-28 rounded-xl border px-3 py-2 text-sm"
                    value={phase3.a4}
                    onChange={(e) => setPhase3((p) => ({ ...p, a4: e.target.value }))}
                  />
                </Field>

                <Field label={t('testWizard.psychologicalTest5')}>
                  <textarea
                    className="w-full min-h-28 rounded-xl border px-3 py-2 text-sm"
                    value={phase3.a5}
                    onChange={(e) => setPhase3((p) => ({ ...p, a5: e.target.value }))}
                  />
                </Field>
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <button
              onClick={onClose}
              className="rounded-full border px-4 py-2 text-sm hidden sm:inline-flex"
            >
              {t('testWizard.cancel')}
            </button>
            <div className="flex items-center gap-2 ml-auto">
              {step > 1 && (
                <button
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  className="rounded-full border px-4 py-2 text-sm"
                >
                  {t('testWizard.back')}
                </button>
              )}
              {step < 4 && (
                <button
                  disabled={!canNext}
                  onClick={() => setStep((s) => Math.min(4, s + 1))}
                  className={`rounded-full px-4 py-2 text-sm font-semibold shadow ${
                    canNext ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {t('common.next')}
                </button>
              )}
              {step === 4 && (
                <button
                  disabled={!canNext}
                  onClick={handleComplete}
                  className={`rounded-full px-4 py-2 text-sm font-semibold shadow ${
                    canNext ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {t('testWizard.finishAndStart')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-medium mb-1 text-muted-foreground">{label}</div>
      {children}
    </label>
  );
}

function ChoiceRow({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <div className="text-sm font-medium mb-2">{label}</div>
      <div className="flex items-center gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className={`px-3 py-1.5 rounded-full text-sm border ${
              value === o.value ? "bg-foreground text-background" : "bg-secondary"
            }`}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ScaleRow({ label, name, value, onChange }: { label: string; name: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="text-sm font-medium mb-2">{label} — {value}/5</div>
      <div className="flex items-center gap-2">
        {["1", "2", "3", "4", "5"].map((n) => (
          <button
            key={n}
            type="button"
            className={`h-8 w-8 rounded-full border text-sm grid place-items-center ${
              value === n ? "bg-foreground text-background" : "bg-secondary"
            }`}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
