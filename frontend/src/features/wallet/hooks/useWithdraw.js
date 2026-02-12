import { useCallback, useState } from 'react';
import { walletApi } from '../api/walletApi';

export const useWithdraw = ({ userId, onSuccess } = {}) => {
	const [processing, setProcessing] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(null);

	const withdraw = useCallback(async (amount, balance) => {
		if (!userId) {
			setError('Missing user');
			return false;
		}

		if (!amount || amount <= 0) {
			setError('Amount must be greater than zero');
			return false;
		}

		if (typeof balance === 'number' && amount > balance) {
			setError('Insufficient funds');
			return false;
		}

		try {
			setProcessing(true);
			setError(null);
			await walletApi.withdrawBalance(userId, amount);
			setSuccess(true);
			if (onSuccess) {
				await onSuccess();
			}
			return true;
		} catch (err) {
			setError(err?.message || 'Withdrawal failed');
			return false;
		} finally {
			setProcessing(false);
		}
	}, [userId, onSuccess]);

	const reset = useCallback(() => {
		setSuccess(false);
		setError(null);
	}, []);

	return { withdraw, processing, success, error, reset };
};
