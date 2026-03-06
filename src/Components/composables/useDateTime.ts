import { DateTime, Interval, Duration } from "luxon";

export type DurationInput = {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
};

export default function useDateTime() {

    function getDateTimeElements(intervalIso: string) {
        const interval = Interval.fromISO(intervalIso);

        if (!interval.isValid) {
            throw new Error(`Invalid ISO interval: ${intervalIso}`);
        }

        const { start, end } = interval;

        if (!start || !end) {
            throw new Error(`Interval boundaries are missing: ${intervalIso}`);
        }

        return { start, end };
    }

    function getRemains(end: DateTime, now: DateTime): Duration {
        const diff = end.diff(now);

        return diff.as("milliseconds") <= 0
            ? Duration.fromMillis(0)
            : diff;
    }

    function checkExpiration(end: DateTime, now: DateTime): boolean {
        return end <= now;
    }

    function getClockLikeDiff(duration: Duration): string {
        return duration
            .shiftTo("hours", "minutes", "seconds")
            .toFormat("hh:mm:ss");
    }

    function buildIntervalFromDuration(input: DurationInput): Interval {
        const start = DateTime.now();

        const end = start.plus({
            days: input.days ?? 0,
            hours: input.hours ?? 0,
            minutes: input.minutes ?? 0,
            seconds: input.seconds ?? 0
        });

        debugger;

        const interval = Interval.fromDateTimes(start, end);

        if (!interval.isValid) {
            throw new Error("Failed to build interval from duration");
        }

        return interval;
    }

    return {
        getDateTimeElements,
        getRemains,
        checkExpiration,
        getClockLikeDiff,
        buildIntervalFromDuration
    };
}