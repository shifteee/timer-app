import { DateTime, Interval, Duration } from "luxon";

export type DurationInput = {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
};

function toDateTime(date: Date): DateTime {
    return DateTime.fromJSDate(date)
}

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

    function getRemains(end: DateTime, now: Date): Duration {
        const nowDateTime = toDateTime(now);
        const diff = end.diff(nowDateTime);

        return diff.as("milliseconds") <= 0
            ? Duration.fromMillis(0)
            : diff;
    }

    function checkExpiration(end: DateTime, now: Date): boolean {
        const nowDateTime = toDateTime(now);
        return end <= nowDateTime;
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