import {create} from 'zustand';
import {toast} from 'sonner';
import {BatchItem} from '../validation/batch-items';
import {SerializeItem} from '../validation/serialize-items';

type Product = BatchItem | SerializeItem;

export interface SalesItem {
	product_id: number;
	quantity: number;
	product_record_id: number | undefined;
	serial_id: number | undefined;
	sold_price: number;
	total_price: number;
	record: Product;
	data: Product;
}
interface SalesHook {
	salesHookData: SalesItem[];
	trigger: boolean;
	addProduct: (
		product: Product,
		quantity: number,
		record_id: number,
		serialized: boolean,
	) => void;
	updateQuantity: (index: number, quantity: number) => void;
	removeProduct: (id: number) => void;
	resetProducts: () => void;
}

export const useSalesHook = create<SalesHook>((set) => ({
	salesHookData: [],
	trigger: false,

	addProduct: (product, quantity, record_id, serialized) =>
		set((state) => {
			const exists = state.salesHookData.some(
				(p) => p.product_id === product.product_id, // Assuming `Product` has an `id` field
			);
			if (exists) {
				toast.error(`Product with id ${product.product_id} already exists.`);
				return state;
			}

			if (serialized) {
				const salesItem: SalesItem = {
					product_id: product.product_id,
					product_record_id: undefined,
					serial_id: record_id,
					quantity: quantity,
					sold_price: product.price || 0,
					total_price: (product.price || 0) * quantity,
					record: product,
					data: product,
				};

				return {
					salesHookData: [...state.salesHookData, salesItem],
					trigger: !state.trigger,
				};
			} else {
				const salesItem: SalesItem = {
					product_id: product.product_id,
					product_record_id: record_id,
					serial_id: undefined,
					quantity: quantity,
					sold_price: product.price || 0,
					total_price: (product.price || 0) * quantity,
					record: product,
					data: product,
				};

				return {
					salesHookData: [...state.salesHookData, salesItem],
					trigger: !state.trigger,
				};
			}
		}),

	updateQuantity: (index, quantity) =>
		set((state) => {
			if (index < 0 || index >= state.salesHookData.length) {
				toast.error(`Invalid index ${index}.`);
				return state;
			}

			if (isNaN(quantity) || quantity < 1) {
				return state;
			}

			const currentItem = state.salesHookData[index];
			if (quantity > (currentItem.data.quantity || 0)) {
				return state;
			}

			const updatedSalesHookData = [...state.salesHookData];
			updatedSalesHookData[index] = {
				...updatedSalesHookData[index],
				quantity: quantity,
			};

			return {
				salesHookData: updatedSalesHookData,
				trigger: !state.trigger,
			};
		}),

	removeProduct: (id) =>
		set((state) => {
			const exists = state.salesHookData.some((p) => p.product_id === id);
			if (!exists) {
				toast.error(`Product with id ${id} does not exist.`);
				return state;
			}

			return {
				salesHookData: state.salesHookData.filter((p) => p.product_id !== id),
				trigger: !state.trigger,
			};
		}),

	resetProducts: () =>
		set((state) => ({
			salesHookData: [],
			trigger: !state.trigger,
		})),
}));
