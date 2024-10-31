import {ServiceWithDetails} from '@/lib/sales-zod-schema';
import {z} from 'zod';

export const joborderSchema = z.object({
	jobrder_id: z.number().optional(),
	service_id: z.number().optional(),
	joborder_type_id: z.number().min(1),
	uuid: z.string().min(1),
	fee: z.number().min(1),
	joborder_status: z.enum([
		'Pending',
		'In Progress',
		'Completed',
		'On Hold',
		'Cancelled',
		'Awaiting Approval',
		'Approved',
		'Rejected',
		'Closed',
	]),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export type Joborder = z.infer<typeof joborderSchema>;

export type JobOrderWithDetails = {
	joborder_id?: number;
	service: ServiceWithDetails;
	joborder_type: JobOrderType;
	uuid: string;
	fee: number;
	joborder_status: string;
	created_at?: string;
	last_updated?: string;
	deleted_at?: string;
};

export const joborderTypeschema = z.object({
	joborder_type_id: z.string().optional(),
	name: z.string().min(1),
	description: z.string().min(1),
	joborder_types_status: z.string().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export type JobOrderType = z.infer<typeof joborderTypeschema>;
