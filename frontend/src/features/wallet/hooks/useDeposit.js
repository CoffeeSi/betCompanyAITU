import { useCallback, useState } from 'react';
import { walletApi } from '../api/walletApi';

export const useDeposit = ({ userId, onSuccess } = {}) => {
	const [processing, setProcessing] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(null);

	const deposit = useCallback(async (amount) => {
		if (!userId) {
			setError('Missing user');
			return false;
		}

		if (!amount || amount <= 0) {
			setError('Amount must be greater than zero');
			return false;
		}

		try {
			setProcessing(true);
			setError(null);
			await walletApi.depositBalance(userId, amount);
			setSuccess(true);
			if (onSuccess) {
				await onSuccess();
			}
			return true;
		} catch (err) {
			setError(err?.message || 'Deposit failed');
			return false;
		} finally {
			setProcessing(false);
		}
	}, [userId, onSuccess]);

	const reset = useCallback(() => {
		setSuccess(false);
		setError(null);
	}, []);

	return { deposit, processing, success, error, reset };
};
