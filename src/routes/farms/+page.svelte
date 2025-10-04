<script lang="ts">
  import FarmCard from '$lib/FarmCard.svelte';
  import schwag from '$lib/images/schwag.png';
  import { onMount } from 'svelte';
  import { ethers } from 'ethers';
  import { 
    farms, 
    tokenPrices, 
    farmWeights, 
    userEarned, 
    totalAllocPoint,
    type Farm,
    type TokenPrices 
  } from '$lib/stores/farms';
  import { walletStore } from '$lib/stores/wallet';

  let wallet: any = null;
  let farmsData: Farm[] = [];
  let prices: TokenPrices;
  let weights: Record<string, number> = {};
  let earned: Record<string, string> = {};
  let totalAlloc: number = 0;

  const MASTERCHEF_ADDRESS = '0xbE7f4fFfDe4241cA25eb27616aE3974aF0a023fD';
  const MASTERCHEF_ABI = [
    "function totalAllocPoint() view returns (uint256)",
    "function poolInfo(uint256) view returns (address lpToken, uint256 allocPoint, uint256 lastRewardBlock, uint256 accTokenPerShare)",
    "function pendingTokens(uint256 _pid, address _user) view returns (uint256)"
  ];

  const LP_TOKEN_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
    "function totalSupply() view returns (uint256)"
  ];

  // LEAN/WPLS pair address for price calculation
  const LEAN_WPLS_PAIR = '0x9961c2652B301c4A25256Db05316d2be11CEbaB1';

  // Reward constants
  const BLOCKS_PER_YEAR = 31536000 / 3; // 3s block time
  const REWARD_PER_BLOCK = ethers.BigNumber.from('10000000000000000000'); // 10 tokens per block

  // Subscribe to stores
  $: farmsData = $farms;
  $: prices = $tokenPrices;
  $: weights = $farmWeights;
  $: earned = $userEarned;
  $: totalAlloc = $totalAllocPoint;
  $: wallet = $walletStore;

  async function fetchTokenPrices() {
    try {
      // Fetch PLSX and WPLS prices from CoinGecko
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=pulsechain,pulsex&vs_currencies=usd');
      const data = await response.json();
      
      const newPrices = { ...prices };
      
      if (data.pulsechain?.usd) {
        newPrices.WPLS = data.pulsechain.usd;
      }
      
      if (data.pulsex?.usd) {
        newPrices.PLSX = data.pulsex.usd;
      }
      
      // Calculate LEAN price from LEAN/WPLS pair
      await calculateLeanPrice(newPrices);
      
      tokenPrices.set(newPrices);
      console.log('Updated token prices:', newPrices);
    } catch (error) {
      console.error('Error fetching token prices from CoinGecko:', error);
    }
  }

  async function calculateLeanPrice(newPrices: TokenPrices) {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://rpc.pulsechain.com');
      const leanWplsPair = new ethers.Contract(LEAN_WPLS_PAIR, LP_TOKEN_ABI, provider);
      
      // Get reserves from LEAN/WPLS pair
      const reserves = await leanWplsPair.getReserves();
      
      // Assuming LEAN is token0 and WPLS is token1
      const leanReserve = ethers.utils.formatEther(reserves[0]);
      const wplsReserve = ethers.utils.formatEther(reserves[1]);
      
      // Calculate LEAN price in WPLS terms
      const leanPriceInWpls = parseFloat(wplsReserve) / parseFloat(leanReserve);
      
      // Calculate LEAN price in USD
      newPrices.LEAN = leanPriceInWpls * newPrices.WPLS;
      
      console.log(`LEAN/WPLS ratio: ${leanPriceInWpls}, LEAN USD price: $${newPrices.LEAN}`);
    } catch (error) {
      console.error('Error calculating LEAN price from pair:', error);
    }
  }

  async function calculatePoolStats(farm: Farm) {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://rpc.pulsechain.com');
      const lpToken = new ethers.Contract(farm.lpAddress, LP_TOKEN_ABI, provider);
      
      // Calculate TVL
      const totalLpInFarm = await lpToken.balanceOf(MASTERCHEF_ADDRESS);
      const totalSupply = await lpToken.totalSupply();
      const reserves = await lpToken.getReserves();
      
      let token0Price = 0;
      let token1Price = 0;
      
      if (farm.pair === 'LEAN-PLSX') {
        token0Price = prices.LEAN;
        token1Price = prices.PLSX;
      } else if (farm.pair === 'LIT-PLSX') {
        token0Price = prices.LIT;
        token1Price = prices.PLSX;
      } else if (farm.pair === 'LIT-LEAN') {
        token0Price = prices.LIT;
        token1Price = prices.LEAN;
      }

      const reserve0Value = parseFloat(ethers.utils.formatEther(reserves[0])) * token0Price;
      const reserve1Value = parseFloat(ethers.utils.formatEther(reserves[1])) * token1Price;
      const totalLpValue = reserve0Value + reserve1Value;

      const farmShare = totalLpInFarm.mul(ethers.BigNumber.from(1000000)).div(totalSupply).toNumber() / 1000000;
      const tvl = totalLpValue * farmShare;

      // Calculate APR
      let apr = 0;
      if (tvl > 0 && weights[farm.pair] && prices.LIT > 0) {
        const yearlyRewards = BLOCKS_PER_YEAR * parseFloat(ethers.utils.formatEther(REWARD_PER_BLOCK));
        const poolYearlyRewards = yearlyRewards * (weights[farm.pair] / 100);
        const rewardsValueUSD = poolYearlyRewards * prices.LIT;
        apr = (rewardsValueUSD / tvl) * 100;
        console.log(`APY calculation for ${farm.pair}:`, {
          tvl,
          weight: weights[farm.pair],
          litPrice: prices.LIT,
          yearlyRewards,
          poolYearlyRewards,
          rewardsValueUSD,
          apr
        });
      } else {
        console.log(`APY calculation skipped for ${farm.pair}:`, {
          tvl,
          weight: weights[farm.pair],
          litPrice: prices.LIT
        });
      }

      // Update the farm in the store
      farms.update((farmsList: Farm[]) => 
        farmsList.map((f: Farm) => 
          f.pair === farm.pair 
            ? { 
                ...f, 
                tvl, 
                apr,
                earned: earned[f.pair] ? parseFloat(earned[f.pair]) : 0
              }
            : f
        )
      );
    } catch (error) {
      console.error(`Error calculating pool stats for ${farm.pair}:`, error);
    }
  }

  async function fetchPoolWeights() {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://rpc.pulsechain.com');
      const masterChef = new ethers.Contract(MASTERCHEF_ADDRESS, MASTERCHEF_ABI, provider);
      
      const totalAlloc = await masterChef.totalAllocPoint();
      totalAllocPoint.set(totalAlloc);
      
      const newWeights: Record<string, number> = {};
      
      for (const farm of farmsData) {
        const poolInfo = await masterChef.poolInfo(farm.poolId);
        const allocPoint = poolInfo.allocPoint;
        const weight = (allocPoint.mul(1000).div(totalAlloc).toNumber()) / 10;
        newWeights[farm.pair] = weight;
      }
      
      // Set weights first
      farmWeights.set(newWeights);
      
      // Then calculate pool stats with the new weights
      for (const farm of farmsData) {
        await calculatePoolStats(farm);
      }
    } catch (error) {
      console.error('Error fetching pool weights:', error);
    }
  }

  async function fetchUserEarned() {
    if (!wallet) return;

    try {
      const provider = new ethers.providers.Web3Provider(wallet.provider);
      const masterChef = new ethers.Contract(MASTERCHEF_ADDRESS, MASTERCHEF_ABI, provider);
      const address = await provider.getSigner().getAddress();

      const newEarned: Record<string, string> = {};

      for (const farm of farmsData) {
        const pending = await masterChef.pendingTokens(farm.poolId, address);
        newEarned[farm.pair] = ethers.utils.formatEther(pending);
      }

      userEarned.set(newEarned);

      // Update farms to trigger reactivity
      farms.update((farmsList: Farm[]) => 
        farmsList.map((farm: Farm) => ({
          ...farm,
          earned: newEarned[farm.pair] ? parseFloat(newEarned[farm.pair]) : 0
        }))
      );
    } catch (error) {
      console.error('Error fetching user earned tokens:', error);
    }
  }

  // Refresh stats periodically
  let statsInterval: NodeJS.Timeout;
  let earnedInterval: NodeJS.Timeout | undefined;
  let priceInterval: NodeJS.Timeout;

  onMount(() => {
    // Initial data fetch
    fetchTokenPrices().then(() => {
      fetchPoolWeights();
    });
    
    // Set up intervals
    statsInterval = setInterval(() => {
      fetchTokenPrices().then(() => {
        fetchPoolWeights();
      });
    }, 30000); // Refresh stats every 30 seconds
    
    priceInterval = setInterval(fetchTokenPrices, 300000); // Refresh prices every 5 minutes

    return () => {
      if (statsInterval) clearInterval(statsInterval);
      if (earnedInterval) clearInterval(earnedInterval);
      if (priceInterval) clearInterval(priceInterval);
    };
  });

  // Watch wallet changes to start/stop earned tokens refresh
  $: {
    if (wallet) {
      fetchUserEarned();
      if (!earnedInterval) {
        earnedInterval = setInterval(fetchUserEarned, 30000);
      }
    } else {
      if (earnedInterval) {
        clearInterval(earnedInterval);
        earnedInterval = undefined;
      }
      userEarned.set({});
    }
  }
