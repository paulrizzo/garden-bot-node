var ACTIONS = require('./bot-actions');
var GPIO = require('rpi-gpio');

function BotService() {

    this.gpiop = GPIO.promise;
    this.outputs = [
        [ACTIONS.LIGHT, 12],      // outlet 1
        [ACTIONS.HEATER_MAT, 16], // outlet 2
        [ACTIONS.FILL_PUMP, 18],  // outlet 3
        [ACTIONS.DRAIN_PUMP, 22], // outlet 4
        [ACTIONS.FAN, 32],        // outlet 5
        [null, 36]                // outlet 6
    ];

    this.init = () => {
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

    this.toggle = (action) => {
        if (ACTIONS[action]) {
            let pin = this.getPin(ACTIONS[action]);
            this.gpiop.read(pin)
                .then((value => {
                    console.log('Value for channel: ', pin, value)
                }))
                .catch((err) => {
                    console.log('Error reading pin: ', pin, err.toString())
                })
        } else {
            console.log('Error: invalid bot action provided: ', action);
        }
    };

    this.getPin = (action) => {
        return this.outputs.findIndex(option => {
            return option[0] === action;
        })
    };
}

let botService = new BotService();
botService.init();

module.exports = botService;