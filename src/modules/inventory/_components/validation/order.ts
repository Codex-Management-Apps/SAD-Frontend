import {z} from 'zod';

const categorySchema = z.object({
	category_id: z.number().optional(),
	name: z.string().min(1),
	content: z.string().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

const productCategorySchema = z.object({
	product_category_id: z.number().min(1),
	product_id: z.number().min(1),
	category_id: z.number().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
	category: categorySchema.optional(),
});

const productSchema = z.object({
	product_id: z.number().optional(),
	name: z.string().min(1),
	description: z.string().min(1),
	img_url: z.string(),
	stock_limit: z.number().min(1),
	total_stock: z.number().optional(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
	product_categories: z.array(productCategorySchema).optional(),
});
const productVariantSchema = z.object({
	variant_id: z.number().optional(),
	product_id: z.number().optional(),
	variant_name: z.string().min(1),
	img_url: z.string().min(1),
	attribute: z.record(z.union([z.string(), z.number(), z.boolean()])),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	product: productSchema.optional(),
});

const itemSchema = z.object({
	item_id: z.number().optional(),
	item_record_id: z.number().optional(),
	variant_id: z.number().min(1),
	item_type: z.enum(['Batch', 'Serialized', 'Both']),
	item_condition: z.enum([
		'New',
		'Old',
		'Damage',
		'Refurbished',
		'Used',
		'Antique',
		'Repaired',
	]),
	item_status: z.enum([
		'OnStock',
		'Sold',
		'Depleted',
		'Returned',
		'Pending Payment',
		'On Order',
		'In Transit',
		'Return Requested',
		'Pending Inspection',
		'In Service',
		'Under Repair',
		'Awaiting Service',
		'Ready for Pickup',
		'Retired',
	]),
	quantity: z.number().min(1),
	reorder_level: z.number().optional(),
	created_at: z.date().optional(),
	last_updated: z.date().optional(),
	deleted_at: z.date().nullable().optional(),

	variant: productVariantSchema.optional(),
});

const orderItemSchema = z.object({
	variant_id: z.number().min(1),
	product_id: z.number().min(1),
	quantity: z.string().min(1),
	price: z.string().min(1),
	status: z.enum([
		'Pending',
		'Partially Delivered',
		'Delivered',
		'Damaged',
		'Returned',
		'Cancelled',
	]),
	item_type: z.enum(['Batch', 'Serialized', 'Both']),
	item: itemSchema.optional(),
});

const supplierSchema = z.object({
	supplier_id: z.number().optional(),
	name: z.string().min(1),
	contact_number: z.string().min(1),
	remarks: z.string().min(1),
	profile_link: z.string(),
	relationship: z.string().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
	categories: z.array(productCategorySchema).optional(),
});
const orderLogsSchema = z.object({
	order_logs: z.number().optional(),
	order_id: z.number().optional(),
	title: z.string(),
	message: z.string(),
	created_at: z.string(),
});
// =================================================================
// Actual Validation
export const orderSchema = z.object({
	order_id: z.number().optional(),
	supplier_id: z.string().nullable().optional(),
	ordered_value: z.string().optional(),
	expected_arrival: z.string().refine(
		(date) => {
			if (!date) return false;
			const expectedDate = new Date(date);
			const currentDate = new Date();
			return expectedDate > currentDate;
		},
		{
			message: 'Date should be after today.',
		},
	),
	status: z.enum([
		'Pending',
		'Processing',
		'Delivered',
		'Cancelled',
		'Return',
		'Shipped',
		'Verification',
		'Moved to Inventory',
	]),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().nullable().optional(),
	order_items: z.array(orderItemSchema).optional(),
	supplier: supplierSchema.optional(),
	messages: z.array(orderLogsSchema).optional(),
});

export type Order = z.infer<typeof orderSchema>;
