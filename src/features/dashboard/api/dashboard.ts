import { api } from "../../../lib/api";

export interface DashboardMetrics {
    total_amount: number;
    product_count: number;
    customer_count: number;
}

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
    const response = await api.get<DashboardMetrics>('/admin/dashboard');
    return response.data;
};

export interface ProductSalesStats {
    product_id: number | null;
    user_id: number | null;
    total_quantity_sold: number;
    total_amount_sold: number;
    customers_count: number;
}

export const getProductSales = async (params: { product_id?: string; user_id?: string; start_date?: string; end_date?: string }) => {
    const queryParams = new URLSearchParams();
    if (params.product_id) queryParams.append('product_id', params.product_id);
    if (params.user_id) queryParams.append('user_id', params.user_id);
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);

    const response = await api.get<ProductSalesStats>(`/admin/dashboard/product-sales?${queryParams.toString()}`);
    return response.data;
};
