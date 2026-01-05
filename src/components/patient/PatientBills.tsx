import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

interface ConsultationType {
    title: string
    price: string
    description: string
}

interface PricingPlan {
    name: string
    price: string
    period: string
    description: string
    features: string[]
    isPopular?: boolean
    annualPrice?: string
    monthlyEquivalent?: string
    savings?: string
}

const consultationTypes: ConsultationType[] = [
    {
        title: "In-person Specialist Consultation",
        price: "GHS 0.00",
        description: "In-person consultation with a specialist",
    },
    {
        title: "Video Specialist Consultation",
        price: "GHS 0.00",
        description: "Video consultation with a specialist doctor",
    },
    {
        title: "Video Consultation",
        price: "GHS 0.00",
        description: "Standard video consultation with a doctor",
    },
    {
        title: "In-person Consultation",
        price: "GHS 0.00",
        description: "Face-to-face consultation at clinic",
    },
]

const monthlyPlans: PricingPlan[] = [
    {
        name: "Basic",
        price: "GHS 0.00",
        period: "/month",
        description: "Basic Monthly healthcare plan",
        features: ["Video Consultations", "Basic health monitoring", "Email support", "Access to general practitioners"],
    },
    {
        name: "Premium",
        price: "GHS 0.00",
        period: "/month",
        description: "Premium monthly healthcare plan with additional benefits",
        features: [
            "All Basic features",
            "Special consultations",
            "Priority booking",
            "24/7 chat support",
            "Health records management",
            "Prescription management",
        ],
        isPopular: true,
    },
    {
        name: "Family/Enterprise",
        price: "GHS 0.00",
        period: "/month",
        description: "Comprehensive family or enterprise healthcare plan",
        features: [
            "All Premium features",
            "Multiple family member accounts",
            "Corporate dashboard",
            "Advanced analysis",
            "Dedicated account manager",
            "Custom integrations",
        ],
    },
]

const yearlyPlans: PricingPlan[] = [
    {
        name: "Basic",
        price: "GHS 2500.00",
        period: "/year",
        monthlyEquivalent: "GHS 208.33/month when paid annually",
        description: "Basic yearly healthcare plan - save 17%",
        savings: "17%",
        features: ["Video Consultations", "Basic health monitoring", "Email support", "Access to general practitioners"],
    },
    {
        name: "Premium",
        price: "GHS 0.00",
        period: "/month",
        monthlyEquivalent: "GHS 333.33/month when paid annually",
        description: "Premium yearly healthcare plan - save 28%",
        savings: "28%",
        features: [
            "All Basic features",
            "Special consultations",
            "Priority booking",
            "24/7 chat support",
            "Health records management",
            "Prescription management",
        ],
        isPopular: true,
    },
    {
        name: "Family/Enterprise",
        price: "GHS 0.00",
        period: "/month",
        monthlyEquivalent: "GHS 333.33/month when paid annually",
        description: "Family/Enterprise yearly plan - save 28%",
        savings: "28%",
        features: [
            "All Premium features",
            "Multiple family member accounts",
            "Corporate dashboard",
            "Advanced analysis",
            "Dedicated account manager",
            "Custom integrations",
        ],
    },
]

export default function PatientBills() {
    return (
        <div className="w-full max-w-7xl mx-auto p-6 space-y-12">
            {/* Pay As You Go Section */}
            <section className="space-y-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Pay As You Go</h2>
                    <p className="text-muted-foreground">Pay only for the consultations you need, when you need them</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {consultationTypes.map((consultation, index) => (
                        <Card key={index} className="rounded-xl border-border hover:border-primary/50 transition-colors">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold">{consultation.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-2xl font-bold text-primary">{consultation.price}</p>
                                <p className="text-sm text-muted-foreground">{consultation.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Monthly Plans Section */}
            <section className="space-y-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Monthly Plans</h2>
                    <p className="text-muted-foreground">Comprehensive monthly healthcare coverage with predictable costs</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {monthlyPlans.map((plan, index) => (
                        <Card
                            key={index}
                            className={`rounded-xl relative ${plan.isPopular ? "border-2 border-primary shadow-lg" : "border-border"
                                }`}
                        >
                            {plan.isPopular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-primary text-primary-foreground px-4 py-1">Most Popular</Badge>
                                </div>
                            )}
                            <CardHeader className="text-center pb-4">
                                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                                <div className="mt-4">
                                    <span className="text-3xl font-bold text-primary">{plan.price}</span>
                                    <span className="text-muted-foreground">{plan.period}</span>
                                </div>
                                <CardDescription className="mt-2">{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                            <span className="text-sm text-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Yearly Plans Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-foreground">Yearly Plans</h2>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                        Best Value
                    </Badge>
                </div>
                <p className="text-muted-foreground">Save significantly with our annual healthcare plans</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {yearlyPlans.map((plan, index) => (
                        <Card
                            key={index}
                            className={`rounded-xl relative ${plan.isPopular ? "border-2 border-primary shadow-lg" : "border-border"
                                }`}
                        >
                            {plan.isPopular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-primary text-primary-foreground px-4 py-1">Most Popular</Badge>
                                </div>
                            )}
                            <CardHeader className="text-center pb-4">
                                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                                <div className="mt-4">
                                    <span className="text-3xl font-bold text-primary">{plan.price}</span>
                                    <span className="text-muted-foreground">{plan.period}</span>
                                </div>
                                {plan.monthlyEquivalent && (
                                    <p className="text-xs text-muted-foreground mt-1">{plan.monthlyEquivalent}</p>
                                )}
                                <CardDescription className="mt-2">{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                            <span className="text-sm text-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    )
}
