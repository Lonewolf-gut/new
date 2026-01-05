import { Header } from '@/components/landing-page/Header'
import { Hero } from '@/components/landing-page/Hero'
import { PlatformSection } from '@/components/landing-page/PlatformSection'
import { SecuritySection } from '@/components/landing-page/SecuritySection'
import { DisclaimerSection } from '@/components/landing-page/DisclaimerSection'
import { DPCSection } from '@/components/landing-page/DPCSection'
import { Footer } from '../components/Footer'

export function LandingPage() {
    return (
        <div className='min-h-screen from-10%'>
            <Header />
            <Hero />
            <PlatformSection />
            <SecuritySection />
            <DisclaimerSection />
            <DPCSection />
            <Footer />
        </div>
    )
}

export default LandingPage