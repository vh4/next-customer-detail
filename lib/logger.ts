import moment from "moment";
import winston from "winston";

const consoleTransport = new winston.transports.Console({
    format:winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({level, message}) => {
            return `[${moment().format('YYYY-MM-DD HH:mm:ss.SSS')}] ${level} => ${message}`;
        })
    )
})

const logger = winston.createLogger({
    level:'info',
    transports:[
        consoleTransport
    ]
});

export default logger;