import { writable } from 'svelte/store';
import { ethers } from 'ethers';
import schwepe from '$lib/images/schwepe.png';
import schwag from '$lib/images/schwag.png';
import pls from '$lib/images/pls.png';


export interface Farm {
  pair: string;
  tvl: number;
  apr: number;
  earned: number;
  staked: number;
  logo1: string;
  logo2: string;
  poolId: number;
  lpAddress: string;
}

export interface TokenPrices {
  LEAN: number;
  PLSX: number;
  LIT: number;
  WPLS: number;
}

export const farms = writable<Farm[]>([
  {
    pair: 'BAG-WPLS',
    tvl: 0,
    apr: 0,
    earned: 0,
    staked: 0,
    logo1: schwag,
    logo2: pls,
    poolId: 0,
    lpAddress: '0x9A5C8868a7B6c099238A87b7e4d0AE03f9CB4393'
  },
  {
    pair: 'SWAG-WPLS',
    tvl: 0,
    apr: 0,
    earned: 0,
    staked: 0,
    logo1: schwag,
    logo2: pls,
    poolId: 1,
    lpAddress: '0xb75443509d897cE6D9b8F67C4B9eCc45dDdf3160'
  },
  {
    pair: 'SWAG-BAG',
    tvl: 0,
    apr: 0,
    earned: 0,
    staked: 0,
    logo1: schwag,
    logo2: schwag,
    poolId: 2,
    lpAddress: '0x567499ec3428c77F8B36bc6cA5221961330228f6'
  }
]);

export const tokenPrices = writable<TokenPrices>({
  LEAN: 0.000000,
  PLSX: 0.00000000,
  LIT: 0.0000079,
  WPLS: 0.00000
});

export const farmWeights = writable<Record<string, number>>({});
export const userEarned = writable<Record<string, string>>({});
export const totalAllocPoint = writable<number>(0);
