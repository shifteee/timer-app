import { InjectionKey } from 'vue';

export const ReposytoryKey: InjectionKey<IRepository<Timer>> = Symbol('TimerRepository');