import {PaginationResponse, request} from '@/api/axios';
import {useState, useEffect} from 'react';
import {InventoryRecordTable} from './item-record-table';
import {ItemRecords} from '../../../../_components/validation/item-record';
import {columns} from './columns';

interface InventoryRecordProps {
	searchParams: URLSearchParams;
	product_id: string;
}

export default function ItemRecordList({
	searchParams,
	product_id,
}: InventoryRecordProps) {
	const [pageCount, setPageCount] = useState<number>(0);
	const [inventoryRecord, setInventoryRecord] = useState<ItemRecords[]>([]);

	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;

	const category_id = Number(searchParams.get('category_id')) || undefined;
	const product_name = searchParams.get('product_name') || undefined;
	useEffect(() => {
		const fetchProducts = async () => {
			const inventoryResponse = await request<PaginationResponse<ItemRecords>>(
				'GET',
				`/api/v1/ims/product/${product_id}/productRecords?limit=${pageLimit}&offset=${offset}` +
					(sort ? `&sort=${sort}` : '') +
					(category_id ? `&category_id=${category_id}` : '') +
					(product_name ? `&product_name=${product_name}` : ''),
			);
			setInventoryRecord(inventoryResponse.data);
			setPageCount(Math.ceil(inventoryResponse.total_data / pageLimit));
		};
		fetchProducts();
	}, [offset, pageLimit, sort, category_id, product_name]);
	return (
		<InventoryRecordTable
			searchKey={''}
			columns={columns}
			data={inventoryRecord}
			pageCount={pageCount}
		/>
	);
}
