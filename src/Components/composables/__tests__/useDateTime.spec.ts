import { describe, it, expect } from "vitest";
import { DateTime, Duration, Interval } from "luxon";

import useDateTime from "../useDateTime";

describe("useDateTime", () => {

    const {
        getDateTimeElements,
        getRemains,
        checkExpiration,
        getClockLikeDiff
    } = useDateTime();

    it("parses ISO interval with timezone", () => {
        const iso =
            "2026-03-06T10:00:00.000+02:00/2026-03-06T11:00:00.000+02:00";
        const res = Interval.fromISO(iso);

        const { start, end } = getDateTimeElements(iso);

        expect(start.toISO()).toBe(res.start?.toISO());
        expect(end.toISO()).toBe(res.end?.toISO());
    });

    it("throws error for invalid interval", () => {
        expect(() => {
            getDateTimeElements("invalid");
        }).toThrow();
    });

    it("calculates remaining duration correctly across timezones", () => {

        const now = DateTime.fromISO(
            "2026-03-06T10:00:00.000+02:00",
            { setZone: true }
        );

        const end = DateTime.fromISO(
            "2026-03-06T10:00:10.000+02:00",
            { setZone: true }
        );

        const remains = getRemains(end, now);

        expect(remains.as("seconds")).toBe(10);
    });

    it("returns zero duration when expired", () => {

        const now = DateTime.fromISO(
            "2026-03-06T10:00:10.000+02:00",
            { setZone: true }
        );

        const end = DateTime.fromISO(
            "2026-03-06T10:00:00.000+02:00",
            { setZone: true }
        );

        const remains = getRemains(end, now);

        expect(remains.as("milliseconds")).toBe(0);
    });

    it("detects expiration", () => {

        const now = DateTime.fromISO(
            "2026-03-06T10:00:10.000+02:00",
            { setZone: true }
        );

        const end = DateTime.fromISO(
            "2026-03-06T10:00:00.000+02:00",
            { setZone: true }
        );

        const expired = checkExpiration(end, now);

        expect(expired).toBe(true);
    });

    it("formats duration as clock", () => {

        const duration = Duration.fromObject({
            hours: 1,
            minutes: 2,
            seconds: 3
        });

        const formatted = getClockLikeDiff(duration);

        expect(formatted).toBe("01:02:03");
    });

});