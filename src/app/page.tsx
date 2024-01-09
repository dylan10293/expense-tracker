'use client';

import ExpenseCategoryItem from '@/components/ExpenseCategoryItem';
import ModalDialog from '@/components/ModalDialog';
import { currencyFormatter } from '@/lib/utils';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useRef, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { FaTrashAlt } from 'react-icons/fa';

import { db } from '@/lib/firebase';
import {
	collection,
	addDoc,
	getDocs,
	doc,
	deleteDoc,
} from 'firebase/firestore';

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
	const [income, setIncome] = useState<any[]>([]);
	const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
	const amountRef = useRef<HTMLInputElement>(null);
	const descriptionRef = useRef<HTMLInputElement>(null);

	const closeExpenseModal = () => {
		setShowAddIncomeModal(false);
	};

	const openExpenseModal = () => {
		setShowAddIncomeModal(true);
	};

	const addIncomeHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const newIncome = {
			amount: amountRef?.current?.value,
			description: descriptionRef?.current?.value,
			createdAt: new Date(),
		};

		const collectionRef = collection(db, 'income');
		try {
			const docSnap = await addDoc(collectionRef, newIncome);
			setIncome((prevState) => [
				{
					id: docSnap.id,
					...newIncome,
				},
				...prevState,
			]);

			if (descriptionRef.current) descriptionRef.current.value = '';
			if (amountRef.current) amountRef.current.value = '';
		} catch (error) {
			if (error instanceof Error) {
				console.error('error', error.message);
			}
		}
	};

	const deleteIncomeHandler = async (id: string) => {
		const docRef = doc(db, 'income', id);
		try {
			await deleteDoc(docRef);
			setIncome((prevState) =>
				prevState.filter((expense) => expense.id !== id),
			);
		} catch (error) {
			if (error instanceof Error) {
				console.error('error', error.message);
			}
		}
	};

	useEffect(() => {
		const getIncomeData = async () => {
			const collectionRef = collection(db, 'income');
			const docsSnap = await getDocs(collectionRef);
			const data = docsSnap.docs.map((doc) => {
				return {
					id: doc.id,
					...doc.data(),
					createdAt: new Date(doc.data().createdAt.toMillis()),
				};
			});
			setIncome(data);
		};

		getIncomeData();
	}, []);

	return (
		<>
			<ModalDialog
				heading="Add Income"
				isOpen={showAddIncomeModal}
				closeModal={closeExpenseModal}
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
						<h3 className="text-md font-medium text-gray-300">
							Income History
						</h3>
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
									<button onClick={() => deleteIncomeHandler(id)}>
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
						<button
							type="button"
							className="btn btn-danger"
							onClick={closeExpenseModal}
						>
							Cancel
						</button>
					</div>
				</form>
			</ModalDialog>
			<main className="container max-w-2xl p-6 mx-auto">
				<section className="py-3">
					<small className="text-gray-400 text-md">My Balance</small>
					<h2 className="text-4xl font-bold">{currencyFormatter(10000000)}</h2>
				</section>

				<section className="flex items-center gap-2 py-3">
					<button className="btn btn-primary">+ Expense</button>
					<button
						className="btn btn-primary-outline"
						onClick={() => openExpenseModal()}
					>
						+ Income
					</button>
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
