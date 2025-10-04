<script lang="ts">
  import { onMount } from 'svelte';
  import SceneMobile from '$lib/SceneMobile.svelte';
  import SceneTablet from '$lib/SceneTablet.svelte';
  import SceneDesktop from '$lib/SceneDesktop.svelte';
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
  <!-- Hero Section -->
  <section class="relative min-h-screen border-b border-pink-500/20 flex items-center justify-center overflow-hidden" style="margin-top: -80px; padding-top: 80px; padding-bottom: 100px; z-index: 0;">
    <!-- Background Image -->
    <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('https://blog.volkovlaw.com/wp-content/uploads/2023/08/FTQQ2PcaMAA5N5c-scaled.jpg');"></div>
    
    <!-- Purple overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-purple-950/95 via-violet-950/98 to-purple-900/95"></div>
    
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" style="z-index: 0;"></div> -->
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 rounded-full blur-3xl" style="z-index: 0;"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" style="z-index: 0;"></div>
    </div>

    <div class="relative max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
         <!-- mobile/tablet - 3D Model -->
         <div class="block lg:hidden relative z-10">
           <div class="flex justify-center items-center w-full relative">
             <!-- Mobile/Tablet Scene (visible on small and medium screens) -->
             <div class="block lg:hidden">
               <SceneMobile />
             </div>
            
            <!-- Tablet Scene (visible on medium screens) -->
            <!-- <div class="hidden sm:block lg:hidden">
              <SceneTablet />
            </div> -->
            
            <!-- Desktop Scene (visible on large screens) -->
            <!-- <div class="hidden lg:block">
              <SceneDesktop />
            </div> -->
          </div>
        </div>
        <!-- Left side - Content -->
        <div class="text-center lg:text-left">
          <div class="mb-8">
            <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
              <span class="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                $BAG Ventures
              </span>
            </h1>
            <p class="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed">
              Memes meet innovation like never before.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a href="/farms" class="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
            >
            Farms
            </a>
            <button 
              class="px-8 py-4 border-2 border-purple-400 text-purple-400 font-semibold rounded-xl hover:bg-purple-400 hover:text-white transition-all duration-300 transform hover:scale-105"
              on:click={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
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

          
        </div>

        <!-- Right side - 3D Model -->
        <div class="hidden sm:block relative z-10">
          <div class="flex justify-center items-center w-full :h-[500px] relative">
            <!-- Mobile Scene (visible on small screens) -->
            <!-- <div class="block sm:hidden">
              <SceneMobile />
            </div> -->
            
            <!-- Tablet Scene (visible on medium screens) -->
            <!-- <div class="hidden sm:block lg:hidden">
              <SceneTablet />
            </div> -->
            
            <!-- Desktop Scene (visible on large screens) -->
            <div class="hidden lg:block">
              <SceneDesktop />
            </div>
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
  <section class="relative py-20 px-4 sm:px-6 lg:px-8">
    <!-- Background Image -->
    <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('https://pbs.twimg.com/media/F2XznpoXkAE5c5v.jpg');"></div>
    
    <!-- Dark overlay for better text readability -->
    <div class="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95"></div>
    
    <div class="relative max-w-7xl mx-auto text-center">
      <h2 class="text-4xl font-bold text-white mb-8">
        Ready to experience the future?
      </h2>
      <p class="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
        Join forces with users who are using BAG ecosystem to build the future of DeFi.
      </p>
      <button class="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 flex items-center gap-3 mx-auto">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
        Join The Telegram
      </button>
    </div>
  </section>

   <!-- Features Section -->
   <section id="features-section" class="relative py-16 px-4 sm:px-6 lg:px-8 border-t border-b border-pink-500/20">
     <!-- Background Image -->
     <div class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60" style="background-image: url('https://w0.peakpx.com/wallpaper/692/670/HD-wallpaper-louis-vuitton-first-letter-in-black-background-louis-vuitton.jpg');"></div>
     
     <!-- Purple gradient overlay -->
     <div class="absolute inset-0 bg-gradient-to-br from-purple-950/95 via-violet-950/98 to-purple-900/95"></div>
     
     <!-- Pink lighting effects -->
     <div class="absolute inset-0 overflow-hidden pointer-events-none">
       <div class="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-pink-500/30 to-purple-500/20 rounded-full blur-3xl"></div>
       <div class="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-tl from-pink-500/30 to-purple-500/20 rounded-full blur-3xl"></div>
       <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-pink-500/20 to-purple-500/10 rounded-full blur-3xl"></div>
     </div>
     
     <div class="relative max-w-7xl mx-auto">
       <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
         <div class="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-700/40 hover:border-gray-600/70 transition-all duration-300 transform hover:scale-105">
          <div class="w-12 h-12 rounded-lg mb-4 flex items-center justify-center">
            <span class="text-white text-4xl">👀</span>
           </div>
           <h3 class="text-white font-semibold mb-3 text-lg">Vision</h3>
           <p class="text-gray-300">To build the ultimate DeFi ecosystem</p>
         </div>
         
         <div class="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-700/40 hover:border-gray-600/70 transition-all duration-300 transform hover:scale-105">
           <div class="w-12 h-12 rounded-lg mb-4 flex items-center justify-center">
             <span class="text-white text-4xl">🔒</span>
           </div>
           <h3 class="text-white font-semibold mb-3 text-lg">Secure</h3>
           <p class="text-gray-300">Launching on pump.tires, liquidity locked forever</p>
         </div>
         
         <div class="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-700/40 hover:border-gray-600/70 transition-all duration-300 transform hover:scale-105">
          <div class="w-12 h-12 rounded-lg mb-4 flex items-center justify-center">
            <span class="text-white text-4xl">🌐</span>
           </div>
           <h3 class="text-white font-semibold mb-3 text-lg">Decentralized</h3>
           <p class="text-gray-300">True decentralization at its core</p>
         </div>
       </div>
     </div>
   </section>
  <!-- Footer -->
  <footer class="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-800 to-slate-900">
    <div class="max-w-7xl mx-auto text-center">
      <p class="text-gray-300">© 2025 $BAG Ventures. All rights reserved.</p>
    </div>
  </footer>
</div>
