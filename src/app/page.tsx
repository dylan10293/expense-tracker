'use client';

import ExpenseCategoryItem from '@/components/ExpenseCategoryItem';
import { currencyFormatter } from '@/lib/utils';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useContext, useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

import IncomeModal from '@/components/modals/IncomeModal';
import ExpenseModal from '@/components/modals/ExpenseModal';
import {
	FinanceContext,
	FinanceContextType,
} from '@/lib/store/finance-context';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
	const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
	const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
	const [balance, setBalance] = useState(0);

	const { income, expenses } = useContext(FinanceContext) as FinanceContextType;

	const closeIncomeModal = () => {
		setShowAddIncomeModal(false);
	};

	const openIncomeModal = () => {
		setShowAddIncomeModal(true);
	};

	const closeExpenseModal = () => {
		setShowAddExpenseModal(false);
	};

	const openExpenseModal = () => {
		setShowAddExpenseModal(true);
	};

	useEffect(() => {
		const newBalance =
			income.reduce((total, { amount }) => total + amount, 0) -
			expenses.reduce((total, i) => total + i.total, 0);
		setBalance(newBalance);
	}, [income, expenses]);

	return (
		<>
			<IncomeModal
				showModal={showAddIncomeModal}
				closeModal={closeIncomeModal}
			/>

			<ExpenseModal
				showModal={showAddExpenseModal}
				closeModal={closeExpenseModal}
			/>

			<main className="container max-w-2xl p-6 mx-auto">
				<section className="py-3">
					<small className="text-gray-400 text-md">My Balance</small>
					<h2 className="text-4xl font-bold">{currencyFormatter(balance)}</h2>
				</section>

				<section className="flex items-center gap-2 py-3">
					<button
						className="btn btn-primary"
						onClick={() => openExpenseModal()}
					>
						+ Expense
					</button>
					<button
						className="btn btn-primary-outline"
						onClick={() => openIncomeModal()}
					>
						+ Income
					</button>
				</section>

				<section className="py-3">
					<h3 className="text-2xl">My Expenses</h3>
					<div className="flex flex-col gap-4 mt-6">
						{expenses.map((expense, index) => (
							<ExpenseCategoryItem key={`expense-${index}`} expense={expense} />
						))}
					</div>
				</section>

				<section className="py-6">
					<h3 className="text-2xl">Statistics</h3>
					<div className="w-1/2 mx-auto">
						<Doughnut
							data={{
								labels: expenses.map(({ title }) => title),
								datasets: [
									{
										label: 'Expenses',
										data: expenses.map(({ total }) => total),
										backgroundColor: expenses.map(({ color }) => color),
										borderColor: ['#18181b'],
										borderWidth: 5,
									},
								],
							}}
						/>
					</div>
				</section>
			</main>
		</>
	);
}
