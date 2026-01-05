import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Icon } from '@iconify/react';

export default function PaymentCallback() {
    const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'failed' | 'error'>('verifying');
    const [paymentData, setPaymentData] = useState<any>(null);

    const getPaymentReference = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('reference') || params.get('trxref');
    };

    const paymentReference = getPaymentReference();

    const verifyPaymentMutation = useMutation({
        mutationFn: (ref: string) => api.payments.verify(ref),
        onSuccess: (response) => {
            const data = response.data.data;
            setPaymentData(data);

            if (data.status === 'success') {
                setVerificationStatus('success');
            } else {
                setVerificationStatus('failed');
            }
        },
        onError: (error: any) => {
            console.error('Payment verification error:', error);
            setVerificationStatus('error');
        }
    });

    useEffect(() => {
        if (paymentReference) {
            const timer = setTimeout(() => {
                verifyPaymentMutation.mutate(paymentReference);
            }, 2000);

            return () => clearTimeout(timer);
        } else {
            setVerificationStatus('error');
        }
    }, [paymentReference]);

    const handleViewAppointment = () => {
        window.location.href = `/patient/dashboard`;

    };

    const handleTryAgain = () => {
        window.location.href = '/doctors';
    };

    const handleContactSupport = () => {
        window.location.href = '/support';
    };

    const handleRetryVerification = () => {
        window.location.reload();
    };

    const renderContent = () => {
        switch (verificationStatus) {
            case 'verifying':
                return (
                    <div className="flex flex-col items-center justify-center space-y-4 py-8">
                        <Icon icon="ri:loader-5-fill" className="h-16 w-16 animate-spin text-primary" />
                        <h2 className="text-2xl font-semibold text-black">Verifying Payment</h2>
                        <p className="text-gray-600 text-center max-w-md">
                            Please wait while we confirm your payment...
                        </p>
                    </div>
                );

            case 'success':
                return (
                    <div className="flex flex-col items-center justify-center space-y-6 py-8">
                        <div className="bg-green-100 rounded-full p-4">
                            <Icon icon="iconamoon:check-circle-2-fill" className="h-16 w-16 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-black">Payment Successful!</h2>
                        <p className="text-gray-600 text-center max-w-md">
                            Your appointment has been confirmed. You will receive a confirmation email shortly.
                        </p>

                        {paymentData && (
                            <div className="w-full bg-primary/5 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Amount Paid</span>
                                    <span className="font-semibold ">
                                        {paymentData.currency?.toUpperCase()} {paymentData.amount?.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Reference</span>
                                    <span className="font-mono text-xs">{paymentData.reference}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Appointment ID</span>
                                    <span className="font-mono text-xs">{paymentData.appointmentId}</span>
                                </div>
                            </div>
                        )}

                        <Button onClick={handleViewAppointment} size="lg" className="w-full">
                            Dashboard
                        </Button>
                    </div>
                );

            case 'failed':
                return (
                    <div className="flex flex-col items-center justify-center space-y-6 py-8">
                        <div className="bg-red-100 rounded-full p-4">
                            <Icon icon="line-md:cancel" className="h-16 w-16 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-black">Payment Failed</h2>
                        <p className="text-gray-600 text-center max-w-md">
                            Your payment could not be processed. Please try again or contact support if the problem persists.
                        </p>

                        {paymentData && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Transaction Details</AlertTitle>
                                <AlertDescription className="font-mono text-xs mt-2">
                                    Reference: {paymentData.reference}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="flex gap-3 w-full">
                            <Button onClick={handleTryAgain} variant="outline" className="flex-1">
                                Try Again
                            </Button>
                            <Button onClick={handleContactSupport} className="flex-1">
                                Contact Support
                            </Button>
                        </div>
                    </div>
                );

            case 'error':
                return (
                    <div className="flex flex-col items-center justify-center space-y-6 py-8">
                        <div className="bg-yellow-100 rounded-full p-4">
                            <Icon icon="line-md:alert" className="h-16 w-16 text-yellow-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-black">Verification Error</h2>
                        <p className="text-gray-600 text-center max-w-md">
                            {!paymentReference
                                ? 'No payment reference found. Please check your payment link.'
                                : 'We encountered an error verifying your payment. Please contact support with your reference number.'
                            }
                        </p>

                        {paymentReference && (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Payment Reference</AlertTitle>
                                <AlertDescription className="font-mono text-xs mt-2">
                                    {paymentReference}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="flex gap-3 w-full">
                            <Button onClick={handleRetryVerification} variant="outline" className="flex-1">
                                Retry Verification
                            </Button>
                            <Button onClick={handleContactSupport} className="flex-1">
                                Contact Support
                            </Button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-lg shadow-none">
                <CardHeader>
                    <CardTitle className="text-center">Payment Processing</CardTitle>
                    <CardDescription className="text-center">
                        {verificationStatus === 'verifying' && 'Confirming your transaction'}
                        {verificationStatus === 'success' && 'Transaction completed successfully'}
                        {verificationStatus === 'failed' && 'Transaction could not be completed'}
                        {verificationStatus === 'error' && 'Unable to verify transaction'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {renderContent()}
                </CardContent>
            </Card>
        </div>
    );
}