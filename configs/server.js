'use strict'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js';
import adminRoutes from '../src/admin/admin.routes.js'
import clientRoutes from '../src/client/client.routes.js'

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.adminPath = '/sales/v2/admin';
        this.clientPath = '/sales/v2/client';

        this.middlewares();
        this.conectarDB();
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    routes(){
        this.app.use(this.adminPath, adminRoutes);
        this.app.use(this.clientPath, clientRoutes);
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}

export default Server;