</script>

<div class="max-w-5xl mx-auto py-8 px-4 md:px-8 relative">
  <!-- Back Button -->
  <div class="">
    <a
      href="/"
      class="flex items-center gap-2 text-pink-300 hover:text-purple-300 transition-colors font-medium group"
    >
      <svg 
        class="w-5 h-5 transition-transform group-hover:-translate-x-1" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </a>
  </div>

  

  <div class="text-center mb-16">
    <div class="relative mb-8">
      <div class="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl"></div>
      <h1 class="relative text-6xl font-bold gradient-text mb-4">Farms</h1>
    </div>
    <div class="max-w-md mx-auto">
      <div class="flex items-center justify-center gap-3 mb-3">
        <div class="relative">
          <img 
            src={schwag} 
            alt="SCHWAG" 
            class="w-8 h-8 rounded-full border-2 border-pink-500/30"
          />
          <!-- <div class="absolute -top-0 -right-0 w-2 h-2 bg-gradient-to-r from-lime-500 to-green-500 rounded-full animate-pulse"></div> -->
        </div>
        <p class="text-white font-bold text-lg">Inflation: 10 SWAG per block</p>
      </div>
      <p class="text-pink-300 font-medium">Stake LP tokens to earn SWAG rewards</p>
    </div>
  </div>
  <!-- Orange Alert Notice -->
  <div class="mb-8 p-4 bg-orange-500/20 border border-orange-500/40 rounded-xl backdrop-blur-sm">
    <div class="flex items-center gap-3">
      <div class="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
      <p class="text-orange-200 font-medium">
        Farms are currently preview only until $BAG reaches bonding.
      </p>
    </div>
  </div>

  <div class="grid gap-4">
    {#each farmsData as farm (farm.pair)}
      <FarmCard 
        {...farm} 
        {wallet}
        weight={weights[farm.pair] || 0}
      />
    {/each}
  </div>

  <div class="text-center">
    <div class="p-6 rounded-2xl max-w-2xl mx-auto">
      <p class="text-pink-300 font-medium mb-4">Made with 💜 by BigJax
         <!-- by <a class="text-purple-300 hover:text-purple-200 transition-colors font-semibold" href="https://discord.gg/74EcvWvC7M">BagVentures</a>. -->
        </p>
      <div class="flex justify-center gap-6 text-pink-300">
        <a class="hover:text-purple-300 transition-colors font-medium flex items-center gap-2" href="https://x.com/bagventures">
          <span>🐦</span> X
        </a>
        <a class="hover:text-purple-300 transition-colors font-medium flex items-center gap-2" href="/">
          <span>📄</span> Contract
        </a>
        <a class="hover:text-purple-300 transition-colors font-medium flex items-center gap-2" href="/">
          <span>📚</span> Docs
        </a>
      </div>
    </div>
  </div>
</div>
