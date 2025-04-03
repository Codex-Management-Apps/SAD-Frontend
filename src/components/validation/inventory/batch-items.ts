import {z} from 'zod';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3;
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg'];

const supplierSchema = z.object({
	supplier_id: z.number().optional(),
	name: z.string().min(1),
	contact_number: z.string().min(1),
	remarks: z.string().min(1),
	profile_link: z.union([
		z
			.instanceof(File)
			.optional()
			.refine((file) => {
				return !file || file.size <= MAX_UPLOAD_SIZE;
			}, 'File size must be less than 3MB')
			.refine((file) => {
				return !file || ACCEPTED_FILE_TYPES.includes(file.type);
			}, 'File must be a PNG or JPEG'),
		z.string(),
	]),
	relationship: z.string().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
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

const productDetailsSchema = z.object({
	p_details_id: z.number().optional(),
	description: z.string().optional(),
	color: z
		.string()
		.regex(/^[a-zA-Z0-9 ]+$/, {
			message: 'Only letters, numbers, and spaces are allowed',
		})
		.optional(),
	size: z
		.string()
		.regex(/^[a-zA-Z0-9 ]+$/, {
			message: 'Only letters, numbers, and spaces are allowed',
		})
		.optional(),
	created_at: z.date().optional(),
	last_updated: z.date().optional(),
	deleted_at: z.date().nullable().optional(),
});

const productSchema = z.object({
	product_id: z.number().optional(),
	name: z.string().min(1),
	description: z.string().min(1),
	img_url: z.string(),
	is_serialize: z.boolean().optional(),
	stock_limit: z.number().min(1),
	total_stock: z.number().optional(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),

	product_categories: z.array(productCategorySchema).optional(),
	product_details: productDetailsSchema.optional(),
});

export const batchRecordSchema = z.object({
	product_record_id: z.number().optional(),
	product_id: z.number().min(1),
	supplier_id: z.number().min(1),

	quantity: z.number().min(1),
	price: z.number().min(1),
	condition: z.enum(['New', 'Secondhand', 'Broken']),
	status: z.enum([
		'Sold',
		'Pending Payment',
		'On Order',
		'In Service',
		'Awaiting Service',
		'Return Requested',
	]),

	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().nullable().optional(),

	supplier: supplierSchema.optional(),
	product: productSchema.optional(),
});

export type BatchItem = z.infer<typeof batchRecordSchema>;
