<script lang="ts">
  import { onMount } from 'svelte';
  import Onboard from '@web3-onboard/core';
  import injectedModule from '@web3-onboard/injected-wallets';
  import schwepe from '$lib/images/schwepe.png';
  import schwag from '$lib/images/schwag.png';

  export let wallet: any;
  export let onboard: any;

  let connecting = false;
  let wrongNetwork = false;

  const PULSECHAIN_ID = '0x171';

  async function checkNetwork() {
    if (!wallet) return;
    
    const chainId = wallet.chains[0].id;
    wrongNetwork = chainId !== PULSECHAIN_ID;
    
    if (wrongNetwork) {
      try {
        await onboard.setChain({ chainId: PULSECHAIN_ID });
        wrongNetwork = false;
      } catch (error) {
        console.error('Failed to switch network:', error);
      }
    }
  }

  async function connectWallet() {
    connecting = true;
    try {
      const wallets = await onboard.connectWallet();
      if (wallets[0]) {
        wallet = wallets[0];
        await checkNetwork();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
    connecting = false;
  }

  // Subscribe to chain changes
  $: if (wallet) {
    wallet.provider.on('chainChanged', () => {
      checkNetwork();
    });
  }

  onMount(() => {
    return () => {
      if (wallet?.provider) {
        wallet.provider.removeAllListeners();
      }
    };
  });
</script>

<nav class="py-4 px-6 shadow-lg border-b border-pink-500/20 relative z-50" style="background: rgba(45, 27, 105, 0.3);">
  <div class="max-w-7xl mx-auto flex justify-between items-center">
    <div class="flex items-center">
      <div class="relative">
        <img src={schwag} alt="Logo" class="h-10 w-10 rounded-full border-2 border-pink-500/30" />
        <div class="absolute -top-0 -right-0 w-3 h-3 bg-gradient-to-r from-green-500 to-lime-500 rounded-full animate-pulse"></div>
      </div>
      <span class="ml-3 text-2xl font-bold gradient-text">$BAG</span>
    </div>
    
    {#if wrongNetwork}
      <div class="flex items-center">
        <span class="text-pink-300 mr-4 font-medium">Wrong Network</span>
        <button
          class="btn-primary"
          on:click={checkNetwork}
        >
          Switch to PulseChain
        </button>
      </div>
    {:else}
      <button
        class="btn-primary {connecting ? 'opacity-75 cursor-not-allowed' : ''}"
        on:click={connectWallet}
        disabled={connecting}
      >
        {#if connecting}
          <div class="flex items-center">
            <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            Connecting...
          </div>
        {:else if wallet}
          <div class="flex items-center">
            <div class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            {wallet.accounts[0].address.slice(0, 6)}...{wallet.accounts[0].address.slice(-4)}
          </div>
        {:else}
          <div class="flex items-center">
            Connect Wallet
          </div>
        {/if}
      </button>
    {/if}
  </div>
</nav>