import { z } from "zod";
import { api } from "../../../lib/api"



// Zod Schema
export const rewardSchema = z.object({
    key: z.string().min(1, "Key is required"),
    value: z.string().min(1, "Value is required"),
    description: z.string().optional(),
    type: z.string().optional(),
});


export const Settings = z.object({
    key: z.string().min(1, "Key is required"),
    value: z.string().min(1, "Value is required"),
    description: z.string().optional(),
    type: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

export type Settings = z.infer<typeof Settings>;


export const getSettingsByKey = async (key: string): Promise<Settings> => {
    const response = await api.get(`admin/settings/key/${key}`);
    return response.data;
};


export const updateSettingsByKey = async (key: string, value: string): Promise<Settings> => {
    const response = await api.put(`admin/settings/key/${key}`, {
        "value": value,
        "type": "string",
        "description": "Referal Points"
    }
    );
    return response.data;
};