<script lang="ts">
  import { onMount } from 'svelte';
  import Scene from '$lib/Scene.svelte';
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
  <!-- Hero Section -->
  <section class="relative min-h-screen border-b border-pink-500/20 flex items-center justify-center overflow-hidden" style="margin-top: -80px; z-index: 0;">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" style="z-index: 0;"></div> -->
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 rounded-full blur-3xl" style="z-index: 0;"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" style="z-index: 0;"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Left side - Content -->
        <div class="text-center lg:text-left">
          <div class="mb-8">
            <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
              <span class="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                BAG
              </span>
            </h1>
            <p class="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed">
              Experience innovation like never before.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a href="/farms" class="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
            >
            Farms
            </a>
            <button class="px-8 py-4 border-2 border-purple-400 text-purple-400 font-semibold rounded-xl hover:bg-purple-400 hover:text-white transition-all duration-300 transform hover:scale-105">
              Learn More
            </button>
          </div>

          <!-- Social Links -->
          <div class="flex gap-4 justify-center lg:justify-start mt-6">
            <a 
              href="https://x.com/pls_lean" 
              target="_blank" 
              rel="noopener noreferrer"
              class="w-12 h-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-700/70 hover:border-gray-600/70 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-gray-500/25 group"
            >
              <svg class="w-6 h-6 text-gray-300 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            
            <a 
              href="https://t.me/pls_lean" 
              target="_blank" 
              rel="noopener noreferrer"
              class="w-12 h-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-700/70 hover:border-gray-600/70 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-gray-500/25 group"
            >
              <svg class="w-6 h-6 text-gray-300 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
          </div>

          <!-- Features preview -->
          <div class="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div class="text-left">
              <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mb-3 flex items-center justify-center">
                <span class="text-white text-xl">👀</span>
              </div>
              <h3 class="text-white font-semibold mb-2">Vision</h3>
              <p class="text-gray-400 text-sm">To build the ultimate DeFi ecosystem</p>
            </div>
            <div class="text-left">
              <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mb-3 flex items-center justify-center">
                <span class="text-white text-xl">🔒</span>
              </div>
              <h3 class="text-white font-semibold mb-2">Secure</h3>
              <p class="text-gray-400 text-sm">Launching on pump.tires, liquidity locked forever</p>
            </div>
            <div class="text-left">
              <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mb-3 flex items-center justify-center">
                <span class="text-white text-xl">🌐</span>
              </div>
              <h3 class="text-white font-semibold mb-2">Decentralized</h3>
              <p class="text-gray-400 text-sm">True decentralization at its core</p>
            </div>
          </div>
        </div>

        <!-- Right side - 3D Model -->
        <div class="relative z-10">
          <div class="w-full h-96 lg:h-[500px] relative">
            <Scene />
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <div class="w-6 h-10 border-2 border-purple-400 rounded-full flex justify-center">
        <div class="w-1 h-3 bg-purple-400 rounded-full mt-2 animate-pulse"></div>
      </div>
    </div>
  </section>

  <!-- Additional sections can be added here -->
  <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <div class="max-w-7xl mx-auto text-center">
      <h2 class="text-4xl font-bold text-white mb-8">
        Ready to experience the future?
      </h2>
      <p class="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
        Join forces with users who are using BAG ecosystem to build the future of DeFi.
      </p>
      <button class="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
        Join The Telegram
      </button>
    </div>
  </section>
</div>
