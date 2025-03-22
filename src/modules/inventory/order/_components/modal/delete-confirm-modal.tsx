import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {toast} from 'sonner';
import axios from 'axios';
import {request} from '@/api/axios';
import {useState} from 'react';
import useTrackReferesh from '../../../_components/hooks/uset-track-refresh';
import {OrderTrackItem} from '@/components/validation/inventory/order-tracking';

interface OrderTrackingProps {
	data: OrderTrackItem;
}
export function DeleteConfirmModal({data}: OrderTrackingProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const {track, setTrack} = useTrackReferesh();

	const handleModal = () => {
		setIsModalOpen(!isModalOpen);
	};
	const handleClick = async () => {
		try {
			if (data.product) {
				await request(
					'DELETE',
					`api/v1/ims/order/${data.order?.order_id}/order-items/${data.orderItem_id}/tracking/${data.tracking_id}`,
				);
				toast.success('Tracking Data deleted');
				handleModal();
				setTrack(track + 1);
			} else {
				toast.error('Product data is missing');
			}
		} catch (error) {
			console.log(error);
			let errorMessage = 'An unexpected error occurred';
			if (axios.isAxiosError(error)) {
				errorMessage =
					error.response?.data?.message || // Use the `message` field if available
					error.response?.data?.errors?.[0]?.message || // If `errors` array exists, use the first error's message
					'Failed to process request';
			}

			toast.error(errorMessage);
		}
	};
	return (
		<Dialog open={isModalOpen} onOpenChange={handleModal}>
			<DialogTrigger className="w-full">
				<Button variant={'destructive'} className="w-full">
					Delete
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Delete Item</DialogTitle>
					<DialogDescription>
						Mark sure you double check all items are all added to inventory.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button onClick={() => handleModal()}>Cancel</Button>
					<Button variant="destructive" onClick={() => handleClick()}>
						Confirm
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
