const jwt = require('jsonwebtoken');
const model = require('../Schema/User')
const User = model.User
require('dotenv').config();
const dbConnection = require("../Db_connection");
const logger = require('../../logger')

const JWTauth = async (request, context) => {
    try{
        logger.info(`JWT MIddleware "${request.url}"`)
        const authHeader = request.headers.get('authorization') || request.headers.get('Authorization')
        
        if(authHeader){
            const token = authHeader.split(' ')[1]
            const decoded = jwt.verify(token, process.env.HMAC_PRIVATE_KEY)
            const userId = decoded.userId
            await dbConnection();
            const user = await User.find({_id:userId})
            
            if(user){
                //user exist
                // req.body.userId = userId
                // next()
                logger.info('User authenticated')
                return { result: true, status: 200, userId: userId };
            }
            else{
                //user doesn't exist
                //res.status(401).json({"name": "Please login to access this resource"})
                logger.error('Please login to access this resource')
                return { error: {name : "Please login to access this resource"}, status: 401 };
            }
        }
        else{
            //res.status(401).json({"name":"Please login to access this resource"})
            logger.error('Please login to access this resource')
            return { error: {name : "Please login to access this resource"}, status: 401 };
        }
    }
    catch(err){
        //res.status(401).json({"name":"Error Occured", err})
        logger.error('IWT Auth error', err)
        return { error : {"name":"Error Occured", err}, status: 401 };
    }
    
}

module.exports = JWTauth