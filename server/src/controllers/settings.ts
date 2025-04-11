// src/controllers/auth.ts
import fs from 'fs'
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import YAML from 'js-yaml';
import dotenv from 'dotenv';

import User from "../models/User";
import Team from "../models/Team";

const dynamicConfigPath = '/traefik/dynamic.yml'
const envFilePath = '/env/.env'

const setDomain = async (): Promise<void> => {

}

export const getSettingsInfo = async (req: Request, res: Response): Promise<void> => {

};

export const setRootDomain = async (req: Request, res: Response): Promise<void> => {
  const { domain } = req.body

  let hostname = domain

  if (/^https?:\/\//i.test(domain)) {
    try {
      const url = new URL(domain);
      var hostname = url.hostname;
    } catch (error) {
      return res.error(400, error.message || 'Invalid URL provided')
    }
  }

  console.log('Hostname', hostname)

  // let config = fs.existsSync(dynamicConfigPath) ?
  //   YAML.load(fs.readFileSync(dynamicConfigPath, 'utf8')) : { http: { middlewares: {}, routers: {}, services: {} }};

  // let env = fs.existsSync(envFilePath) ?
  //   dotenv.parse(fs.readFileSync(envFilePath)) : {};

  // // Remove Existing Domain

  // // Add a new router for the submitted domain
  // config.http.routers[`router_${hostname}`] = {
  //   rule: `Host(\`${hostname}\`)`,
  //   service: `service_${hostname}`,
  //   tls: {
  //     certResolver: 'myresolver'
  //   },
  //   middlewares: ['redirect-to-https']
  // };

  // // Configure the service pointing to your app (update URL as needed)
  // config.http.services[`service_${hostname}`] = {
  //   loadBalancer: {
  //     servers: [{ url: "http://app:4173" }]
  //   }
  // };

  // // Write back the updated configuration
  // fs.writeFileSync(dynamicConfigPath, YAML.stringify(config));



  // console.log('Config', config, env)

  res.json({
    message: 'Domain updated successfully!'
  })
};

export const setApiDomain = async (req: Request, res: Response): Promise<void> => {

};