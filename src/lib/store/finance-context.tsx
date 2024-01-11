'use client';

import React, {
	createContext,
	ReactNode,
	useState,
	FC,
	useEffect,
} from 'react';

import { db } from '@/lib/firebase';
import {
	collection,
	addDoc,
	getDocs,
	doc,
	deleteDoc,
	updateDoc,
} from 'firebase/firestore';

export type FinanceContextType = {
	income: any[];
	expenses: any[];
	addIncomeItem: (newIncome: any) => Promise<void>;
	removeIncomeItem: (id: string) => Promise<void>;
};

export const FinanceContext = createContext<FinanceContextType | null>(null);

const FinanceContextProvider: FC<ReactNode> = ({ children }) => {
	const [income, setIncome] = useState([]);
	const [expenses, setExpenses] = useState([]);

	const addCategory = async (category: any) => {
		try {
			const collectionRef = collection(db, 'expenses');

			const docSnap = await addDoc(collectionRef, {
				...category,
				items: [],
			});

			setExpenses((prevExpenses) => {
				return [
					...prevExpenses,
					{
						id: docSnap.id,
						items: [],
						...category,
					},
				];
			});
		} catch (error) {
			throw error;
		}
	};

	const addIncomeItem = async (newIncome: any) => {
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
				throw error;
			}
		}
	};

	const removeIncomeItem = async (id: string) => {
		const docRef = doc(db, 'income', id);
		try {
			await deleteDoc(docRef);
			setIncome((prevState) =>
				prevState.filter((expense) => expense.id !== id),
			);
		} catch (error) {
			if (error instanceof Error) {
				console.error('error', error.message);
				throw error;
			}
		}
	};

	const addExpenseItem = async (expenseCategoryId: string, newExpense: any) => {
		const docRef = doc(db, 'expenses', expenseCategoryId);
		try {
			await updateDoc(docRef, { ...newExpense });
			setExpenses((prevState) => {
				const updatedExpenses = [...prevState];
				const foundIndex = updatedExpenses.findIndex((expense) => {
					return expense.id === expenseCategoryId;
				});
				updatedExpenses[foundIndex] = { id: expenseCategoryId, ...newExpense };
				return updatedExpenses;
			});
		} catch (error) {
			throw error;
		}
	};

	const deleteExpenseItem = async (
		updatedExpense: any,
		expenseCategoryId: string,
	) => {
		try {
			const docRef = doc(db, 'expenses', expenseCategoryId);
			await updateDoc(docRef, {
				...updatedExpense,
			});
			setExpenses((prevExpenses) => {
				const updatedExpenses = [...prevExpenses];
				const pos = updatedExpenses.findIndex(
					({ id }) => id === expenseCategoryId,
				);
				updatedExpenses[pos].items = [...updatedExpense.items];
				updatedExpenses[pos].total = updatedExpense.total;
				return updatedExpenses;
			});
		} catch (error) {
			throw error;
		}
	};

	const deleteExpenseCategory = async (expenseCategoryId) => {
		try {
			const docRef = doc(db, 'expenses', expenseCategoryId);
			await deleteDoc(docRef);

			setExpenses((prevExpenses) => {
				const updatedExpenses = prevExpenses.filter(
					(expense) => expense.id !== expenseCategoryId,
				);

				return [...updatedExpenses];
			});
		} catch (error) {
			throw error;
		}
	};

	const values = {
		income,
		expenses,
		addIncomeItem,
		removeIncomeItem,
		addExpenseItem,
		addCategory,
		deleteExpenseItem,
		deleteExpenseCategory,
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

		const getExpenseData = async () => {
			const collectionRef = collection(db, 'expenses');
			const docsSnap = await getDocs(collectionRef);
			const data = docsSnap.docs.map((doc) => {
				return {
					id: doc.id,
					...doc.data(),
				};
			});
			setExpenses(data);
		};

		getExpenseData();
		getIncomeData();
	}, []);

	return (
		<FinanceContext.Provider value={values}>{children}</FinanceContext.Provider>
	);
};

export default FinanceContextProvider;
