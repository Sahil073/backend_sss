const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../../config/env');

const authModel = require('./auth.model');

const generateAuthResponse = (user) => {
    const payload = {
        userId: user.id,
        email: user.email,
        name: user.name
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return {
        token,
        user: { userId: user.id,
            name: user.name,
            email: user.email
        }
    };

};

//Register Logic

const register = async ( name, email, password ) => {
    //check if email is already taken
    const existingUser = await authModel.findUserByEmail(email);
    if(existingUser){
        throw { code: 'EMAIL_IN_USE', message: 'Bhai ye email already use ho rha hai' , status: 400};
    }
    //password hash krni hai
    const hashedPassword = await bcrypt.hash(password, 10);

    //user create krna hai
    const user = await authModel.createUser(name, email, hashedPassword)

    // JWT token generate krna hai
    const tokens = generateAuthResponse(user);

    return tokens;
};

//Login Logic
const login = async (email, password) => {
    //user find kro
    const user = await authModel.findUserByEmail(email);
    if(!user){
        throw { code: 'USER_NOT_FOUND', message: 'Bhai ye user exist nhi krta hai' , status: 404};
    }
    //password match krni hai
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if(!isMatch){
        throw { code: 'PASSWORD_INCORRECT', message: 'Bhai password glt hai' , status: 401};
    }
    // JWT token generate krna hai
    const tokens = generateAuthResponse(user);

    return tokens;
}

module.exports = {
    register,
    login
}