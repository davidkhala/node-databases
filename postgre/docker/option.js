import {Test} from '../healthcheck.js';

export const Healthcheck = {
	Test: ['CMD-SHELL', Test],
	Interval: 1000 * 1000000 // 1 second
};