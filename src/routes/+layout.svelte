<script lang="ts">
  import '../app.css';
  import Navbar from '$lib/Navbar.svelte';
  import { Toaster } from 'svelte-french-toast';
  import { onMount } from 'svelte';
  import Onboard from '@web3-onboard/core';
  import injectedModule from '@web3-onboard/injected-wallets';
  import { walletStore } from '$lib/stores/wallet';

  let wallet: any = null;

  const injected = injectedModule();
  const onboard = Onboard({
    wallets: [injected],
    chains: [
      {
        id: '0x171',
        token: 'PLS',
        label: 'PulseChain',
        rpcUrl: 'https://rpc.pulsechain.com'
      }
    ],
    appMetadata: {
      name: 'LEAN Farm',
      icon: 'https://www.gopulsechain.com/files/LogoVector.svg',
      description: 'LEAN Farming Interface'
    }
  });

  onMount(() => {
    onboard.state.select('wallets').subscribe((wallets) => {
      if (wallets.length > 0) {
        wallet = wallets[0];
        walletStore.set(wallet);
      } else {
        wallet = null;
        walletStore.set(null);
      }
    });
  });
</script>

<Toaster />
<div class="min-h-screen">
  <Navbar {wallet} {onboard} />
  
  <main class="relative">
    <!-- Background decorative elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
    </div>
    
    <slot />
  </main>
</div>
