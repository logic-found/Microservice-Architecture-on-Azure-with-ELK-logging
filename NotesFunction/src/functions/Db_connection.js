const mongoose = require('mongoose')
require('dotenv').config();
const logger = require('../logger')

// connect to DB
const connection = async () => {
    try{
        const reponse = await mongoose.connect(process.env.DB_URL)
        logger.info("connected to db")
    }
    catch(err){
        logger.error('DB connection error', err)
    }
}

module.exports = connection