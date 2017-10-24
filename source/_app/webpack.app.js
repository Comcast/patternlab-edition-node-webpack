const {getIfUtils} = require('webpack-config-utils');

module.exports = env => {
    const {ifProd, ifDev} = getIfUtils(env);

    const app = {
        //Custom webpack configuration goes here
    }
    return app;
 }
