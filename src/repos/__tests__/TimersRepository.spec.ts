import { describe, it, expect, vi, beforeEach, Mocked } from 'vitest';
import { Interval, DateTime } from 'luxon';
import TimersRepository from '../TimersRepository';

const interval = Interval.fromDateTimes(DateTime.now(), DateTime.now());

function createTransport(responce: SerializedTimer): Mocked<ITransport> {
    return {
        save: vi.fn(),
        get: vi.fn().mockImplementation(() => responce),
    }
}

describe('TimersRepository', () => {
    let parserMock: any;
    let repository: TimersRepository;

    const storageKey = 'timers_storage';

    beforeEach(() => {
        parserMock = {
            parse: vi.fn(),
            serialize: vi.fn(),
        };

        repository = new TimersRepository(
            transportMock,
            parserMock
        );
    });

    it('returns undefined when timer does not exist', async () => {
        transportMock.get.mockResolvedValue({
            status: 'ok',
            value: {}
        });

        const result = await repository.get('work');

        expect(result).toBeUndefined();
        expect(parserMock.parse).not.toHaveBeenCalled();
    });

    it('returns parsed timer when exists', async () => {
        transportMock.get.mockResolvedValue({
            status: 'ok',
            value: {
                work: { label: 'work', interval: '1000' }
            }
        });

        parserMock.parse.mockReturnValue({
            label: 'work',
            interval: 1000
        });

        const result = await repository.get('work');

        expect(parserMock.parse).toHaveBeenCalled();
        expect(result).toEqual({
            label: 'work',
            interval: 1000
        });
    })

    it('returns empty array when storage empty', async () => {
        transportMock.get.mockResolvedValue({
            status: 'ok',
            value: undefined
        })

        const result = await repository.getAll();

        expect(result).toEqual([]);
    })

    it('returns parsed timers in getAll', async () => {
        transportMock.get.mockResolvedValue({
            status: 'ok',
            value: {
                work: { label: 'work', interval: '1000' }
            }
        });

        parserMock.parse.mockReturnValue({
            label: 'work',
            interval: '1000'
        });

        const result = await repository.getAll();

        expect(result.length).toBe(1);
        expect(parserMock.parse).toHaveBeenCalledTimes(1);
    });

    it('adds new timer to storage', async () => {
        transportMock.get.mockResolvedValue({
            status: 'ok',
            value: {}
        });

        parserMock.serialize.mockReturnValue({
            label: 'work',
            interval,
        });

        transportMock.save.mockResolvedValue({ status: 'ok' });

        await repository.add('work', {
            label: 'work',
            interval,
        });

        expect(parserMock.serialize).toHaveBeenCalled()

        expect(transportMock.save).toHaveBeenCalledWith(
            storageKey,
            {
                work: {
                    label: 'work',
                    interval,
                }
            }
        )
    });

    it('throws when transport.get returns error', async () => {
        transportMock.get.mockResolvedValue({
            status: 'error',
            error: new Error('storage failed')
        })

        await expect(repository.get('work'))
            .rejects
            .toThrow('storage failed')
    });
});
