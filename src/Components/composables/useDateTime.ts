import { DateTime, Duration, Interval } from 'luxon';

export default function useDateTime(): TimeOperations {
    const getDuration = (selectors: SelectorValues) =>
        Duration.fromObject({
            days: Number(selectors.days),
            hours: Number(selectors.hours),
            minutes: Number(selectors.minutes),
            seconds: Number(selectors.seconds),
        });
    const getIsoStartAndInterval = (selectors: SelectorValues) => {
        const duration = getDuration(selectors);
        const start = DateTime.now();
        const end = start.plus(duration);
        const startIso = start.toISO() ?? '';
        const intervalIso = Interval.fromDateTimes(start, end).toISO() ?? '';

        return { startIso, intervalIso };
    };
    const getIsoRangeString = (selectors: SelectorValues) => {
        const { intervalIso } = getIsoStartAndInterval(selectors);

        return intervalIso;
    };
    const getIsoFromSelectors = (selectors: SelectorValues) => getIsoStartAndInterval(selectors);

    const checkExpiration = (timerEnd :string, now :string): boolean => {
        const interval = Interval.fromISO(timerEnd);
        const current = DateTime.fromISO(now);

        Interval.isInterval

        if (!interval.isValid) {
            throw new Error('Wrong DateTime object');
        }

        return current > interval.end;
    }

    const getDiff = (begin: string, end: string): Duration<true> => {
        const isoEnd = DateTime.fromISO(end);
        const isoBegin = DateTime.fromISO(begin);

        if (!isoEnd.isValid) {
            throw new Error('Expiration date is invalid');
        }

        if (!isoBegin.isValid) {
            throw new Error('Starting date is invalid');
        }

        const diff = DateTime.fromISO(end).diff(DateTime.fromISO(begin));

        if (!diff.isValid) {
            throw new Error('Diff date is invalid');
        }

        return diff;
    }

    return {
        getDuration,
        getIsoRangeString,
        getIsoStartAndInterval,
        getIsoFromSelectors,
        checkExpiration,
        getDiff,
    };
}