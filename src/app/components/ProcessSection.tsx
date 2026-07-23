import React, { useState } from 'react';
import { PROCESS_STEPS } from '../data/stoneData';
import { Compass, PackageCheck, Hammer, ShieldCheck, CheckCircle2, ArrowRight, Users } from 'lucide-react';
import { motion } from 'motion/react';

export const ProcessSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const getStepIcon = (index: number) => {
    switch (index) {
      case 0: return Compass;
      case 1: return PackageCheck;
      case 2: return Users;
      case 3: return Hammer;
      case 4: return ShieldCheck;
      default: return Compass;
    }
  };

  return (
    <section id="process" className="py-24 bg-[#FFFFFF] dark:bg-[#0B0B0D] text-gray-900 dark:text-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#C8A96A] font-bold inline-flex items-center gap-2">
            End-To-End Master Craftsmen Journey
          </span>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl font-bold tracking-tight">
            Our 5-Step Precision Process
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base font-sans-luxury">
            From mountain quarry extraction to white-glove residential installation, experience seamless execution designed for architectural perfection.
          </p>
        </div>

        {/* Desktop Interactive Timeline Bar */}
        <div className="hidden lg:grid grid-cols-5 gap-4 mb-16 relative">
          {/* Animated Connecting Progress Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-800 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-[#C8A96A] -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${((activeStep + 1) / 5) * 100}%` }}
          />

          {PROCESS_STEPS.map((step, idx) => {
            const Icon = getStepIcon(idx);
            const isActive = idx === activeStep;
            const isCompleted = idx < activeStep;

            return (
              <button
                key={step.number}
                onClick={() => setActiveStep(idx)}
                className={`relative z-10 p-5 rounded-2xl text-left border transition-all duration-300 ${
                  isActive
                    ? 'bg-[#111114] text-white border-[#C8A96A] shadow-2xl scale-105'
                    : isCompleted
                    ? 'bg-gray-50 dark:bg-[#151518] text-gray-900 dark:text-gray-200 border-[#C8A96A]/40'
                    : 'bg-gray-50 dark:bg-[#151518] text-gray-400 border-gray-200 dark:border-gray-800 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-mono text-sm font-bold ${isActive ? 'text-[#C8A96A]' : 'text-gray-400'}`}>
                    {step.number}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isActive
                        ? 'bg-[#C8A96A] text-black font-bold'
                        : 'bg-gray-200 dark:bg-[#202025] text-[#C8A96A]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-serif-luxury font-bold text-base line-clamp-1">{step.title}</h4>
                <p className="text-[11px] text-gray-400 font-sans-luxury mt-1">{step.duration}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Step Detail Panel */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gray-50 dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 sm:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C8A96A]/10 text-[#C8A96A] text-xs uppercase tracking-wider font-bold">
              <span>Step {PROCESS_STEPS[activeStep].number} of 05</span>
              <span>•</span>
              <span>{PROCESS_STEPS[activeStep].duration}</span>
            </div>

            <h3 className="font-serif-luxury text-3xl sm:text-4xl font-bold">
              {PROCESS_STEPS[activeStep].title}
            </h3>

            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-sans-luxury">
              {PROCESS_STEPS[activeStep].description}
            </p>

            <div className="space-y-3 pt-2">
              <h5 className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Key Deliverables:</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROCESS_STEPS[activeStep].details.map(detail => (
                  <div key={detail} className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#C8A96A] shrink-0" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#111114] p-8 rounded-2xl border border-[#C8A96A]/30 text-white space-y-4 shadow-xl">
            <h4 className="font-serif-luxury text-xl font-bold text-[#C8A96A]">
              Next Step Ahead
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed font-sans-luxury">
              Ready to move your architectural concept from blueprint to precision stone fabrication?
            </p>
            <button
              onClick={() => {
                if (activeStep < 4) setActiveStep(activeStep + 1);
                else setActiveStep(0);
              }}
              className="w-full py-3.5 rounded-xl gold-button text-xs uppercase tracking-wider font-bold shadow-lg flex items-center justify-center gap-2"
            >
              <span>{activeStep < 4 ? 'Proceed To Next Step' : 'Restart Journey View'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
