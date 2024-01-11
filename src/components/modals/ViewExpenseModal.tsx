import React, { useContext } from 'react';
import ModalDialog from '../ModalDialog';
import { FinanceContext } from '@/lib/store/finance-context';
import { currencyFormatter } from '@/lib/utils';
import { FaRegTrashAlt } from 'react-icons/fa';

type Props = {
	showModal: boolean;
	closeModal: () => void;
	expense: any;
};

const ViewExpenseModal = ({ showModal, closeModal, expense }: Props) => {
	const { deleteExpenseItem, deleteExpenseCategory } =
		useContext(FinanceContext);

	const deleteExpenseHandler = async () => {
		try {
			await deleteExpenseCategory(expense.id);
		} catch (error) {
			if (error instanceof Error) {
				console.error('error', error.message);
			}
		}
	};

	const deleteExpenseItemHandler = async (item) => {
		try {
			//  Remove the item from the list
			const updatedItems = expense.items.filter((i) => i.id !== item.id);

			// Update the expense balance
			const updatedExpense = {
				items: [...updatedItems],
				total: expense.total - item.amount,
			};

			await deleteExpenseItem(updatedExpense, expense.id);
		} catch (error) {
			console.log(error.message);
		}
	};
	return (
		<ModalDialog
			heading={`Expense History: ${expense.title}`}
			isOpen={showModal}
			closeModal={closeModal}
		>
			<div className="pt-2">
				{expense.items.map((item) => {
					return (
						<div
							key={item.id}
							className="flex items-center justify-between mt-1 bg-slate-800 px-2 py-3 rounded"
						>
							<small>
								{item.createdAt.toMillis
									? new Date(item.createdAt.toMillis()).toISOString()
									: item.createdAt.toISOString()}
							</small>
							<p className="flex items-center gap-2">
								{currencyFormatter(item.amount)}
								<button
									onClick={() => {
										deleteExpenseItemHandler(item);
									}}
								>
									<FaRegTrashAlt />
								</button>
							</p>
						</div>
					);
				})}
			</div>
			<div className="mt-4 flex flex-row-reverse gap-2">
				<button onClick={deleteExpenseHandler} className="btn btn-danger">
					Delete
				</button>
				<button type="button" className="btn" onClick={closeModal}>
					Cancel
				</button>
			</div>
		</ModalDialog>
	);
};

export default ViewExpenseModal;
