import { api as axios } from "../../../lib/api";
import { z } from "zod";

export interface Customer {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    total_earned_points: number;
    total_referral_points: number;
    total_used_points: number;
    created_at: string;
    updated_at: string;
}

export interface CustomersResponse {
    current_page: number;
    data: Customer[];
    last_page: number;
    total: number;
    per_page: number;
}

export interface CustomerDetailsResponse {
    customer: Customer;
}

export const createCustomerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    email: z.string().email("Invalid email address").optional().nullable().or(z.literal("")),
    total_earned_points: z.number().optional(),
    total_referral_points: z.number().optional(),
    total_used_points: z.number().optional(),
});

export type CreateCustomerData = z.infer<typeof createCustomerSchema>;

export const getCustomers = async (params?: { page?: number; per_page?: number; search?: string }) => {
    const response = await axios.get<CustomersResponse>("/admin/customers", { params });
    return response.data;
};

export const getCustomer = async (id: number) => {
    const response = await axios.get<CustomerDetailsResponse>(`/admin/customers/${id}`);
    return response.data.customer;
};

export const createCustomer = async (data: CreateCustomerData) => {
    // The API will check if customer exists by phone and update if exists, create if not
    const response = await axios.post("/admin/customers", data);
    return response.data;
};
