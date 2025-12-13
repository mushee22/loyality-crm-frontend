import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { createProductSchema, type CreateProductData, type Product } from "../api/products";
import { useEffect } from "react";

interface ProductFormProps {
    onSubmit: (data: CreateProductData) => void;
    isLoading?: boolean;
    initialData?: Product | null;
}

export function ProductForm({ onSubmit, isLoading, initialData }: ProductFormProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateProductData>({
        resolver: zodResolver(createProductSchema) as any,
        defaultValues: {
            is_active: true,
            discount_price: 0
        }
    });

    // Reset form when initialData changes (for edit mode)
    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name,
                sku: initialData.sku,
                price: initialData.price,
                discount_price: initialData.discount_price || 0,
                stock: initialData.stock,
                is_active: initialData.is_active,
            });
        } else {
            reset({
                name: "",
                sku: "",
                price: 0,
                discount_price: 0,
                stock: 0,
                is_active: true,
            });
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" placeholder="Loyalty Card Gold" {...register("name")} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" placeholder="SKU-001" {...register("sku")} />
                {errors.sku && <p className="text-sm text-red-500">{errors.sku.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input id="price" type="number" step="0.01" placeholder="99.99" {...register("price")} />
                    {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="discount_price">Discount Price (₹)</Label>
                    <Input id="discount_price" type="number" step="0.01" placeholder="79.99" {...register("discount_price")} />
                    {errors.discount_price && <p className="text-sm text-red-500">{errors.discount_price.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" placeholder="100" {...register("stock")} />
                {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
            </div>

            <div className="flex items-center space-x-2 pt-2">
                <input
                    type="checkbox"
                    id="is_active"
                    className="h-4 w-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900"
                    {...register("is_active")}
                />
                <Label htmlFor="is_active" className="font-normal text-sm text-gray-700">Active Product</Label>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading} className="bg-slate-900 hover:bg-slate-800 text-white min-w-[120px]">
                    {isLoading ? "Saving..." : (initialData ? "Update Product" : "Create Product")}
                </Button>
            </div>
        </form>
    );
}
