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

interface TraefikDynamicConfig {
  http: {
    routers: Record<string, any>;
    services: Record<string, any>;
    middlewares: Record<string, any>;
  };
}

export const getSettingsInfo = async (req: Request, res: Response): Promise<void> => {
  res.json({
    app_domain: process.env.APP_DOMAIN,
    api_domain: process.env.API_DOMAIN,
  })
};

export const setAppDomain = async (req: Request, res: Response): Promise<void> => {
  const { domain } = req.body

  if (domain){
    const hostname = extractBaseUrl(domain)
    if (!hostname)
      return res.error(400, 'Invalid URL provided')
  
    if (process.env.APP_DOMAIN == hostname)
      return res.error(400, 'App domain already set')

    if (process.env.API_DOMAIN == hostname)
      return res.error(400, 'This domain is already set as the API domain')
  
    await setDomain(hostname, 'APP_DOMAIN', `http://app:${process.env.APP_PORT!}`)
  } else {
    await setDomain(undefined, 'APP_DOMAIN', `http://app:${process.env.APP_PORT!}`)
  }

  res.json({
    message: 'App domain updated successfully!'
  })
};

export const setApiDomain = async (req: Request, res: Response): Promise<void> => {
  const { domain } = req.body

  if (domain){
    const hostname = extractBaseUrl(domain)
    if (!hostname)
      return res.error(400, 'Invalid URL provided')

    if (process.env.API_DOMAIN == hostname)
      return res.error(400, 'API domain already set')

    if (process.env.APP_DOMAIN == hostname)
      return res.error(400, 'This domain is already set as the App domain')

    await setDomain(hostname, 'API_DOMAIN', `http://api:${process.env.API_PORT!}`)
  } else {
    await setDomain(undefined, 'API_DOMAIN', `http://api:${process.env.API_PORT!}`)
  }

  res.json({
    message: 'API domain updated successfully!'
  })
};

// END: EXPORTS

const setDomain = async (newHost: string | undefined, key: string, url: string): Promise<void> => {
  let config = YAML.load(fs.readFileSync(dynamicConfigPath, 'utf8')) as TraefikDynamicConfig
  let env = dotenv.parse(fs.readFileSync(envFilePath))

  console.log('Existing Config', config)

  if (!config.http.routers)
    config.http.routers = {}

  if (!config.http.services)
    config.http.services = {}

  console.log('Updated Config', config)

  delete config.http.routers[`router_${process.env[key]}`]
  delete config.http.services[`service_${process.env[key]}`]
  delete env[key]

  if (newHost){
    config.http.routers[`router_${newHost}`] = {
      rule: `Host(\`${newHost}\`)`,
      service: `service_${newHost}`,
      entryPoints: ['websecure'],
      tls: {
        certResolver: 'letsencrypt'
      },
      middlewares: ['redirect-to-https']
    };
  
    config.http.services[`service_${newHost}`] = {
      loadBalancer: {
        servers: [{ url: url }]
      }
    };
    
    env[key] = newHost
  }

  const newEnvContents = Object.entries(env)
  .map(([key, value]) => `${key}='${value}'`)
  .join('\n');

  fs.writeFileSync(dynamicConfigPath, YAML.dump(config));
  fs.writeFileSync(envFilePath, newEnvContents, 'utf8');
}

function extractBaseUrl(input: string): string | null {
  let hostname: string;
  
  // If input starts with a protocol, use it directly.
  if (/^https?:\/\//i.test(input)) {
    try {
      const url = new URL(input);
      hostname = url.hostname;
    } catch (error) {
      console.error("Invalid URL:", error);
      return null;
    }
  } else {
    // Prepend "http://" and try to parse.
    try {
      const url = new URL("http://" + input);
      hostname = url.hostname;
    } catch (error) {
      console.error("Invalid input:", error);
      return null;
    }
  }

  // Validate the extracted hostname.
  if (!isValidHostname(hostname)) {
    return null;
  }

  return hostname;
}

function isValidHostname(hostname: string): boolean {
  // Allow 'localhost' explicitly.
  if (hostname === "localhost") {
    return true;
  }

  // Require at least one dot – this way, a string like "abc" is considered invalid.
  if (!hostname.includes(".")) {
    return false;
  }

  // A simple regex to check that the hostname contains only allowed characters.
  // This regex allows letters, digits, dots, and hyphens.
  const regex = /^[a-zA-Z0-9.-]+$/;
  return regex.test(hostname);
}