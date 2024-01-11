import { currencyFormatter } from '@/lib/utils';
import React, { Reference, useContext, useRef } from 'react';
import ModalDialog from '../ModalDialog';
import { FaTrashAlt } from 'react-icons/fa';

import {
	FinanceContext,
	FinanceContextType,
} from '@/lib/store/finance-context';

type Props = {
	showModal: boolean;
	closeModal: () => void;
};

const ExpenseModal = ({ showModal, closeModal }: Props) => {
	const amountRef = useRef<HTMLInputElement>(null);
	const descriptionRef = useRef<HTMLInputElement>(null);

	const { addIncomeItem, removeIncomeItem, income } = useContext(
		FinanceContext,
	) as FinanceContextType;

	const addIncomeHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const newIncome = {
			amount: amountRef?.current?.value ? +amountRef?.current?.value : 0,
			description: descriptionRef?.current?.value,
			createdAt: new Date(),
		};

		try {
			await addIncomeItem(newIncome);
			if (descriptionRef.current) descriptionRef.current.value = '';
			if (amountRef.current) amountRef.current.value = '';
		} catch (error) {
			if (error instanceof Error) {
				console.error('error', error.message);
			}
		}
	};

	const deleteIncomeHandler = async (
		e: React.FormEvent<HTMLFormElement>,
		id: string,
	) => {
		e.preventDefault();
		try {
			await removeIncomeItem(id);
		} catch (error) {
			if (error instanceof Error) {
				console.error('error', error.message);
			}
		}
	};

	return (
		<ModalDialog
			heading="Add Income"
			isOpen={showModal}
			closeModal={closeModal}
		>
			<form onSubmit={addIncomeHandler} className="mx-auto max-w-xl">
				<div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
					<div>
						<label
							htmlFor="amount"
							className="block text-sm font-semibold leading-6 text-gray-200"
						>
							Income Amount
						</label>
						<div className="mt-1">
							<input
								type="number"
								name="amount"
								id="amount"
								ref={amountRef}
								min={0.01}
								step={0.01}
								required
								placeholder="Enter income amount"
								className="block w-full rounded border-0 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
							/>
						</div>
					</div>
					<div>
						<label
							htmlFor="description"
							className="block text-sm font-semibold leading-6 text-gray-200"
						>
							Description
						</label>
						<div className="mt-1">
							<input
								type="text"
								name="description"
								id="description"
								ref={descriptionRef}
								required
								placeholder="Enter description"
								className="block w-full rounded border-0 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
							/>
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-2 mt-6">
					<h3 className="text-md font-medium text-gray-300">Income History</h3>
					{income.map(({ id, description, createdAt, amount }) => (
						<div key={id} className="flex justify-between items-center">
							<div>
								<p className="block text-sm font-semibold text-gray-200">
									{description}
								</p>
								<small className="text-xs text-gray-400">
									{createdAt.toISOString()}
								</small>
							</div>
							<p className="flex text-sm items-center gap-2">
								{currencyFormatter(amount)}
								<button onClick={(e) => deleteIncomeHandler(e, id)}>
									<FaTrashAlt />
								</button>
							</p>
						</div>
					))}
				</div>
				<div className="mt-4 flex flex-row-reverse gap-2">
					<button type="submit" className="btn btn-primary">
						Submit
					</button>
					<button type="button" className="btn" onClick={closeModal}>
						Cancel
					</button>
				</div>
			</form>
		</ModalDialog>
	);
};

export default ExpenseModal;
