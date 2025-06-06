import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from '@tanstack/react-table'; // Adjust the import path based on your project setup
import {ScrollArea, ScrollBar} from '@/components/ui/scroll-area';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import {useMemo, useState} from 'react';
import {Input} from '@/components/ui/input';
import {EmployeeWithRelatedDetails} from '@/modules/ems/_components/validation/employee';
import useEmployeeStore from '../use-employee-list-hook';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	selectedRowIds?: Record<string, boolean>;
	onRowSelectionChange?: (selected: Record<string, boolean>) => void;
	onSubmit: () => void;
}

export function SerialiItemTable<
	TData extends EmployeeWithRelatedDetails,
	TValue,
>({
	columns,
	data,
	onRowSelectionChange,
	selectedRowIds,
	onSubmit,
}: DataTableProps<TData, TValue>) {
	const [filterValue, setFilterValue] = useState('');

	const filteredData = useMemo(() => {
		return filterValue
			? data.filter((item) => {
					const fullName = `${item.employee.firstname} ${item.employee.middlename ? item.employee.middlename + ' ' : ''}${item.employee.lastname}`;
					return fullName.toLowerCase().includes(filterValue.toLowerCase());
				})
			: data;
	}, [data, filterValue]);

	const table = useReactTable({
		data: filteredData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		enableRowSelection: true,
		onRowSelectionChange: onRowSelectionChange
			? (updaterOrValue) => {
					let newSelection: Record<string, boolean>;

					if (typeof updaterOrValue === 'function') {
						newSelection = updaterOrValue(table.getState().rowSelection);
					} else {
						newSelection = updaterOrValue;
					}
					onRowSelectionChange(newSelection);
				}
			: undefined,
		state: {
			rowSelection: selectedRowIds ?? {},
		},
	});
	const {setSelectedEmployees} = useEmployeeStore();
	const handleSubmit = () => {
		const selectedItems = table
			.getSelectedRowModel()
			.rows.map((row) => row.original);
		setSelectedEmployees(selectedItems);
		onSubmit();
	};
	return (
		<div className="flex flex-col gap-5">
			<div className="flex items-center justify-between">
				<p className="text-sm font-medium">Filter by Serial Code</p>
				<Input
					placeholder="Search serial code..."
					value={filterValue}
					onChange={(e) => setFilterValue(e.target.value)}
					className="max-w-sm"
				/>
			</div>
			<ScrollArea className="h-[calc(81vh-220px)] rounded-md border">
				<Table className="relative">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									// onClick={() => handleRowClick(row)}
									style={{cursor: 'pointer'}}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
			<Button onClick={handleSubmit}>Submit</Button>
		</div>
	);
}
