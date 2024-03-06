import jwt from "jsonwebtoken";
import Admin from '../admin/admin.model.js';
import Client from '../client/client.model.js';
import { request, response } from 'express';

export const validateJWT = async(req = request, res = response, next)=> {
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'There is no token in the request',
        });
    }

    try{
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const admin = await Admin.findById(uid);
        if(!admin){
            return res.status(401).json({
                msg: "Admin does not exist in the database"
            });
        }

        if(!admin.state){
            return res.status(401).json({
                msg: "Invalid token, admin with false status"
            });
        }

        req.admin = admin;
        next();
        
    }catch(e){
        console.log(e);
        res.status(401).json({
            msg: "Invalid token"
        })
    }
}

export const validateClientJWT = async(req = request, res = response, next)=> {
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'There is no token in the request',
        });
    }

    try{
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const client = await Client.findById(uid);
        if(!client){
            return res.status(401).json({
                msg: "Client does not exist in the database"
            });
        }

        if(!client.state){
            return res.status(401).json({
                msg: "Invalid token, client with false status"
            });
        }

        req.client = client;
        next();
        
    }catch(e){
        console.log(e);
        res.status(401).json({
            msg: "Invalid token"
        })
    }
}