import React from 'react';
import { Header } from '@/components/landing-page/Header';
import { Footer } from '@/components/Footer';
import { DPCSection } from '@/components/landing-page/DPCSection';

export const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1000px] mx-auto px-6 md:px-12 py-16 md:py-24 font-sans text-[#4b5563]">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-gray-100 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0f2d34]">
            Terms of Service
          </h1>
          <p className="text-sm font-medium text-gray-400 mt-3 md:mt-0">
            Last Updated: 01/01/2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-[#127c93] mb-4">
              1. Introduction
            </h2>
            <p className="mb-4">
              Welcome to BawaHealth. These Terms of Service ("Terms") govern your
              access to and use of our website, services, and related platforms
              (collectively, the “Services”).
            </p>
            <p>
              By accessing or using our Services, you agree to these Terms. If
              you do not agree, please discontinue use of our Services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#127c93] mb-4">
              2. About BawaHealth
            </h2>
            <p className="mb-4">
              BawaHealth Consult is a healthcare management and consulting firm
              based in <strong>Accra, Ghana</strong>, offering advisory,
              operational, and digital health support services.
            </p>
            <p>
              Our Services are intended for{' '}
              <strong>professional, institutional, and business use</strong>{' '}
              and do not replace medical care or emergency services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#127c93] mb-4">
              3. Eligibility
            </h2>
            <p className="mb-4">To use our Services, you must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be at least 18 years old</li>
              <li>Have legal capacity to enter into an agreement</li>
              <li>
                Be authorized to act on behalf of yourself or an organization
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#127c93] mb-4">
              4. Scope of Services
            </h2>
            <p className="mb-4">Our services include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Healthcare management and operational consulting</li>
              <li>Strategy and process improvement</li>
              <li>Digital health and technology integration</li>
              <li>Research, assessments, and training</li>
            </ul>

            <div className="mt-5 p-4 bg-gray-50 border-l-4 border-[#127c93] italic">
              <strong>Important:</strong> BawaHealth does not provide medical
              advice, diagnosis, or treatment. All clinical decisions remain the
              responsibility of licensed healthcare professionals.
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#127c93] mb-4">
              16. Contact Us
            </h2>
            <p className="mb-4">
              For questions or concerns regarding these Terms, please contact
              us:
            </p>
            <p className="mb-1">
              <strong>Email:</strong> privacy@bawahealth.com
            </p>
            <p>
              <strong>Address:</strong> BawaHealth Consult, Accra, Ghana
            </p>
          </section>

          {/* Data Protection Commission */}
          <div className="mt-8">
            <DPCSection />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
