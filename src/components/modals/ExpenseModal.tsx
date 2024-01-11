import { currencyFormatter } from '@/lib/utils';
import ModalDialog from '../ModalDialog';
import { v4 as uuidv4 } from 'uuid';

import {
	FinanceContext,
	FinanceContextType,
} from '@/lib/store/finance-context';
import { useContext, useRef, useState } from 'react';

type Props = {
	showModal: boolean;
	closeModal: () => void;
};

const ExpenseModal = ({ showModal, closeModal }: Props) => {
	const [expenseAmount, setExpenseAmount] = useState('');
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [showAddExpense, setShowAddExpense] = useState(false);

	const titleRef = useRef();
	const colorRef = useRef();

	const { addExpenseItem, expenses, addCategory } = useContext(
		FinanceContext,
	) as FinanceContextType;

	const addExpenseHandler = async () => {
		const { color, title, total, items } = expenses.find(
			(e) => e.id === selectedCategory,
		);
		const newExpense = {
			color,
			title,
			total: total + +expenseAmount,
			items: [
				...items,
				{
					amount: +expenseAmount,
					createdAt: new Date(),
					id: uuidv4(),
				},
			],
		};

		try {
			await addExpenseItem(selectedCategory, newExpense);
		} catch (error) {
			if (error instanceof Error) {
				console.error('error', error.message);
			}
		}

		closeModal();
		setExpenseAmount('');
		setSelectedCategory(null);
	};

	const addCategoryHandler = async () => {
		const title = titleRef.current.value;
		const color = colorRef.current.value;

		try {
			await addCategory({ title, color, total: 0 });
			setShowAddExpense(false);
		} catch (error) {
			if (error instanceof Error) {
				console.error('error', error.message);
			}
		}
	};

	return (
		<ModalDialog
			heading="Add Expense"
			isOpen={showModal}
			closeModal={closeModal}
		>
			<div className="grid grid-cols-1 gap-x-8 gap-y-2">
				<div>
					<label
						htmlFor="amount"
						className="block text-sm font-semibold leading-6 text-gray-200"
					>
						Expense Amount
					</label>
					<div className="mt-1">
						<input
							type="number"
							name="amount"
							id="amount"
							// ref={amountRef}
							value={expenseAmount}
							onChange={(e) => setExpenseAmount(e.target.value)}
							min={0.01}
							step={0.01}
							required
							placeholder="Enter expense amount"
							className="block w-full rounded border-0 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
						/>
					</div>
				</div>
				<div className="flex flex-col gap-4 mt-4">
					{+expenseAmount > 0 && (
						<>
							{showAddExpense && (
								<div className="bg-slate-800 px-3 py-2 rounded">
									<div className="flex flex-row gap-2 ">
										<div className="basis-3/4">
											<label className="block text-sm font-semibold leading-6 text-gray-200">
												Enter Category Name
											</label>
											<input
												className="w-full"
												type="text"
												placeholder="Enter Title"
												ref={titleRef}
											/>
										</div>

										<div className="basis-1/4">
											<label className="block text-sm font-semibold leading-6 text-gray-200">
												Pick Color
											</label>
											<input
												type="color"
												className="w-full h-10"
												ref={colorRef}
											/>
										</div>
									</div>
									<div className="mt-3 flex flex-row-reverse gap-2">
										<button
											onClick={addCategoryHandler}
											className="btn btn-primary-outline"
										>
											Create
										</button>
										<button
											onClick={() => {
												setShowAddExpense(false);
											}}
											className="btn"
										>
											Cancel
										</button>
									</div>
								</div>
							)}
							<div className="flex items-center justify-between">
								<label className="block text-sm font-semibold leading-6 text-gray-200 capitalize">
									Select Expense Category
								</label>
								{!showAddExpense && (
									<button
										onClick={() => setShowAddExpense(true)}
										className="text-sm text-lime-400"
									>
										+ New Category
									</button>
								)}
							</div>
						</>
					)}
					{+expenseAmount > 0 &&
						expenses.map(({ id, color, title }) => (
							<>
								<button
									key={id}
									onClick={() => {
										setSelectedCategory(id);
									}}
								>
									<div
										style={{
											boxShadow:
												id === selectedCategory ? '1px 1px 4px' : 'none',
										}}
										className="flex items-center justify-between px-3 py-3 bg-slate-500 rounded"
									>
										<div className="flex items-center gap-2">
											<div
												className="w-[20px] h-[20px] rounded-full "
												style={{ backgroundColor: color }}
											/>
											<h4 className="capitalize">{title}</h4>
										</div>
									</div>
								</button>
							</>
						))}
				</div>
			</div>
			<div className="mt-4 flex flex-row-reverse gap-2">
				{expenseAmount > 0 && selectedCategory && (
					<button
						onClick={() => addExpenseHandler()}
						className="btn btn-primary"
					>
						Submit
					</button>
				)}
				<button type="button" className="btn" onClick={closeModal}>
					Cancel
				</button>
			</div>
		</ModalDialog>
	);
};

export default ExpenseModal;
