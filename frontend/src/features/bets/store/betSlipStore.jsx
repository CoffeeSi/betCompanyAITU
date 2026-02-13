import { createContext, useContext, useState, useCallback } from 'react';

const BetSlipContext = createContext(null);

export function BetSlipProvider({ children }) {
    const [selections, setSelections] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const addSelection = useCallback((selection) => {
        setSelections(prev => {
            if (prev.some(s => s.outcomeId === selection.outcomeId)) {
                return prev;
            }
            const filtered = prev.filter(s => s.marketId !== selection.marketId);
            return [...filtered, selection];
        });
        setIsOpen(true);
    }, []);

    const hasMultipleFromSameEvent = useCallback(() => {
        const eventIds = new Set();
        for (const selection of selections) {
            if (eventIds.has(selection.eventId)) {
                return true;
            }
            eventIds.add(selection.eventId);
        }
        return false;
    }, [selections]);

    const removeSelection = useCallback((outcomeId) => {
        setSelections(prev => prev.filter(s => s.outcomeId !== outcomeId));
    }, []);

    const clearSelections = useCallback(() => {
        setSelections([]);
    }, []);

    const toggleOpen = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const isSelected = useCallback((outcomeId) => {
        return selections.some(s => s.outcomeId === outcomeId);
    }, [selections]);

    const totalOdds = selections.reduce((acc, s) => acc * s.odds, 1);

    return (
        <BetSlipContext.Provider value={{
            selections,
            isOpen,
            setIsOpen,
            addSelection,
            removeSelection,
            clearSelections,
            toggleOpen,
            isSelected,
            totalOdds,
            count: selections.length,
            hasMultipleFromSameEvent,
        }}>
            {children}
        </BetSlipContext.Provider>
    );
}

export function useBetSlip() {
    const ctx = useContext(BetSlipContext);
    if (!ctx) {
        throw new Error('useBetSlip must be used within a BetSlipProvider');
    }
    return ctx;
}
