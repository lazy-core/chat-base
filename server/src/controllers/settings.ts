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

  const hostname = extractBaseUrl(domain)
  if (!hostname)
    return res.error(400, 'Invalid URL provided')

  if (process.env.APP_DOMAIN == hostname)
    return res.error(400, 'Domain already set')

  let config = YAML.load(fs.readFileSync(dynamicConfigPath, 'utf8')) as TraefikDynamicConfig
  let env = dotenv.parse(fs.readFileSync(envFilePath))

  // Remove Existing Domain

  // Add a new router for the submitted domain
  if (!config.http.routers)
    config.http.routers = {}

  if (!config.http.services)
    config.http.services = {}

  delete config.http.routers[`router_${process.env.APP_DOMAIN}`]
  delete config.http.services[`service_${process.env.APP_DOMAIN}`]

  config.http.routers[`router_${hostname}`] = {
    rule: `Host(\`${hostname}\`)`,
    service: `service_${hostname}`,
    entryPoints: ['appsecure'],
    tls: {
      certResolver: 'letsencrypt'
    },
    middlewares: ['redirect-to-https']
  };

  config.http.services[`service_${hostname}`] = {
    loadBalancer: {
      servers: [{ url: "http://app:4173" }]
    }
  };
  
  env.APP_DOMAIN = hostname

  const newEnvContents = Object.entries(env)
  .map(([key, value]) => `${key}='${value}'`)
  .join('\n');

  fs.writeFileSync(dynamicConfigPath, YAML.dump(config));
  fs.writeFileSync(envFilePath, newEnvContents, 'utf8');

  res.json({
    message: 'Domain updated successfully!'
  })
};

export const setApiDomain = async (req: Request, res: Response): Promise<void> => {

};

// END: EXPORTS

const setDomain = async (): Promise<void> => {

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