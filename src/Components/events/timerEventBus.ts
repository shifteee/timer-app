import { useEventBus } from '@vueuse/core';

const timerEventBus = useEventBus<symbol, string>(Symbol.for('Timer'));

export default timerEventBus;