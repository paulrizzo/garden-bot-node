let ACTIONS = require('./bot-actions');
let GPIO = require('rpi-gpio');
let Agenda = require('agenda');

const mongoConnectionString = 'mongodb://127.0.0.1/agenda';
const agenda = new Agenda({db: {address: mongoConnectionString, collection: 'agendaJobs'}});

function BotService() {

    this.agenda = agenda;
    this.gpiop = GPIO.promise;
    this.outputs = [
        [ACTIONS.LIGHT, 12],      // outlet 1
        [ACTIONS.HEATER_MAT, 16], // outlet 2
        [ACTIONS.FILL_PUMP, 18],  // outlet 3
        [ACTIONS.LOWER_FAN, 22],  // outlet 4
        [ACTIONS.UPPER_FAN, 32],  // outlet 5
        [null, 36]                // outlet 6
    ];

    this.init = () => {
        // register jobs
        this.registerJobs();
        this.startScheduler();

        // initialize all outputs and set to off by default
        this.outputs.forEach(output => {
            this.gpiop.setup(output[1], GPIO.DIR_OUT)
                .then(() => {
                    console.log('Setup pin: ', output[1]);
                    return this.gpiop.write(output[1], true)
                })
                .catch((err) => {
                    console.log('Error: ', err.toString())
                });
        });
    };

    this.registerJobs = () => {
        this.outputs.forEach(output => {
            let jobName = output[0];
            let actionPin = output[1];
            this.registerJob(jobName, actionPin);
        })
    };

    this.registerJob = (jobName, actionPin) => {
        if (jobName !== null) {
            console.log('Registering job:', jobName);
            agenda.define(jobName + ' on', {}, () => {
                this.setPin(actionPin, '0');
                // TODO: capture image
            });

            agenda.define(jobName + ' off', {}, () => {
                this.setPin(actionPin, '1');
                // TODO: capture image
            });
        }
    };

    this.startScheduler = () => {
        agenda.start().then(() => {
            console.log('Agenda started successfully!');
        }).catch(() => {
            console.log('Agenda failed to start successfully!');
        });
    };

    this.toggle = (action) => {
        if (ACTIONS[action]) {
            let pin = this.getPin(ACTIONS[action]);
            this.gpiop.read(pin)
                .then((value => {
                    return this.setPin(pin, !value);
                }))
                .catch((err) => {
                    console.log('Error reading pin: ', pin, err.toString())
                })
        } else {
            console.log('Error: invalid bot action provided: ', action);
        }
    };

    this.getActionState = (action) => {
        if (ACTIONS[action]) {
            let pin = this.getPin(ACTIONS[action]);
            return this.gpiop.read(pin);
        }
    };

    this.getPin = (action) => {
        const output = this.outputs.find(option => {
            return option[0] === action;
        });
        return output ? output[1] : null;
    };

    this.setPin = (pin, value) => {
        console.log('Updating value for channel: ', pin, ' from: ', value, ' to: ', value);
        return this.gpiop.write(pin, value);
    };
}

let botService = new BotService();
botService.init();

module.exports = botService;