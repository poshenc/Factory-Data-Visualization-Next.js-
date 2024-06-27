import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const getLogger = (fileName = 'tool-health') => {
    const fileLogTransport = new transports.DailyRotateFile({
        filename: `logs/${fileName}-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '30d'
    })

    const logger = createLogger({
        level: 'info',
        format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.errors({ stack: true }),
            format.splat(),
            format.printf(
                ({ level, message, label = process.env.NODE_ENV, timestamp }) => {
                    return `${timestamp} [${label}] ${level}: ${message}`
                }
            )
        ),
        defaultMeta: { service: 'my-app' },
        transports: [fileLogTransport]
    })

    return logger
}

export default getLogger()