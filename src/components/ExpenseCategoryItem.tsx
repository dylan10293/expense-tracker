import { currencyFormatter } from '@/lib/utils';
import React, { useState } from 'react';
import ViewExpenseModal from './modals/ViewExpenseModal';

type Props = {
	// title: string;
	// total: number;
	// color?: string;
	expense: any;
};

// const titleColor = {
// 	Entertainment: '#FF0',
// 	Gaming: '#F0F',
// };

const ExpenseCategoryItem = ({ expense }: Props) => {
	const [showViewExpenseModal, setViewExpenseModal] = useState(false);
	const { title, total, color } = expense;
	return (
		<>
			<ViewExpenseModal
				showModal={showViewExpenseModal}
				closeModal={() => setViewExpenseModal(false)}
				expense={expense}
			/>
			<button
				onClick={() => {
					setViewExpenseModal(true);
				}}
			>
				<div className="flex items-center justify-between px-4 py-4 bg-slate-700 rounded">
					<div className="flex item-center gap-2">
						<div
							className="w-[25px] h-[25px] rounded-full bg-yellow-500"
							style={{ background: color }}
						/>
						<h4 className="capitalize">{title}</h4>
					</div>
					<p>{currencyFormatter(total)}</p>
				</div>
			</button>
		</>
	);
};

export default ExpenseCategoryItem;
