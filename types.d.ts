import type { Duration, Interval } from 'luxon';

declare global {
    type Timer = {
        label: string,
        interval: Interval,
    }

    type SerializedTimer = {
        label: string,
        interval: string,
    }

    type IsoRange = { startIso: string; intervalIso: string };

    type SelectorValues = {
        days?: number | string;
        hours?: number | string;
        minutes?: number | string;
        seconds?: number | string;
    };

    type TimeOperations = {
        getDuration(selectors: SelectorValues): Duration,
        getIsoRangeString(selectors: SelectorValues): string,
        getIsoStartAndInterval(selectors: SelectorValues): IsoRange,
        getIsoFromSelectors(selectors: SelectorValues): IsoRange,
        checkExpiration(isoDateInterval: string, now: string): boolean,
        getDiff(begin: string, end: string): Duration,
    };

    type TransportError = {
        code?: string
        message: string
    };

    type Result<T, E = TransportError> =
        | { status: 'ok', value: T }
        | { status: 'error', error: E };

    type StorageResponse<T> = Record<string, T>;

    interface ITransport<T> {
        save(key: string, value: T): Promise<Result<void>>;
        get(key: string): Promise<Result<T | undefined>>;
    }

    interface IMapper<TSerialized, TDomain> {
        parse(val: TSerialized): TDomain;
        serialize(val: TDomain): TSerialized;
    }

    interface IRepository<T> {
        get(key: string): Promise<T | undefined>;
        getAll(): Promise<T[]>;
        add(key: string, val: T): Promise<void>;
    }
}

export { };
