import React from 'react';
import { ArrowRight } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-[1000px] mx-auto px-6 md:px-12 py-16 md:py-24 font-sans text-[#4b5563]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-gray-100 pb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-[#0f2d34] mb-4 md:mb-0">Privacy Policy</h1>
        <p className="text-sm font-medium text-gray-400">Last Updated: 01/01/2026</p>
      </div>

      <div className="space-y-12 leading-relaxed">
        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-bold text-[#127c93] mb-4">1. Introduction</h2>
          <p className="mb-4">
            BawaHealth respects your privacy and is committed to protecting it through our compliance with this Privacy Policy.
          </p>
          <p className="mb-4">
            This Privacy Policy describes the types of information we may collect or that you may provide when you visit our website (e.g., www.bawahealth.com) or use our consulting and digital services (collectively, the "Services"), and our practices for collecting, using, maintaining, protecting, and disclosing that information. By accessing or using our Services, you agree to the terms of this Privacy Policy.
          </p>
          <p>Sully</p>
          <p className="mt-4">
            Please read this privacy policy carefully to understand how we handle your information. We may update this policy from time to time, and your continued use of the Services after changes are made constitutes acceptance of those changes.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-bold text-[#127c93] mb-4">2. Who We Are & Contact Information</h2>
          <p className="mb-4">
            <strong>BawaHealth</strong> is a healthcare management and consulting firm headquartered in Accra, Ghana. If you have any questions about this Privacy Policy or wish to exercise your privacy rights, you may contact us at:
          </p>
          <p className="mb-1"><strong>Email:</strong> privacy@bawahealth.com</p>
          <p><strong>Address:</strong> BawaHealth Consult, Accra, Ghana</p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-bold text-[#127c93] mb-4">3. Information We Collect</h2>
          <p className="mb-4">We may collect personal information from you when you:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Register for our Services</li>
            <li>Fill out contact or consultation forms</li>
            <li>Sign up for newsletters or updates</li>
            <li>Communicate with us via email or phone</li>
          </ul>
          <p className="mb-4">The types of personal information we may collect include (but are not limited to):</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Contact Information:</strong> name, email address, telephone number, postal address</li>
            <li><strong>Professional Information:</strong> job title, organization/clinic details</li>
            <li><strong>Service Information:</strong> consultation requests, project details</li>
            <li><strong>Usage Data:</strong> IP address, browser type, pages visited, analytics data</li>
          </ul>
          <p>
            We collect this information to deliver our services, respond to inquiries, and provide tailored support. We do not sell your personal information to third parties.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-bold text-[#127c93] mb-4">4. How We Collect Information</h2>
          <p className="mb-4">We collect information in the following ways:</p>
          <div className="space-y-4">
            <div>
              <p className="font-bold text-[#0f2d34]">Directly From You:</p>
              <p>When you voluntarily provide information through forms, emails, or other interactions.</p>
            </div>
            <div>
              <p className="font-bold text-[#0f2d34]">Automatically:</p>
              <p>When you use our website, we may automatically collect certain information via cookies or similar technologies (e.g., IP address, device type). These help us improve our Services and understand usage trends.</p>
            </div>
            <div>
              <p className="font-bold text-[#0f2d34]">From Third-Party Services:</p>
              <p>We may receive information about you from third-party services only if you have explicitly authorized those services to share your data with us.</p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-bold text-[#127c93] mb-4">5. Use of Your Information</h2>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, operate, and maintain our Services</li>
            <li>Respond to inquiries and requests</li>
            <li>Improve our Services and user experience</li>
            <li>Send communications such as newsletters and updates (only with consent)</li>
            <li>Comply with applicable laws and regulations</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-2xl font-bold text-[#127c93] mb-4">6. Sharing Your Information</h2>
          <p className="mb-4">We may share personal information with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Service Providers:</strong> third parties who help with website hosting, analytics, or email communications</li>
            <li><strong>Legal Requests:</strong> if required by law, court order, or to protect our rights or safety</li>
            <li><strong>Business Transfers:</strong> if BawaHealth Consult is involved in a merger or acquisition</li>
          </ul>
          <p className="mt-4">We do not share your information for third-party marketing without your consent.</p>
        </section>

        {/* Sections 7-13 simplified for brevity while remaining complete */}
        <section>
          <h2 className="text-2xl font-bold text-[#127c93] mb-4">7. Cookies and Tracking Technologies</h2>
          <p>Our website may use cookies, web beacons, or similar tools to collect information about how you interact with our site. You can usually configure your browser to refuse cookies, though this may affect your experience.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#127c93] mb-4">8. Data Retention</h2>
          <p>We retain personal information only as long as necessary to provide your requested Services or to comply with legal, tax, or accounting requirements.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#127c93] mb-4">9. Security of Your Information</h2>
          <p>We implement reasonable administrative, technical, and physical safeguards to protect your personal data. However, no security system is completely impenetrable. If you believe your information has been compromised, please contact us immediately.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#127c93] mb-4">10. Your Rights</h2>
          <p className="mb-4">Depending on applicable laws (e.g., Ghana's Data Protection Act, GDPR), you may have rights including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access: request a copy of information we hold about you</li>
            <li>Correction: request corrections to inaccurate data</li>
            <li>Deletion: request deletion of your personal information</li>
            <li>Opt-out: withdraw consent for certain communications</li>
          </ul>
          <p className="mt-4">To exercise these rights, contact privacy@bawahealth.com.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#127c93] mb-4">11. Children's Privacy</h2>
          <p>Our Services are not intended for children under the age of 13. We do not knowingly collect personal information from minors without parental consent.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#127c93] mb-4">12. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. The "Last Updated" date will reflect the most recent changes, and your continued use of our Services signifies acceptance.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#127c93] mb-4">13. Contact Us</h2>
          <p className="mb-4">If you have questions, concerns, or requests regarding this Privacy Policy, please contact:</p>
          <p className="mb-1"><strong>Email:</strong> privacy@bawahealth.com</p>
          <p><strong>Address:</strong> BawaHealth Consult, Accra, Ghana</p>
        </section>

        {/* DPC Regulation Box (Section 14/Footer content) */}
        <div className="mt-20 flex flex-col md:flex-row items-center gap-10 border border-gray-100 rounded-[32px] p-10 bg-white shadow-sm">
          <div className="w-full md:w-1/3 flex justify-center shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#127c93] rounded-full flex items-center justify-center shrink-0 shadow-lg">
                <span className="text-white font-black text-xl italic tracking-tighter">DPC</span>
              </div>
              <div className="leading-tight flex flex-col text-[#0f2d34]">
                <span className="font-extrabold text-base md:text-lg">DATA PROTECTION</span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-black -mt-0.5 opacity-70">COMMISSION</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-base font-bold text-[#0f2d34] mb-3">Regulated by Ghana's Data Protection Commission</h4>
            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
              BawaHealth operates in compliance with the Data Protection Act, 2012 (Act 843). The Data Protection Commission (DPC) oversees the protection of personal data and ensures we maintain the highest standards of data privacy and security.
            </p>
            <button className="flex items-center gap-2 text-[#127c93] font-bold text-sm hover:underline group">
              Learn more about DPC 
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};