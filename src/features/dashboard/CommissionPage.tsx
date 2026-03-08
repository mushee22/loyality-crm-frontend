import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductSales } from "./api/dashboard";
import { useAuth } from "../../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { DollarSign, Package, Users, Percent } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export default function CommissionPage() {
    const { user } = useAuth();

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIndex = now.getMonth();

    const getMonthDates = (year: number, month: number) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const formatDate = (d: Date) => {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}-${m}-${day}`;
        };
        return { start: formatDate(firstDay), end: formatDate(lastDay) };
    };

    const initialDates = getMonthDates(currentYear, currentMonthIndex);

    const [salesStartDate, setSalesStartDate] = useState(initialDates.start);
    const [salesEndDate, setSalesEndDate] = useState(initialDates.end);
    const [salesMonth, setSalesMonth] = useState(String(currentMonthIndex));
    const [salesYear, setSalesYear] = useState(String(currentYear));

    const handleSalesMonthChange = (newMonth: string) => {
        setSalesMonth(newMonth);
        const { start, end } = getMonthDates(Number(salesYear), Number(newMonth));
        setSalesStartDate(start);
        setSalesEndDate(end);
    };

    const handleSalesYearChange = (newYear: string) => {
        setSalesYear(newYear);
        const { start, end } = getMonthDates(Number(newYear), Number(salesMonth));
        setSalesStartDate(start);
        setSalesEndDate(end);
    };

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const years = Array.from({ length: 6 }, (_, i) => currentYear - 4 + i);

    const { data: productSales, isLoading: isLoadingSales } = useQuery({
        queryKey: ['staff', 'commission', user?.id, salesStartDate, salesEndDate],
        queryFn: () => getProductSales({
            user_id: user?.id?.toString(),
            start_date: salesStartDate,
            end_date: salesEndDate
        }),
        enabled: !!user?.id
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Commission</h1>

            {/* Filters Section */}
            <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <select
                            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 w-[120px]"
                            value={salesMonth}
                            onChange={(e) => handleSalesMonthChange(e.target.value)}
                        >
                            {months.map((month, index) => (
                                <option key={month} value={index}>
                                    {month}
                                </option>
                            ))}
                        </select>
                        <select
                            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 w-[100px]"
                            value={salesYear}
                            onChange={(e) => handleSalesYearChange(e.target.value)}
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500">From:</span>
                            <Input
                                type="date"
                                className="w-auto h-10"
                                value={salesStartDate}
                                onChange={(e) => setSalesStartDate(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500">To:</span>
                            <Input
                                type="date"
                                className="w-auto h-10"
                                value={salesEndDate}
                                onChange={(e) => setSalesEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {(salesStartDate || salesEndDate) && (
                        <div className="ml-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSalesStartDate("");
                                    setSalesEndDate("");
                                }}
                                className="text-red-500 font-medium hover:text-red-700 hover:bg-red-50 hover:bg-transparent"
                            >
                                Clear
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Commission Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Quantity Sold
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoadingSales ? "..." : (productSales?.total_quantity_sold || 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Amount Sold
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoadingSales ? "..." : (productSales?.total_amount_sold ? `₹${productSales.total_amount_sold.toLocaleString()}` : '₹0')}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Customers Count
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoadingSales ? "..." : (productSales?.customers_count || 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Commission
                        </CardTitle>
                        <Percent className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {isLoadingSales ? "..." : (productSales?.total_commission ? `₹${productSales.total_commission.toLocaleString()}` : '₹0')}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
