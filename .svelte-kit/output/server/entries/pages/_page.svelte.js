import { c as create_ssr_component, g as add_attribute, e as escape, h as subscribe, i as each, v as validate_component } from "../../chunks/ssr.js";
import "../../chunks/Toaster.svelte_svelte_type_style_lang.js";
import { ethers } from "ethers";
import { w as writable } from "../../chunks/index.js";
const walletStore = writable(null);
const FarmCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { pair } = $$props;
  let { apr } = $$props;
  let { tvl } = $$props;
  let { earned } = $$props;
  let { staked } = $$props;
  let { logo1 } = $$props;
  let { logo2 } = $$props;
  let { wallet } = $$props;
  let { weight } = $$props;
  let { poolId } = $$props;
  let { lpAddress } = $$props;
  if ($$props.pair === void 0 && $$bindings.pair && pair !== void 0) $$bindings.pair(pair);
  if ($$props.apr === void 0 && $$bindings.apr && apr !== void 0) $$bindings.apr(apr);
  if ($$props.tvl === void 0 && $$bindings.tvl && tvl !== void 0) $$bindings.tvl(tvl);
  if ($$props.earned === void 0 && $$bindings.earned && earned !== void 0) $$bindings.earned(earned);
  if ($$props.staked === void 0 && $$bindings.staked && staked !== void 0) $$bindings.staked(staked);
  if ($$props.logo1 === void 0 && $$bindings.logo1 && logo1 !== void 0) $$bindings.logo1(logo1);
  if ($$props.logo2 === void 0 && $$bindings.logo2 && logo2 !== void 0) $$bindings.logo2(logo2);
  if ($$props.wallet === void 0 && $$bindings.wallet && wallet !== void 0) $$bindings.wallet(wallet);
  if ($$props.weight === void 0 && $$bindings.weight && weight !== void 0) $$bindings.weight(weight);
  if ($$props.poolId === void 0 && $$bindings.poolId && poolId !== void 0) $$bindings.poolId(poolId);
  if ($$props.lpAddress === void 0 && $$bindings.lpAddress && lpAddress !== void 0) $$bindings.lpAddress(lpAddress);
  return `  <div class="farm-card p-6 mb-4 cursor-pointer"><div class="flex justify-between items-center"><div class="flex items-center"><div class="relative w-12 h-12"><img${add_attribute("src", logo1, 0)} alt="" class="absolute w-8 h-8 left-0"> <img${add_attribute("src", logo2, 0)} alt="" class="absolute w-8 h-8 right-0 bottom-0"></div> <div class="ml-4"><h3 class="text-lg font-bold">${escape(pair)}</h3> <p class="text-gray-400" data-svelte-h="svelte-1mpeumw">Earn LIT</p></div></div> <div class="flex items-center gap-4"><div class="text-right"><div class="flex items-center gap-2 mb-1"><span class="text-yellow-400 border border-yellow-400 px-1 rounded-md font-semibold">${escape(weight)}x</span> <span class="text-xl font-bold text-[#ffffff]">${escape(apr.toFixed(2))}% APY</span></div> <p class="text-gray-400">TVL: $${escape(tvl.toLocaleString(void 0, { maximumFractionDigits: 2 }))}</p></div> <svg class="${"w-6 h-6 text-gray-400 transition-transform duration-300 " + escape("", true)}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div> ${``}</div>`;
});
const farms = writable([
  {
    pair: "LEAN-PLSX",
    tvl: 0,
    apr: 0,
    earned: 0,
    staked: 0,
    logo1: "https://raw.githubusercontent.com/jaxnalia/lean-frontend-master/refs/heads/main/src/lib/images/lean.png",
    logo2: "https://raw.githubusercontent.com/jaxnalia/lean-frontend-master/refs/heads/main/src/lib/images/plsx.png",
    poolId: 0,
    lpAddress: "0x9A5C8868a7B6c099238A87b7e4d0AE03f9CB4393"
  },
  {
    pair: "LIT-PLSX",
    tvl: 0,
    apr: 0,
    earned: 0,
    staked: 0,
    logo1: "https://raw.githubusercontent.com/jaxnalia/lean-frontend-master/refs/heads/main/src/lib/images/lit.png",
    logo2: "https://raw.githubusercontent.com/jaxnalia/lean-frontend-master/refs/heads/main/src/lib/images/plsx.png",
    poolId: 1,
    lpAddress: "0xb75443509d897cE6D9b8F67C4B9eCc45dDdf3160"
  },
  {
    pair: "LIT-LEAN",
    tvl: 0,
    apr: 0,
    earned: 0,
    staked: 0,
    logo1: "https://raw.githubusercontent.com/jaxnalia/lean-frontend-master/refs/heads/main/src/lib/images/lit.png",
    logo2: "https://raw.githubusercontent.com/jaxnalia/lean-frontend-master/refs/heads/main/src/lib/images/lean.png",
    poolId: 2,
    lpAddress: "0x567499ec3428c77F8B36bc6cA5221961330228f6"
  }
]);
const tokenPrices = writable({
  LEAN: 0,
  PLSX: 0,
  LIT: 79e-7,
  WPLS: 0
});
const farmWeights = writable({});
const userEarned = writable({});
const totalAllocPoint = writable(0);
const MASTERCHEF_ADDRESS = "0xbE7f4fFfDe4241cA25eb27616aE3974aF0a023fD";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $walletStore, $$unsubscribe_walletStore;
  let $$unsubscribe_totalAllocPoint;
  let $$unsubscribe_userEarned;
  let $farmWeights, $$unsubscribe_farmWeights;
  let $$unsubscribe_tokenPrices;
  let $farms, $$unsubscribe_farms;
  $$unsubscribe_walletStore = subscribe(walletStore, (value) => $walletStore = value);
  $$unsubscribe_totalAllocPoint = subscribe(totalAllocPoint, (value) => value);
  $$unsubscribe_userEarned = subscribe(userEarned, (value) => value);
  $$unsubscribe_farmWeights = subscribe(farmWeights, (value) => $farmWeights = value);
  $$unsubscribe_tokenPrices = subscribe(tokenPrices, (value) => value);
  $$unsubscribe_farms = subscribe(farms, (value) => $farms = value);
  let wallet = null;
  let farmsData = [];
  let weights = {};
  const MASTERCHEF_ABI = [
    "function totalAllocPoint() view returns (uint256)",
    "function poolInfo(uint256) view returns (address lpToken, uint256 allocPoint, uint256 lastRewardBlock, uint256 accTokenPerShare)",
    "function pendingTokens(uint256 _pid, address _user) view returns (uint256)"
  ];
  ethers.BigNumber.from("10000000000000000000");
  async function fetchUserEarned() {
    if (!wallet) return;
    try {
      const provider = new ethers.providers.Web3Provider(wallet.provider);
      const masterChef = new ethers.Contract(MASTERCHEF_ADDRESS, MASTERCHEF_ABI, provider);
      const address = await provider.getSigner().getAddress();
      const newEarned = {};
      for (const farm of farmsData) {
        const pending = await masterChef.pendingTokens(farm.poolId, address);
        newEarned[farm.pair] = ethers.utils.formatEther(pending);
      }
      userEarned.set(newEarned);
      farms.update((farmsList) => farmsList.map((farm) => ({
        ...farm,
        earned: newEarned[farm.pair] ? parseFloat(newEarned[farm.pair]) : 0
      })));
    } catch (error) {
      console.error("Error fetching user earned tokens:", error);
    }
  }
  let earnedInterval;
  farmsData = $farms;
  weights = $farmWeights;
  wallet = $walletStore;
  {
    {
      if (wallet) {
        fetchUserEarned();
        if (!earnedInterval) {
          earnedInterval = setInterval(fetchUserEarned, 3e4);
        }
      } else {
        if (earnedInterval) {
          clearInterval(earnedInterval);
          earnedInterval = void 0;
        }
        userEarned.set({});
      }
    }
  }
  $$unsubscribe_walletStore();
  $$unsubscribe_totalAllocPoint();
  $$unsubscribe_userEarned();
  $$unsubscribe_farmWeights();
  $$unsubscribe_tokenPrices();
  $$unsubscribe_farms();
  return `<div class="max-w-4xl mx-auto"><div class="text-center mb-12" data-svelte-h="svelte-1tgqfvs"><h1 class="text-4xl font-bold mb-4">Farms</h1> <div class="flex items-center justify-center gap-2 mb-2"><img src="https://raw.githubusercontent.com/jaxnalia/lean-frontend-master/refs/heads/main/src/lib/images/lit.png" alt="LIT" class="w-6 h-6"> <p class="text-white font-semibold">Inflation: 10 LIT per block</p></div> <p class="text-gray-400">Stake LP tokens to earn LIT rewards</p></div> <div class="grid gap-4">${each(farmsData, (farm) => {
    return `${validate_component(FarmCard, "FarmCard").$$render($$result, Object.assign({}, farm, { wallet }, { weight: weights[farm.pair] || 0 }), {}, {})}`;
  })}</div> <div class="text-center mt-12" data-svelte-h="svelte-10lfs54"><p class="text-gray-400">Made with ❤️ by <a class="hover:underline" href=" http://x.com/bigjaxcapital">@bigjaxcapital</a></p> <p class="text-gray-400"><a class="hover:underline" href="https://x.com/pls_lean">X</a> • 
      <a class="hover:underline" href="https://scan.pulsechainfoundation.org/#/address/0xbE7f4fFfDe4241cA25eb27616aE3974aF0a023fD?tab=contract">Contract</a> • 
      <a class="hover:underline" href="https://leantoken.org/docs">Docs</a></p></div></div>`;
});
export {
  Page as default
};
