var ACTIONS = require('./bot-actions');
var gpio = require('rpi-gpio');
var gpiop = gpio.promise;

function BotService() {

    this.outputs = [
        [ACTIONS.LIGHT, 12],      // outlet 1
        [ACTIONS.HEATER_MAT, 16], // outlet 2
        [ACTIONS.FILL_PUMP, 18],  // outlet 3
        [ACTIONS.DRAIN_PUMP, 22], // outlet 4
        [ACTIONS.FAN, 32],        // outlet 5
        [null, 36]                // outlet 6
    ];

    this.init = () => {
        // set RPI mode which matches board pin numbers
        gpio.setMode(gpio.MODE_RPI);

        // initialize all outputs and set to off by default
        this.outputs.forEach(output => {
            gpiop.setup(output[1], gpio.DIR_OUT)
                .then(() => {
                    return gpiop.write(output[1], true)
                })
                .catch((err) => {
                    console.log('Error: ', err.toString())
                });
        });

    };

    this.toggle = (action) => {
        if (ACTIONS[action]) {
            let channel = this.getChannel(ACTIONS[action]);
            gpiop.read(channel)
                .then((value => {
                    console.log('Value for channel: ', channel, value)
                }))
                .catch((err) => {
                    console.log('Error: ', err.toString())
                })
        } else {
            console.log('Error: invalid bot action provided: ', action);
        }
    };

    this.getChannel = (action) => {
        return this.outputs.findIndex(option => {
            return option[0] === action;
        })
    };
}

let botService = new BotService();
botService.init();

module.exports = botService;