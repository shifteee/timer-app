import type { Duration, Interval } from 'luxon';
import type { Ref } from 'vue';

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
        days?: number;
        hours?: number;
        minutes?: number;
        seconds?: number;
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
        toDomain(val: TSerialized): TDomain;
        toStorage(val: TDomain): TSerialized;
    }

    interface IRepository<T> {
        get(key: string): Promise<T | undefined>;
        getAll(): Promise<T[]>;
        add(key: string, val: T): Promise<void>;
        remove(key: string): Promise<void>;
    }

    export interface ITimeAdapter {
        intervalFromISO(value: string): Interval;
        intervalToISO(interval: Interval): string;
    }
}

export { };
