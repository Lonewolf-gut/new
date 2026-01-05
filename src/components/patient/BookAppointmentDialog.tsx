import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { usePatientDataStore } from '@/stores/patientDataStore';
import { AlertCircle, DollarSign, Shield, Calendar, Star, } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Doctor, TimeSlot } from '@/types/interfaces';
import LoaderIcon from '../LoaderIcon';

interface BookAppointmentFormProps {
    doctor: Partial<Doctor>;
    timeSlot: Partial<TimeSlot>;
    open: boolean;
    setIsOpen: (open: boolean) => void;
}

type PaymentMethod = 'pay-now' | 'insurance' | 'monthly' | 'yearly';

export default function BookAppointmentForm({
    doctor = {
        firstName: '',
        lastName: '',
    },
    timeSlot = {
        id: '',
        time: '',
        duration: '',
    },
    open,
    setIsOpen
}: BookAppointmentFormProps) {
    const [symptoms, setSymptoms] = useState('');
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('pay-now');
    const consultationFee = usePatientDataStore((state) => state.fees?.consultationFee ?? 0);

    const platformFee = 15.00;
    const total = consultationFee + platformFee;

    const initializePaymentMutation = useMutation({
        mutationFn: (data: { doctorId: string; slotId: string; symptoms?: string }) =>
            api.payments.initialize(data),
        onSuccess: (response) => {
            const authorizationUrl = response.data.data.authorization_url;
            if (authorizationUrl) {
                window.location.href = authorizationUrl;
            }
        },
        onError: (error: any) => {
            console.error('Payment initialization failed:', error);
        }
    });

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        initializePaymentMutation.mutate({
            doctorId: doctor.id!,
            slotId: timeSlot.id!,
            symptoms: symptoms.trim() || undefined
        });
    };

    const paymentOptions = [
        {
            id: 'pay-now' as PaymentMethod,
            icon: DollarSign,
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-50',
            title: 'Pay Now',
            subtitle: 'One-time Payment',
            enabled: true,
        },
        {
            id: 'insurance' as PaymentMethod,
            icon: Shield,
            iconColor: 'text-green-600',
            iconBg: 'bg-green-50',
            title: 'Insurance',
            subtitle: 'Setup Required',
            enabled: false,
        },
        {
            id: 'monthly' as PaymentMethod,
            icon: Calendar,
            iconColor: 'text-purple-600',
            iconBg: 'bg-purple-50',
            title: 'Monthly Plan',
            subtitle: 'Setup Required',
            enabled: false,
        },
        {
            id: 'yearly' as PaymentMethod,
            icon: Star,
            iconColor: 'text-amber-600',
            iconBg: 'bg-amber-50',
            title: 'Yearly Plan',
            subtitle: 'Setup Required',
            enabled: false,
        },
    ];

    return (
        <Dialog open={open} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-bold">You're not Subscribed!</DialogTitle>
                            <DialogDescription className="mt-1">
                                Select a payment plan
                            </DialogDescription>
                        </div>

                    </div>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* Payment Options Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {paymentOptions.map((option) => {
                            const IconComponent = option.icon;
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => option.enabled && setSelectedPayment(option.id)}
                                    disabled={!option.enabled}
                                    className={`
                                        relative p-4 rounded-lg border-2 text-left transition-all
                                        ${option.enabled
                                            ? selectedPayment === option.id
                                                ? 'border-primary bg-primary/5'
                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                            : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                                        }
                                    `}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${option.iconBg}`}>
                                            <IconComponent className={`h-6 w-6 ${option.iconColor}`} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-base">{option.title}</h3>
                                            <p className="text-sm text-gray-500 mt-0.5">{option.subtitle}</p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Symptoms Textarea */}
                    <div className="space-y-2">
                        <Label htmlFor="symptoms" className="text-sm font-medium">
                            Symptoms <span className="text-gray-500 font-normal">(Optional)</span>
                        </Label>
                        <Textarea
                            id="symptoms"
                            placeholder="Describe your symptoms, concerns, or reason for consultation..."
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            rows={4}
                            maxLength={500}
                            disabled={initializePaymentMutation.isPending}
                            className="resize-none"
                        />
                        <p className="text-xs text-slate-500 text-right">
                            {symptoms.length}/500 characters
                        </p>
                    </div>

                    {/* Cost Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <h3 className="font-semibold text-lg mb-3">Cost Summary</h3>

                        <div className="flex justify-between text-gray-600">
                            <span>Consultation Fee</span>
                            <span>GHS {consultationFee?.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-gray-600">
                            <span>Platform Fee</span>
                            <span>GHS {platformFee.toFixed(2)}</span>
                        </div>

                        <div className="pt-3 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-lg">Total</span>
                                <span className="font-bold text-xl text-primary">
                                    GHS {total.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Error Alert */}
                    {initializePaymentMutation.isError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {initializePaymentMutation.error?.message ||
                                    'Failed to initialize payment. Please try again.'}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Submit Button */}
                    <Button
                        onClick={handleSubmit}
                        className="w-full h-12 text-base font-semibold"
                        disabled={initializePaymentMutation.isPending || initializePaymentMutation.isSuccess}
                    >
                        {initializePaymentMutation.isPending ? (
                            <>
                                <LoaderIcon />
                                Processing...
                            </>
                        ) : initializePaymentMutation.isSuccess ? (
                            <>
                                Redirecting...
                            </>
                        ) : (
                            'Proceed'
                        )}
                    </Button>

                    {/* Info Text */}
                    <p className="text-xs text-center text-slate-500">
                        Booking with {doctor.firstName} {doctor.lastName} at {timeSlot.time} •
                        You will be redirected to Paystack to complete your payment securely
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}