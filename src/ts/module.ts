/**
 * @license MIT
 * @copyright 2023 bassu
 * @author bassu <basavarajakj06@gmail.com>
 */

"use strict";


export const getTime = (minutes :number) => {
    const hour: number = Math.floor(minutes / 60) % 24;
    const day: number = Math.floor(minutes / 24 / 60);

    const time = day || hour || minutes;

    const unitIndex = [day, hour, minutes].lastIndexOf(time);
    const timeUnit = ["days", "hours", "minutes"][unitIndex];

    return { time, timeUnit }; 
}