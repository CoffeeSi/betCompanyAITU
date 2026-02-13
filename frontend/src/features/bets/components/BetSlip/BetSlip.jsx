import { useState, useMemo } from 'react';
import { Card, Text, Group, Stack, Badge, Button, NumberInput, Alert, ActionIcon, Modal, SegmentedControl, Tooltip } from '@mantine/core';
import { IconReceipt, IconX, IconChevronDown, IconChevronUp, IconTrash, IconCheck, IconAlertCircle, IconInfoCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useBetSlip } from '../../store/betSlipStore';
import { usePlaceBet } from '../../hooks/usePlaceBet';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toTenge } from '@/shared/utils/currencyFormat';
import styles from './BetSlip.module.css';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];

export function BetSlip() {
    const { selections, isOpen, setIsOpen, removeSelection, clearSelections, totalOdds, count, toggleOpen, hasMultipleFromSameEvent } = useBetSlip();
    const { placeBet, loading, error, success, reset } = usePlaceBet();
    const { isLoggedIn } = useAuth();
    const [amount, setAmount] = useState(500);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [betMode, setBetMode] = useState('single');

    const effectiveBetMode = count <= 1 ? 'single' : betMode === 'single' && count > 1 ? 'single' : betMode;

    const potentialWin = useMemo(() => {
        if (effectiveBetMode === 'express') return amount * totalOdds;
        if (effectiveBetMode === 'single' && count > 1) {
            const perBet = amount / count;
            return selections.reduce((max, s) => Math.max(max, perBet * s.odds), 0) * count;
        }
        return amount * (selections[0]?.odds || 1);
    }, [effectiveBetMode, amount, totalOdds, selections, count]);

    const handlePlaceBet = async () => {
        setConfirmOpen(false);

        if (effectiveBetMode === 'single' && count > 1) {
            let allSuccess = true;
            const perBet = amount / count;
            for (const sel of selections) {
                const placed = await placeBet({ amount: perBet, outcomeIds: [sel.outcomeId], type: 'single' });
                if (!placed) allSuccess = false;
            }
            if (allSuccess) {
                notifications.show({
                    title: `${count} Single Bets Placed!`,
                    message: `${toTenge(amount)} total stake across ${count} bets`,
                    color: 'green',
                    icon: <IconCheck size={18} />,
                    autoClose: 4000,
                });
                clearSelections();
                setAmount(500);
                setTimeout(() => reset(), 3000);
            }
        } else {
            const outcomeIds = selections.map(s => s.outcomeId);
            const placed = await placeBet({ amount, outcomeIds, type: effectiveBetMode });
            if (placed) {
                notifications.show({
                    title: 'Bet Placed Successfully!',
                    message: effectiveBetMode === 'express'
                        ? `Express: ${toTenge(amount)} × ${totalOdds.toFixed(2)} = ${toTenge(amount * totalOdds)}`
                        : `${toTenge(amount)} placed with odds ${totalOdds.toFixed(2)}`,
                    color: 'green',
                    icon: <IconCheck size={18} />,
                    autoClose: 4000,
                });
                clearSelections();
                setAmount(500);
                setTimeout(() => reset(), 3000);
            } else {
                notifications.show({
                    title: 'Bet Failed',
                    message: error || 'Something went wrong',
                    color: 'red',
                    icon: <IconAlertCircle size={18} />,
                    autoClose: 4000,
                });
            }
        }
    };

    const betModeOptions = useMemo(() => {
        const opts = [{ label: 'Single', value: 'single' }];
        if (count >= 2) opts.push({ label: 'Express', value: 'express' });
        return opts;
    }, [count]);

    if (!isOpen && count > 0) {
        return (
            <div className={styles.floatingBtn} onClick={toggleOpen}>
                <IconReceipt size={24} />
                <div className={styles.floatingBadge}>{count}</div>
            </div>
        );
    }

    if (!isOpen || count === 0) return null;

    return (
        <>
            {/* Confirmation Modal */}
            <Modal
                opened={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title={<Text fw={700} size="lg">Confirm Your Bet</Text>}
                centered
                size="sm"
                styles={{
                    content: { backgroundColor: '#1f2532', border: '1px solid #3d4556' },
                    header: { backgroundColor: '#1f2532', borderBottom: '1px solid #3d4556', color: '#fff' },
                    title: { color: '#fff' },
                    close: { color: '#8b92a8' },
                }}
            >
                <Stack gap="md">
                    {/* Bet Type Badge */}
                    <Group justify="center">
                        <Badge size="lg" color={effectiveBetMode === 'express' ? 'orange' : 'blue'} variant="filled">
                            {effectiveBetMode === 'express' ? `Express (${count} events)` : count > 1 ? `${count} Singles` : 'Single'}
                        </Badge>
                    </Group>

                    <Stack gap="xs">
                        {selections.map((sel) => (
                            <Group key={sel.outcomeId} justify="space-between" className={styles.confirmItem}>
                                <Stack gap={2}>
                                    <Text size="xs" c="dimmed">{sel.eventName}</Text>
                                    <Text size="sm" c="white" fw={500}>{sel.teamName || sel.marketType}</Text>
                                </Stack>
                                <Badge color="blue" variant="light">{sel.odds.toFixed(2)}</Badge>
                            </Group>
                        ))}
                    </Stack>

                    <div className={styles.confirmDivider} />

                    <Group justify="space-between">
                        <Text size="sm" c="dimmed">Stake</Text>
                        <Text size="sm" c="white" fw={600}>{toTenge(amount)}</Text>
                    </Group>

                    {effectiveBetMode === 'express' && (
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">Total Odds (Express)</Text>
                            <Text size="sm" c="#f39c12" fw={600}>{totalOdds.toFixed(2)}</Text>
                        </Group>
                    )}

                    {effectiveBetMode === 'single' && count > 1 && (
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">Per bet</Text>
                            <Text size="sm" c="white" fw={600}>{toTenge(amount / count)}</Text>
                        </Group>
                    )}

                    <Group justify="space-between">
                        <Text size="sm" c="dimmed">Max Potential Win</Text>
                        <Text size="md" c="#27ae60" fw={700}>{toTenge(potentialWin)}</Text>
                    </Group>

                    <Group grow gap="sm" mt="md">
                        <Button variant="outline" color="gray" onClick={() => setConfirmOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            className={styles.placeBetBtn}
                            onClick={handlePlaceBet}
                            loading={loading}
                        >
                            Confirm Bet
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            {/* Bet Slip Panel */}
            <div className={styles.betSlipOverlay}>
                <Card className={styles.betSlipCard} p={0}>
                    {/* Header */}
                    <Group className={styles.betSlipHeader} justify="space-between" onClick={toggleOpen}>
                        <Group gap="xs">
                            <IconReceipt size={18} color="#4a9eff" />
                            <Text fw={600} size="sm" className={styles.betSlipHeaderText}>
                                Bet Slip
                            </Text>
                            <Badge size="sm" className={styles.betSlipBadge} circle>
                                {count}
                            </Badge>
                        </Group>
                        {isOpen ? <IconChevronDown size={18} color="#8b92a8" /> : <IconChevronUp size={18} color="#8b92a8" />}
                    </Group>

                    {/* Body */}
                    <div className={styles.betSlipBody}>
                        {success && (
                            <Alert className={styles.successAlert} mb="sm" withCloseButton onClose={reset}>
                                Bet placed successfully!
                            </Alert>
                        )}
                        {error && (
                            <Alert color="red" mb="sm" withCloseButton onClose={reset}>
                                {error}
                            </Alert>
                        )}

                        {/* Warning for express with same event outcomes */}
                        {effectiveBetMode === 'express' && hasMultipleFromSameEvent() && (
                            <Alert
                                icon={<IconAlertCircle size={16} />}
                                color="orange"
                                mb="sm"
                                styles={{
                                    root: { backgroundColor: 'rgba(255, 171, 0, 0.1)', border: '1px solid rgba(255, 171, 0, 0.3)' },
                                    message: { color: '#ffab00', fontSize: '12px' },
                                }}
                            >
                                Express bets require outcomes from different events. Please remove duplicate event selections.
                            </Alert>
                        )}

                        <Stack gap="xs">
                            {selections.map((sel) => (
                                <div key={sel.outcomeId} className={styles.selectionCard}>
                                    <Group justify="space-between" align="flex-start">
                                        <Stack gap={2} style={{ flex: 1 }}>
                                            <Text size="xs" className={styles.selectionEvent}>
                                                {sel.eventName}
                                            </Text>
                                            <Text size="sm" fw={600} className={styles.selectionTeam}>
                                                {sel.teamName || sel.marketType}
                                            </Text>
                                        </Stack>
                                        <Group gap="xs">
                                            <Badge color="blue" variant="light" className={styles.selectionOdds}>
                                                {sel.odds.toFixed(2)}
                                            </Badge>
                                            <ActionIcon
                                                variant="subtle"
                                                size="sm"
                                                className={styles.removeBtn}
                                                onClick={() => removeSelection(sel.outcomeId)}
                                            >
                                                <IconX size={14} />
                                            </ActionIcon>
                                        </Group>
                                    </Group>
                                </div>
                            ))}
                        </Stack>
                    </div>

                    {/* Footer */}
                    <div className={styles.betSlipFooter}>
                        <Stack gap="sm">
                            {/* Bet Type Selector */}
                            {count >= 2 && (
                                <SegmentedControl
                                    value={effectiveBetMode}
                                    onChange={setBetMode}
                                    data={betModeOptions}
                                    size="xs"
                                    fullWidth
                                    className={styles.betTypeSelector}
                                    styles={{
                                        root: { backgroundColor: '#1a1f2d', border: '1px solid #3d4556' },
                                        label: { color: '#8b92a8', fontSize: '12px', fontWeight: 600 },
                                        indicator: { background: 'linear-gradient(135deg, #4a9eff, #2980b9)' },
                                    }}
                                />
                            )}

                            {/* Express info */}
                            {effectiveBetMode === 'express' && count > 1 && (
                                <Group justify="space-between" className={styles.betTypeInfo}>
                                    <Group gap={4}>
                                        <Badge size="xs" color="orange" variant="filled">EXPRESS</Badge>
                                        <Text size="xs" c="dimmed">{count} events</Text>
                                    </Group>
                                    <Text size="sm" className={styles.expressOdds} fw={700}>
                                        {totalOdds.toFixed(2)}
                                    </Text>
                                </Group>
                            )}

                            {/* Singles info */}
                            {effectiveBetMode === 'single' && count > 1 && (
                                <Group justify="space-between" className={styles.betTypeInfo}>
                                    <Group gap={4}>
                                        <Badge size="xs" color="blue" variant="filled">SINGLES</Badge>
                                        <Text size="xs" c="dimmed">{count} bets × {toTenge(amount / count)}</Text>
                                    </Group>
                                </Group>
                            )}

                            {/* Quick Amount Presets */}
                            <Group gap={4} justify="center" className={styles.quickAmounts}>
                                {QUICK_AMOUNTS.map(preset => (
                                    <Button
                                        key={preset}
                                        size="compact-xs"
                                        variant={amount === preset ? 'filled' : 'light'}
                                        color={amount === preset ? 'blue' : 'gray'}
                                        className={styles.quickAmountBtn}
                                        onClick={() => setAmount(preset)}
                                    >
                                        {preset >= 1000 ? `${preset / 1000}K` : preset}
                                    </Button>
                                ))}
                            </Group>

                            <NumberInput
                                placeholder="Bet amount"
                                value={amount}
                                onChange={setAmount}
                                min={1}
                                step={100}
                                suffix=" ₸"
                                className={styles.amountInput}
                                size="sm"
                            />

                            <Group justify="space-between">
                                <Text size="xs" className={styles.totalRow}>Potential win:</Text>
                                <Text size="sm" className={styles.potentialWin}>
                                    {toTenge(potentialWin)}
                                </Text>
                            </Group>

                            <Group grow gap="xs">
                                <Button
                                    variant="outline"
                                    size="xs"
                                    className={styles.clearBtn}
                                    leftSection={<IconTrash size={14} />}
                                    onClick={clearSelections}
                                >
                                    Clear
                                </Button>
                                <Button
                                    size="sm"
                                    className={styles.placeBetBtn}
                                    onClick={() => {
                                        if (!isLoggedIn) {
                                            notifications.show({
                                                title: 'Login Required',
                                                message: 'Please log in to place bets',
                                                color: 'orange',
                                                autoClose: 3000,
                                            });
                                            return;
                                        }
                                        setConfirmOpen(true);
                                    }}
                                    loading={loading}
                                    disabled={
                                        !amount || 
                                        amount <= 0 || 
                                        (effectiveBetMode === 'express' && hasMultipleFromSameEvent())
                                    }
                                >
                                    {!isLoggedIn ? 'Login to bet' :
                                     effectiveBetMode === 'express' ? `Place Express (×${totalOdds.toFixed(2)})` :
                                     count > 1 ? `Place ${count} Singles` :
                                     'Place Bet'}
                                </Button>
                            </Group>
                        </Stack>
                    </div>
                </Card>
            </div>
        </>
    );
}
