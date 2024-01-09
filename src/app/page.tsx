'use client';

import ExpenseCategoryItem from '@/components/ExpenseCategoryItem';
import ModalDialog from '@/components/ModalDialog';
import { currencyFormatter } from '@/lib/utils';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const SAMPLE_DATA = [
	{
		title: 'Entertainment',
		total: 1000,
		color: '#FF0',
	},
	{
		title: 'Gaming',
		total: 1900,
		color: '#F0F',
	},
];

export default function Home() {
	const [isOpen, setIsOpen] = useState(false);
	const closeModal = () => {
		setIsOpen(false);
	};

	const openModal = () => {
		setIsOpen(true);
	};
	return (
		<>
			<ModalDialog
				heading="Add Expense"
				isOpen={isOpen}
				closeModal={closeModal}
			>
				<form action="#" method="POST" className="mx-auto max-w-xl">
					<div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
						<div>
							<label
								htmlFor="first-name"
								className="block text-sm font-semibold leading-6 text-gray-400"
							>
								Expense Amount
							</label>
							<div className="mt-1">
								<input
									type="text"
									name="description"
									id="description"
									className="block w-full rounded border-0 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
								/>
							</div>
						</div>
						<div>
							<label
								htmlFor="first-name"
								className="block text-sm font-semibold leading-6 text-gray-400"
							>
								Description
							</label>
							<div className="mt-1">
								<input
									type="text"
									name="description"
									id="description"
									className="block w-full rounded border-0 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
								/>
							</div>
						</div>
					</div>
				</form>
			</ModalDialog>
			<main className="container max-w-2xl p-6 mx-auto">
				<section className="py-3">
					<small className="text-gray-400 text-md">My Balance</small>
					<h2 className="text-4xl font-bold">{currencyFormatter(10000000)}</h2>
				</section>

				<section className="flex items-center gap-2 py-3">
					<button className="btn btn-primary" onClick={() => openModal()}>
						+ Expense
					</button>
					<button className="btn btn-primary-outline">+ Income</button>
				</section>

				<section className="py-3">
					<h3 className="text-2xl">My Expenses</h3>
					<div className="flex flex-col gap-4 mt-6">
						{SAMPLE_DATA.map(({ title, color, total }, index) => (
							<ExpenseCategoryItem
								key={`expense-${index}`}
								title={title}
								total={total}
								color={color}
							/>
						))}
					</div>
				</section>

				<section className="py-6">
					<h3 className="text-2xl">Statistics</h3>
					<div className="w-1/2 mx-auto">
						<Doughnut
							data={{
								labels: SAMPLE_DATA.map(({ title }) => title),
								datasets: [
									{
										label: 'Expenses',
										data: SAMPLE_DATA.map(({ total }) => total),
										backgroundColor: SAMPLE_DATA.map(({ color }) => color),
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
