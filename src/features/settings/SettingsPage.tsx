import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { getSettingsByKey, updateSettingsByKey } from "./api/settings";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {

    const [referalPoints, setReferalPoints] = useState(0);


    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['settings'],
        queryFn: () => getSettingsByKey('referral_amount'),
    });

    useEffect(() => {
        if (data) {
            setReferalPoints(parseInt(data.value));
        }
    }, [data]);

    const mutate = useMutation({
        mutationFn: () => updateSettingsByKey('referral_amount', referalPoints.toString()),
        onSuccess: () => {
            toast.success('Settings updated successfully');
        },
        onError: () => {
            toast.error('Failed to update settings');
        },
    });

    const handleSave = () => {
        mutate.mutateAsync();
    };


    return (
        <div className="space-y-6">
            <Card className="border-gray-100 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b border-gray-100">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-bold">Settings</CardTitle>
                        <p className="text-sm text-gray-500">Manage Your Global Settings</p>
                    </div>
                </CardHeader>

                <CardContent className="p-0 border-t border-gray-100">
                    {
                        isLoading && !isError ?
                            <div className="p-12 text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-100 border-t-blue-600 mb-4"></div>
                                <p className="text-gray-500">Loading Settings...</p>
                            </div>
                            :
                            <div className="grid grid-cols-12 p-4 gap-x-2">
                                <div className="col-span-3 space-y-1">
                                    <Label>Referal Points</Label>
                                    <Input
                                        type="number"
                                        value={referalPoints}
                                        onChange={(e) => setReferalPoints(parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="col-span-3 self-end">
                                    <Button
                                        disabled={mutate.isPending}
                                        className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20"
                                        onClick={handleSave}
                                    >Save</Button>
                                </div>
                            </div>
                    }
                </CardContent>
            </Card>
        </div>
    );
}