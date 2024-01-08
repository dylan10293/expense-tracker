import { currencyFormatter } from '@/lib/utils';
import React from 'react';

type Props = {
	title: string;
	total: number;
	color?: string;
};

// const titleColor = {
// 	Entertainment: '#FF0',
// 	Gaming: '#F0F',
// };

const ExpenseCategoryItem = ({ title, total, color }: Props) => {
	return (
		<button>
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
	);
};

export default ExpenseCategoryItem;
