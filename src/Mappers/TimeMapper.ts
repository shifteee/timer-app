export default class TimerMapper implements IMapper<SerializedTimer, Timer> {
    constructor(protected readonly adapter: ITimeAdapter) { }

    toDomain(val: SerializedTimer): Timer {
        return {
            label: val.label,
            interval: this.adapter.intervalFromISO(val.interval),
        };
    }

    toStorage(val: Timer): SerializedTimer {
        return {
            label: val.label,
            interval: val.interval.toISO(),
        };
    }
}