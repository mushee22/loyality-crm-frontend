import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCustomer } from "./api/customers";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { ArrowLeft, Download, Award, TrendingUp, Gift, ShoppingBag } from "lucide-react";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { toast } from "sonner";

export default function CustomerDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const cardRef = useRef<HTMLDivElement>(null);
    const customerId = Number(id);

    const { data: customer, isLoading } = useQuery({
        queryKey: ['customer', customerId],
        queryFn: () => getCustomer(customerId),
        enabled: !!customerId
    });

    const handleDownload = async () => {
        console.log("Download button clicked!");
        console.log("cardRef.current:", cardRef.current);
        console.log("customer:", customer);

        if (!cardRef.current) {
            toast.error("Card element not found");
            return;
        }

        try {
            toast.info("Generating image...");
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: '#ffffff',
                scale: 2,
                logging: true,
                useCORS: true,
            });

            console.log("Canvas generated:", canvas);

            const link = document.createElement('a');
            link.download = `${customer?.name || 'customer'}-loyalty-card.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast.success("Card downloaded successfully!");
        } catch (error) {
            console.error('Failed to download image:', error);
            toast.error("Failed to download card. Check console for details.");
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading customer details...</div>;
    if (!customer) return <div className="p-8 text-center text-red-500">Customer not found</div>;

    const totalPoints = customer.total_earned_points + customer.total_referral_points - customer.total_used_points;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between relative z-10">
                <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-slate-900" onClick={() => navigate("/customers")}>
                    <ArrowLeft className="h-4 w-4" />
                    Back to Customers
                </Button>
                <Button
                    className="gap-2 bg-slate-900 hover:bg-slate-800 text-white"
                    onClick={() => {
                        console.log("Button clicked directly!");
                        handleDownload();
                    }}
                >
                    <Download className="h-4 w-4" />
                    Download Card
                </Button>
            </div>

            {/* Loyalty Card */}
            <div ref={cardRef} className="relative">
                <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                    <CardContent className="p-0">
                        {/* Decorative Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
                        </div>

                        <div className="relative p-8 md:p-12">
                            {/* Header Section */}
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                                            <Award className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold text-white tracking-tight">{customer.name}</h1>
                                            <p className="text-slate-300 text-sm">Loyalty Member</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Member ID</div>
                                    <div className="text-lg font-mono font-bold text-white">#{String(customer.id).padStart(6, '0')}</div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                                <div>
                                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Phone</div>
                                    <div className="text-white font-medium">{customer.phone}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Email</div>
                                    <div className="text-white font-medium">{customer.email || 'Not provided'}</div>
                                </div>
                            </div>

                            {/* Points Display */}
                            <div className="mb-8">
                                <div className="text-center mb-6">
                                    <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">Total Available Points</div>
                                    <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
                                        {totalPoints}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                                        <TrendingUp className="h-5 w-5 text-green-400 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-green-400">{customer.total_earned_points}</div>
                                        <div className="text-xs text-slate-400 mt-1">Earned</div>
                                    </div>
                                    <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                        <Gift className="h-5 w-5 text-blue-400 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-blue-400">{customer.total_referral_points}</div>
                                        <div className="text-xs text-slate-400 mt-1">Referral</div>
                                    </div>
                                    <div className="text-center p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                                        <ShoppingBag className="h-5 w-5 text-amber-400 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-amber-400">{customer.total_used_points}</div>
                                        <div className="text-xs text-slate-400 mt-1">Redeemed</div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="pt-6 border-t border-white/10">
                                <div className="text-xs text-slate-400 uppercase tracking-wider">Member Since</div>
                                <div className="text-white font-medium">{new Date(customer.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-gray-100 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Points Earned</div>
                                <div className="text-2xl font-bold text-gray-900">{customer.total_earned_points}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-gray-100 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Gift className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Referral Bonus</div>
                                <div className="text-2xl font-bold text-gray-900">{customer.total_referral_points}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-gray-100 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                                <ShoppingBag className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Points Used</div>
                                <div className="text-2xl font-bold text-gray-900">{customer.total_used_points}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
