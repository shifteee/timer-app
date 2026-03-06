import { Interval } from 'luxon';

export class LuxonTimeAdapter implements ITimeAdapter {

    intervalFromISO(value: string): Interval {
        return Interval.fromISO(value);
    }

    intervalToISO(interval: Interval): string {
        return interval.toISO();
    }

}