import { api } from "../../../lib/api";
import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(1, "Name is required"),
    sku: z.string().min(1, "SKU is required"),
    price: z.coerce.number().min(0, "Price must be positive"),
    discount_price: z.coerce.number().min(0, "Discount price must be positive").optional(),
    stock: z.coerce.number().int().min(0, "Stock must be non-negative"),
    is_active: z.boolean().default(true),
});

export type CreateProductData = z.infer<typeof createProductSchema>;

// Types based on User Response
export interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    discount_price: number | null;
    stock: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface ProductListResponse {
    current_page: number;
    data: Product[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface GetProductsParams {
    page?: number;
    search?: string;
    is_active?: boolean;
    per_page?: number;
}

export const getProducts = async (params: GetProductsParams = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());

    const response = await api.get<ProductListResponse>(`admin/products?${queryParams.toString()}`);
    return response.data;
};

export const createProduct = async (data: CreateProductData) => {
    const response = await api.post('admin/products', data);
    return response.data;
};

export const updateProduct = async ({ id, data }: { id: number; data: CreateProductData }) => {
    const response = await api.put(`admin/products/${id}`, data);
    return response.data;
};

export const deleteProduct = async (id: number) => {
    const response = await api.delete(`admin/products/${id}`);
    return response.data;
};
