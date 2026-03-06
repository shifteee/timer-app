import { describe, it, expect, vi, beforeEach, Mocked } from 'vitest';
import { Interval, DateTime } from 'luxon';
import TimerRepository from '../TimerRepository';

type IMockedTransport = Mocked<ITransport<StorageResponse<SerializedTimer>>>;

const interval = Interval.fromDateTimes(DateTime.now(), DateTime.now());

function createTransport(): IMockedTransport {
    let result: StorageResponse<SerializedTimer> | undefined;

    return {
        save: vi.fn().mockResolvedValue(() => ({
            status: 'ok',
            value: undefined,
        })),
        get: vi.fn().mockImplementation(async () => ({
            status: 'ok',
            value: result,
        })),
    };
}

function createParser(): Mocked<IMapper<SerializedTimer, Timer>> {
    let result: SerializedTimer | Timer | undefined;

    return {
        toDomain: vi.fn().mockImplementation(() => result),
        toStorage: vi.fn().mockImplementation(() => result),
    };
}

describe('TimerRepository', () => {
    const storageKey = 'timers_storage';
    const parserMock = createParser();
    const transportMock = createTransport();

    let repository: IRepository<Timer>;

    beforeEach(() => {
        vi.clearAllMocks();

        repository = new TimerRepository(
            transportMock,
            parserMock,
        );
    });

    it('returns undefined when timer does not exist', async () => {
        transportMock.get.mockResolvedValueOnce({
            status: 'ok',
            value: {}
        });

        const result = await repository.get('work');

        expect(result).toBeUndefined();
        expect(parserMock.toDomain).not.toHaveBeenCalled();
    });

    it('returns parsed timer when exists', async () => {
        transportMock.get.mockResolvedValue({
            status: 'ok',
            value: {
                work: { label: 'work', interval: '1000' }
            }
        });

        parserMock.toDomain.mockReturnValue({
            label: 'work',
            interval,
        });

        const result = await repository.get('work');

        expect(parserMock.toDomain).toHaveBeenCalled();
        expect(result).toEqual({
            label: 'work',
            interval,
        });
    })

    it('returns empty array when storage empty', async () => {
        transportMock.get.mockResolvedValue({
            status: 'ok',
            value: undefined
        });

        const result = await repository.getAll();

        expect(result).toEqual([]);
    })

    it('returns parsed timers in getAll', async () => {
        transportMock.get.mockResolvedValue({
            status: 'ok',
            value: {
                work: {
                    label: 'work',
                    interval: interval.toISOTime(),
                }
            }
        });

        parserMock.toDomain.mockReturnValue({
            label: 'work',
            interval,
        });

        const result = await repository.getAll();

        expect(result.length).toBe(1);
        expect(parserMock.toDomain).toHaveBeenCalledTimes(1);
    });

    it('adds new timer to storage', async () => {
        transportMock.get.mockResolvedValue({
            status: 'ok',
            value: {}
        });

        parserMock.toStorage.mockReturnValue({
            label: 'work',
            interval: interval.toISOTime(),
        });

        transportMock.save.mockResolvedValue({ status: 'ok', value: undefined });

        await repository.add('work', {
            label: 'work',
            interval,
        });

        expect(parserMock.toStorage).toHaveBeenCalled();

        expect(transportMock.save).toHaveBeenCalledWith(
            storageKey,
            {
                work: {
                    label: 'work',
                    interval: interval.toISOTime(),
                },
            },
        );
    });

    it('throws when transport.get returns error', async () => {
        transportMock.get.mockResolvedValue({
            status: 'error',
            error: new Error('storage failed'),
        });

        await expect(repository.get('work'))
            .rejects
            .toThrow('storage failed');
    });
});
