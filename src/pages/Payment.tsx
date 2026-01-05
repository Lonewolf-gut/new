import React from 'react';
import { Header } from '@/components/landing-page/Header';
import { Footer } from '@/components/Footer';
import { DPCSection } from '@/components/landing-page/DPCSection';

export const PaymentRefundPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1000px] mx-auto px-6 md:px-12 py-16 md:py-24 font-sans text-[#4b5563]">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-gray-100 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0f2d34]">
            Payment & Refund Policy
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
            <p>
              This Payment & Refund Policy ("Policy") explains how payments,
              fees, cancellations, and refunds are handled for services provided
              by BawaHealth. By engaging our services or making a payment, you
              agree to this Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#127c93] mb-4">
              2. Fees & Pricing
            </h2>
            <p className="mb-4">All fees are:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Clearly communicated in advance through proposals or invoices</li>
              <li>Based on the scope, duration, and complexity of services</li>
              <li>Quoted in the applicable currency</li>
            </ul>
            <p className="mt-4">
              Pricing changes do not affect existing signed agreements unless
              agreed in writing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#127c93] mb-4">
              3. Payment Terms
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Payments are due before service commencement or per milestones</li>
              <li>Invoices must be paid within the stated timeframe</li>
              <li>Late payments may result in service suspension</li>
            </ul>
            <p className="mt-4">
              Deliverables may be withheld until outstanding balances are
              settled.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#127c93] mb-4">
              4. Accepted Payment Methods
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Bank transfer</li>
              <li>Mobile money</li>
              <li>Online payment gateways</li>
              <li>Health insurance (where applicable)</li>
            </ul>
            <p className="mt-4">
              Payments must be made to official BawaHealth accounts only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#127c93] mb-4">
              5. Taxes & Charges
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Applicable taxes and statutory charges</li>
              <li>Transaction or bank fees unless stated otherwise</li>
            </ul>
            <p className="mt-4">
              All prices are exclusive of taxes unless explicitly stated.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#127c93] mb-4">
              6. Refund Policy
            </h2>
            <p className="mb-4">
              Due to the customized and professional nature of our services:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Payments are generally non-refundable once work begins</li>
              <li>Refunds are assessed on a case-by-case basis</li>
            </ul>

            <p className="mt-4 font-bold">Refunds may be considered for:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Duplicate payments</li>
              <li>Services paid for but not started</li>
              <li>Billing errors attributable to BawaHealth</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#127c93] mb-4">
              7. Cancellations
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Written notice is required</li>
              <li>Completed or ongoing work is non-refundable</li>
              <li>Outstanding balances remain payable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#127c93] mb-4">
              8. Disputed Payments
            </h2>
            <p>
              Payment disputes must be submitted in writing within 7 days of
              the invoice or payment date. Chargebacks without prior notice may
              result in service suspension.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#127c93] mb-4">
              9. Service Suspension
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Overdue payments</li>
              <li>Suspected fraudulent activity</li>
              <li>Repeated violations of payment terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#127c93] mb-4">
              10. Changes to This Policy
            </h2>
            <p>
              This Policy may be updated periodically. Continued use of our
              Services constitutes acceptance of the revised Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#127c93] mb-4">
              11. Contact Us
            </h2>
            <p className="mb-4">
              For questions regarding this Policy, please contact us:
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
