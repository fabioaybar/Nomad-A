<template>
  <footer class="relative bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100 overflow-hidden">
    <!-- Animated background pattern -->
    <div class="absolute inset-0 opacity-5 dark:opacity-10">
      <div class="absolute inset-0 pattern-grid transform rotate-12 scale-150"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        <!-- Company Info -->
        <div class="col-span-1 md:col-span-5 space-y-8">
          <div class="transform hover:scale-105 transition-transform duration-300">
            <div class="flex items-center" aria-label="Nomad A Logo">
              <span class="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 leading-none select-none">Nomad</span>
              <img :src="rafLogo" alt="A" class="h-7 w-auto -ml-0.5 translate-y-[2px] filter hover:brightness-110 transition-all align-baseline" />
            </div>
          </div>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed max-w-md hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-300">
            {{ t('footer.tagline') }}
          </p>
          <div class="flex space-x-6">
            <a href="#" class="social-icon-link" aria-label="Facebook">
              <Facebook class="w-6 h-6" />
            </a>
            <a href="#" class="social-icon-link" aria-label="Twitter">
              <Twitter class="w-6 h-6" />
            </a>
            <a href="#" class="social-icon-link" aria-label="Instagram">
              <Instagram class="w-6 h-6" />
            </a>
            <a href="#" class="social-icon-link" aria-label="LinkedIn">
              <Linkedin class="w-6 h-6" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="col-span-1 md:col-span-3">
          <h3 class="footer-heading">{{ t('footer.quick_links') }}</h3>
          <ul class="mt-6 space-y-4">
            <li><RouterLink to="/vehicles" class="footer-link group">
              <span class="link-text">{{ t('nav.browse_cars') }}</span>
            </RouterLink></li>
            <li><a href="#features" class="footer-link group">
              <span class="link-text">{{ t('footer.features') }}</span>
            </a></li>
          </ul>
        </div>

        <!-- Legal -->
        <div class="col-span-1 md:col-span-4">
          <h3 class="footer-heading">{{ t('footer.support') }}</h3>
          <ul class="mt-6 space-y-4">
            <li><RouterLink to="/privacy" class="footer-link group">
              <span class="link-text">{{ t('footer.privacy') }}</span>
            </RouterLink></li>
            <li><RouterLink to="/terms" class="footer-link group">
              <span class="link-text">{{ t('footer.terms') }}</span>
            </RouterLink></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="relative border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <p class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300">
          © {{ new Date().getFullYear() }} {{ t('footer.company_name') }}. {{ t('footer.rights') }}
        </p>
        <div class="flex items-center">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            <span class="inline-block animate-pulse">❤️</span> {{ t('footer.made_with_love') }}
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-vue-next'
import { useTranslation } from '../../services/i18n'
// Use URL resolution to avoid type issues with static assets
const rafLogo = new URL('./raf.png', import.meta.url).href

const { t } = useTranslation()
</script>

<style scoped>
.pattern-grid {
  background-image: linear-gradient(currentColor 1px, transparent 1px),
    linear-gradient(to right, currentColor 1px, transparent 1px);
  background-size: 20px 20px;
}

.footer-heading {
  font-size: 1.125rem;
  font-weight: 600;
  color: rgb(17, 24, 39);
  position: relative;
  display: inline-block;
}

.dark .footer-heading {
  color: white;
}

.footer-heading::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 3rem;
  height: 0.125rem;
  background: linear-gradient(to right, rgb(37, 99, 235), rgb(79, 70, 229));
  transform: scaleX(0);
  transition: transform 0.3s;
  transform-origin: left;
}

.dark .footer-heading::after {
  background: linear-gradient(to right, rgb(96, 165, 250), rgb(129, 140, 248));
}

.footer-heading:hover::after {
  transform: scaleX(1);
}

.social-icon-link {
  color: rgb(156, 163, 175);
  position: relative;
  transition: all 0.3s;
  display: inline-block;
}

.social-icon-link:hover {
  color: rgb(17, 24, 39);
  transform: scale(1.1);
}

.dark .social-icon-link:hover {
  color: white;
}

.social-icon-link::before {
  content: '';
  position: absolute;
  inset: 0;
  background: currentColor;
  opacity: 0;
  border-radius: 9999px;
  transform: scale(1.5);
  transition: all 0.3s;
}

.social-icon-link:hover::before {
  opacity: 0.1;
  transform: scale(1);
}

.footer-link {
  display: flex;
  align-items: center;
  color: rgb(75, 85, 99);
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.dark .footer-link {
  color: rgb(156, 163, 175);
}

.footer-link:hover {
  color: rgb(17, 24, 39);
}

.dark .footer-link:hover {
  color: white;
}

.link-text {
  position: relative;
  z-index: 10;
  transition: transform 0.3s;
}

.footer-link::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgb(239, 246, 255), rgb(238, 242, 255));
  opacity: 0;
  transform: translateX(-100%);
  transition: all 0.3s;
}

.dark .footer-link::before {
  background: linear-gradient(to right, rgba(30, 58, 138, 0.1), rgba(67, 56, 202, 0.1));
}

.footer-link:hover::before {
  opacity: 1;
  transform: translateX(0);
}

.footer-link:hover .link-text {
  transform: translateX(0.25rem);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>