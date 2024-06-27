// import prisma from '@/lib/prisma';
// import { Prisma } from '@prisma/client';
import logger from './logger/logger';

export async function executeTaskByInterval() {
    if (!process.env.JOB_INTERVAL_MINUTES) {
        logger.error('JOB_INTERVAL_MINUTES is not provided.')
        return
    }

    if (!process.env.JOB_DELAY_MINUTES) {
        logger.error('JOB_DELAY_MINUTES is not provided.')
        return
    }

    logger.info('Started scheduled store procedure task.')

    const JOB_INTERVAL_MINUTES = parseInt(process.env.JOB_INTERVAL_MINUTES)
    const JOB_DELAY_MINUTES = parseInt(process.env.JOB_DELAY_MINUTES)

    const task = async () => {
        // const now = new Date()
        // const { startTime, endTime } = getTimeRange(now, JOB_INTERVAL_MINUTES, JOB_DELAY_MINUTES)

        // const rawSQL = Prisma.sql`
        //     call job_execute(${startTime}::timestamp, ${endTime}::timestamp);
        // `

        // try {
        //     const result = await prisma.$executeRaw(rawSQL)
        //     logger.info('Executed store procedure successfully.')
        // } catch (error) {
        //     logger.error('Store procedure job failed:', error)
        // }
    }

    task()
    setInterval(task, JOB_INTERVAL_MINUTES * 60 * 1000);
}

function getTimeRange(now: Date, intervalMinutes: number, delayMinutes: number) {
    // Define the delay in milliseconds (60 seconds)
    const delayMilliseconds = delayMinutes * 60 * 1000;

    // Subtract the delay from the current time
    const adjustedTime = new Date(now.getTime() - delayMilliseconds);

    // Convert interval to milliseconds
    const intervalMilliseconds = intervalMinutes * 60 * 1000;

    // Get the timestamp of the adjusted time
    const adjustedTimestamp = adjustedTime.getTime();

    // Calculate the start of the current interval based on the adjusted time
    const startIntervalTimestamp = adjustedTimestamp - intervalMilliseconds;

    // Calculate the end of the current interval (one interval before the start of the next interval)
    const endIntervalTimestamp = startIntervalTimestamp + intervalMilliseconds - 1000;

    // Convert timestamps back to Date objects
    const startTime = new Date(startIntervalTimestamp);
    const endTime = new Date(endIntervalTimestamp);

    return {
        startTime: startTime.toLocaleString('sv'),
        endTime: endTime.toLocaleString('sv')
    }
}