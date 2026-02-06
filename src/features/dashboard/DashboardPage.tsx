import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardMetrics, getProductSales } from "./api/dashboard";
import { getProducts } from "../products/api/products";
import { getUsers } from "../users/api/users";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { DollarSign, Package, Users } from "lucide-react";

export default function DashboardPage() {
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

    const [selectedProductId, setSelectedProductId] = useState<string>("");
    const [selectedUserId, setSelectedUserId] = useState<string>("");

    // Stats Filters State
    const [statsStartDate, setStatsStartDate] = useState(initialDates.start);
    const [statsEndDate, setStatsEndDate] = useState(initialDates.end);
    const [statsMonth, setStatsMonth] = useState(String(currentMonthIndex));
    const [statsYear, setStatsYear] = useState(String(currentYear));

    // Sales Filters State
    const [salesStartDate, setSalesStartDate] = useState(initialDates.start);
    const [salesEndDate, setSalesEndDate] = useState(initialDates.end);
    const [salesMonth, setSalesMonth] = useState(String(currentMonthIndex));
    const [salesYear, setSalesYear] = useState(String(currentYear));

    // Stats Handlers
    const handleStatsMonthChange = (newMonth: string) => {
        setStatsMonth(newMonth);
        const { start, end } = getMonthDates(Number(statsYear), Number(newMonth));
        setStatsStartDate(start);
        setStatsEndDate(end);
    };

    const handleStatsYearChange = (newYear: string) => {
        setStatsYear(newYear);
        const { start, end } = getMonthDates(Number(newYear), Number(statsMonth));
        setStatsStartDate(start);
        setStatsEndDate(end);
    };

    // Sales Handlers
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

    const { data: metrics, isLoading: isLoadingMetrics, error: metricsError } = useQuery({
        queryKey: ['admin', 'dashboard', statsStartDate, statsEndDate],
        queryFn: () => getDashboardMetrics({ start_date: statsStartDate, end_date: statsEndDate }),
    });

    const { data: products } = useQuery({
        queryKey: ['products', 'list'],
        queryFn: () => getProducts({ per_page: 100, is_active: true }),
    });

    const { data: users } = useQuery({
        queryKey: ['users', 'staff'],
        queryFn: () => getUsers({ per_page: 100 }),
    });

    // Set default user to the first one when users are loaded
    useEffect(() => {
        if (!selectedUserId && users?.data && users.data.length > 0) {
            setSelectedUserId(users.data[0].id.toString());
        }
    }, [users?.data, selectedUserId]);

    const { data: productSales, isLoading: isLoadingSales } = useQuery({
        queryKey: ['admin', 'dashboard', 'sales', selectedProductId, selectedUserId, salesStartDate, salesEndDate],
        queryFn: () => getProductSales({
            product_id: selectedProductId,
            user_id: selectedUserId,
            start_date: salesStartDate,
            end_date: salesEndDate
        }),
        enabled: !!selectedUserId || !!selectedProductId // Only fetch if we have filters, though now we enforce user_id
    });

    if (isLoadingMetrics) {
        return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
    }

    if (metricsError) {
        return (
            <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg">
                <p>Error loading dashboard: {(metricsError as Error).message}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>

            {/* Stats Filters Section */}
            <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex flex-wrap items-center gap-4">
                    <span className="text-sm font-semibold text-gray-700">Overview Filters:</span>
                    {/* Stats Month/Year Selectors */}
                    <div className="flex items-center gap-2">
                        <select
                            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            value={statsMonth}
                            onChange={(e) => handleStatsMonthChange(e.target.value)}
                        >
                            {months.map((month, index) => (
                                <option key={month} value={index}>
                                    {month}
                                </option>
                            ))}
                        </select>
                        <select
                            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            value={statsYear}
                            onChange={(e) => handleStatsYearChange(e.target.value)}
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>

                    {/* Stats Date Range Inputs */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 font-medium">From:</span>
                            <Input
                                type="date"
                                className="w-auto h-10"
                                value={statsStartDate}
                                onChange={(e) => setStatsStartDate(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 font-medium">To:</span>
                            <Input
                                type="date"
                                className="w-auto h-10"
                                value={statsEndDate}
                                onChange={(e) => setStatsEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {(statsStartDate || statsEndDate) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setStatsStartDate("");
                                setStatsEndDate("");
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Order Amount
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoadingMetrics ? "..." : (metrics?.total_amount ? `₹${metrics.total_amount}` : '₹0')}
                        </div>
                        {/* <p className="text-xs text-muted-foreground">
                            Lifetime revenue
                        </p> */}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Products
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoadingMetrics ? "..." : (metrics?.product_count || 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Active products
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Customers
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoadingMetrics ? "..." : (metrics?.customer_count || 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Registered customers
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Product Sales Section */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Product Sales
                    </h2>
                </div>

                {/* Filters Section */}
                <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="text-sm font-semibold text-gray-700">Sales Filters:</span>
                        {/* Sales Month/Year Selectors */}
                        <div className="flex items-center gap-2">
                            <select
                                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
                                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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

                        {/* Sales Date Range Inputs */}
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 font-medium">From:</span>
                                <Input
                                    type="date"
                                    className="w-auto h-10"
                                    value={salesStartDate}
                                    onChange={(e) => setSalesStartDate(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 font-medium">To:</span>
                                <Input
                                    type="date"
                                    className="w-auto h-10"
                                    value={salesEndDate}
                                    onChange={(e) => setSalesEndDate(e.target.value)}
                                />
                            </div>
                        </div>

                        {(salesStartDate || salesEndDate) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSalesStartDate("");
                                    setSalesEndDate("");
                                }}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                                Clear
                            </Button>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 border-t border-gray-200 pt-4">
                        <div className="w-full sm:w-auto">
                            <select
                                className="h-10 w-full sm:w-[250px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                value={selectedProductId}
                                onChange={(e) => setSelectedProductId(e.target.value)}
                            >
                                <option value="">All Products</option>
                                {products?.data.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full sm:w-auto">
                            <select
                                className="h-10 w-full sm:w-[250px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                            >
                                {users?.data.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.role})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Product Sales Stats */}
                <div className="grid gap-4 md:grid-cols-3">
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
                                Total Sales Amount
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
                                Unique Customers
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {isLoadingSales ? "..." : (productSales?.customers_count || 0)}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
