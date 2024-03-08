'use strict'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js';
import bycryptjs from 'bcryptjs';
import Admin from '../src/admin/admin.model.js';
import clientRoutes from '../src/client/client.routes.js'
import authRoutes from '../src/auth/auth.routes.js'
import productRoutes from '../src/product/product.routes.js'
import categoryRoutes from '../src/category/category.routes.js'
import userRoutes from '../src/users/user.routes.js'
import cartRoutes from '../src/shoppingCart/shoppingCart.routes.js'
import invoiceRoutes from '../src/invoice/invoice.routes.js'

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.authPath = '/sales/v2/auth';
        this.clientPath = '/sales/v2/client';
        this.productPath = '/sales/v2/product';
        this.categoryPath = '/sales/v2/category';
        this.userPath = '/sales/v2/user';
        this.cartPath = '/sales/v2/shoppingCart';
        this.invoicePath = '/sales/v2/invoice';

        this.middlewares();
        this.conectarDB();
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
        

        const adminExists = await Admin.findOne({ mail: "admin@gmail.com" });

        if (!adminExists) {
            const defaultAdmin = new Admin({
                name: "Administrador",
                mail: "admin@gmail.com",
                password: "123456"
            });

            const salt = bycryptjs.genSaltSync();
            defaultAdmin.password = bycryptjs.hashSync(defaultAdmin.password, salt);
        
            defaultAdmin.save();
        } else {
            console.log('Admin already exists');
        }
    }

    middlewares(){
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    routes(){
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.clientPath, clientRoutes);
        this.app.use(this.productPath, productRoutes);
        this.app.use(this.categoryPath, categoryRoutes);
        this.app.use(this.userPath, userRoutes);
        this.app.use(this.cartPath, cartRoutes);
        this.app.use(this.invoicePath, invoiceRoutes);
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}

export default Server;