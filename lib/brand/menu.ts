import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BusinessInfo, MenuCategory, LoyaltyReward } from './types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load YAML files
const dataDir = path.join(__dirname, '../../data');

function loadYaml<T>(filename: string): T {
  const filePath = path.join(dataDir, filename);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return yaml.load(fileContents) as T;
}

// Export loaded data
export const business = loadYaml<{ business: BusinessInfo }>('business.yml').business;
export const menu: MenuCategory[] = loadYaml('menu.yml');
export const loyaltyRewards = <{ rewards: LoyaltyReward[] }>loadYaml('loyalty.yml');
