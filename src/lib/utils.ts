export const currencyFormatter = (amount: number | bigint) => {
	const formatter = Intl.NumberFormat('en-US', {
		currency: 'USD',
		style: 'currency',
	});
	return formatter.format(amount);
};
