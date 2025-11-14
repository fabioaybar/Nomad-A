<template>
  <!-- TEMP PARALLAX HERO: Remove this component and its usage in HomePage.vue to disable -->
  <section class="parallax-hero relative w-full" role="img" aria-label="Animated driving car background">
    <div class="country-wrap">
      <div class="sun"></div>
      <div class="grass"></div>
      <div class="street">
        <div class="car">
          <div class="car-body">
            <div class="car-top-back">
              <div class="back-curve"></div>
            </div>
            <div class="car-gate"></div>
            <div class="car-top-front">
              <div class="wind-sheild"></div>
            </div>
            <div class="bonet-front"></div>
            <div class="stepney"></div>
          </div>
          <div class="boundary-tyre-cover">
            <div class="boundary-tyre-cover-back-bottom"></div>
            <div class="boundary-tyre-cover-inner"></div>
          </div>
          <div class="tyre-cover-front">
            <div class="boundary-tyre-cover-inner-front"></div>
          </div>
          <div class="base-axcel"></div>
          <div class="front-bumper"></div>
          <div class="tyre">
            <div class="gap"></div>
          </div>
          <div class="tyre front">
            <div class="gap"></div>
          </div>
          <div class="car-shadow"></div>
        </div>
      </div>
      <div class="street-stripe"></div>
      <div class="hill"></div>
    </div>

    <!-- Overlay content slot -->
    <div class="absolute inset-0 flex items-center justify-center px-4 pt-8 md:pt-0">
      <div class="relative z-20 w-full max-w-7xl mx-auto">
        <slot />
      </div>
    </div>
    <!-- subtle dark gradient for text legibility -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10 pointer-events-none z-10"></div>
  </section>
</template>

<script setup lang="ts">
// No script needed for static parallax layers
</script>

<style scoped>
.parallax-hero {
  position: relative;
  min-height: 54vh;
  max-height: 720px;
  overflow: hidden;
  /* Cyan-forward sky gradient */
  background: linear-gradient(180deg, #06b6d4 0%, #22d3ee 40%, #67e8f9 70%, #e0f2fe 100%);
  background-size: 400% 400%;
  animation: sky-shift 30s ease infinite;
}

@media (max-width: 768px) {
  .parallax-hero {
    min-height: 40vh;
  }
}

.country-wrap {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(180deg, #06b6d4 0%, #22d3ee 40%, #67e8f9 70%, #e0f2fe 100%);
  background-size: 400% 400%;
  animation: sky-shift 30s ease infinite;
}

@keyframes sky-shift {
  0% { background-position: 50% 0%; }
  50% { background-position: 50% 100%; }
  100% { background-position: 50% 0%; }
}

/* Dark mode variant for hero sky */
:host(.dark) .parallax-hero,
:host(.dark) .country-wrap {
  background: linear-gradient(180deg, #0b1020 0%, #111827 50%, #1f2937 80%, #0f172a 100%);
}
.dark .parallax-hero,
.dark .country-wrap {
  background: linear-gradient(180deg, #0b1020 0%, #111827 50%, #1f2937 80%, #0f172a 100%);
}

.sun {
  background: #ffd166;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 0 50px rgba(255, 209, 102, 0.7);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 320px;
}

@media (max-width: 768px) {
  .sun {
    bottom: 260px;
  }
}

.grass {
  height: 40px;
  width: 100%;
  background-color: #dbcac2;
  position: absolute;
  bottom: 60px;
}
.grass:before {
  position: absolute;
  content: '';
  top: 14px;
  left: 0;
  height: 8px;
  width: 100%;
  background-color: #b99f93;
}
.grass:after {
  position: absolute;
  content: '';
  top: -4px;
  left: 0;
  width: 100%;
  height: 8px;
  background-color: #0aa;
  background: linear-gradient(135deg, transparent 25%, #0aa 25%);
  background-size: 10px 10px;
}

.street {
  background: #7a7a7a;
  height: 80px;
  width: 102%;
  position: absolute;
  bottom: 0;
  left: -1%;
  box-shadow: 0 1px 16px rgba(111, 35, 51, 0.4) inset;
}
.street:after {
  content: '';
  display: block;
  position: absolute;
  width: 100%;
  height: 10px;
  background: #cdbcb4;
  bottom: 0;
  border-bottom: 3px solid #72625a;
  z-index: 1;
}
.street:before {
  content: '';
  display: block;
  position: absolute;
  width: 100%;
  height: 7px;
  background: #c2a99d;
  bottom: -7px;
  z-index: 1;
}

.street-stripe {
  background: #d4d4d4;
  height: 8px;
  width: 100px;
  position: absolute;
  bottom: 44px;
  border-radius: 2px;
  box-shadow: 200px 0 0 #d4d4d4, 400px 0 0 #d4d4d4, 600px 0 0 #d4d4d4, 800px 0 0 #d4d4d4, 1000px 0 0 #d4d4d4, 1200px 0 0 #d4d4d4, 1400px 0 0 #d4d4d4, 1600px 0 0 #d4d4d4, 1800px 0 0 #d4d4d4, 2000px 0 0 #d4d4d4;
}

.hill {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 250px;
  border-top-right-radius: 160%;
  border-top-left-radius: 100%;
  background-color: #adde60;
  z-index: -1;
}
.hill:after {
  content: '';
  position: absolute;
  bottom: -100px;
  right: -400px;
  width: 120%;
  height: 110%;
  border-top-right-radius: 100%;
  border-top-left-radius: 0%;
  background-color: #94c943;
  transform: rotate(-12deg);
  box-shadow: 0 0 25px #cbf191 inset;
}
.hill:before {
  background-color: #93cc3a;
  border-top-left-radius: 0;
  border-top-right-radius: 100%;
  bottom: -70px;
  content: '';
  height: 110%;
  left: -54px;
  position: absolute;
  transform: rotate(4deg);
  width: 120%;
}

/* Car and animation */
.car {
  position: absolute;
  top: -35%;
  z-index: 10;
  animation: drive 10s linear infinite;
}
@keyframes drive {
  0%   { left: -25%; }
  100% { left: 100%; }
}

.tyre {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #3f3f40;
  position: absolute;
  z-index: 2;
  left: 9px;
  top: 20px;
  animation: tyre-rotate 1s infinite linear;
}
@keyframes tyre-rotate {
  from { transform: rotate(-360deg); }
  to { transform: rotate(0deg); }
}
.tyre:before {
  content: '';
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #bdc2bd;
  position: absolute;
  top: 5px;
  left: 5px;
}
.gap {
  background: #3f3f40;
  width: 2px;
  height: 4px;
  position: absolute;
  left: 14px;
  top: 8px;
  box-shadow: 0 9px 0 #3f3f40;
}
.gap:before {
  content: '';
  display: block;
  width: 2px;
  height: 4px;
  position: absolute;
  background: #3f3f40;
  box-shadow: 0 12px 0 #3f3f40;
  transform: rotate(-90deg);
  transform-origin: 0 7px;
  z-index: 3;
}
.tyre.front { left: 94px; }

.car-body {
  border-bottom: 24px solid #d1352b;
  height: 0;
  top: 10px;
  width: 120px;
  position: relative;
}
.car-body:before {
  content: '';
  display: inline-block;
  width: 30px;
  height: 24px;
  position: absolute;
  right: -5px;
  background: #d1352b;
  border-top-right-radius: 4px;
  z-index: 1;
}
.car-body:after {
  content: '';
  display: inline-block;
  width: 121px;
  border-bottom: 1px solid #942b25;
  border-right: 2px solid transparent;
  height: 0;
  z-index: 2;
  position: absolute;
}
.car-gate {
  width: 32px;
  height: 20px;
  background: #d1352b;
  border-radius: 0 0 2px 8px / 0 0 2px 8px;
  box-shadow: 0 0 0 1px #892924;
  position: absolute;
  left: 48px;
}
.car-gate:before {
  content: '';
  width: 8px;
  height: 2px;
  background: #4c4b4b;
  position: absolute;
  top: 2px;
  left: 4px;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
}
.car-top-back {
  background: #4C4B4B;
  border-radius: 5px 0 0 0;
  height: 20px;
  left: 4px;
  position: absolute;
  top: -20px;
  width: 58px;
}
.car-top-back:before {
  width: 30px;
  height: 15px;
  background: #736f6f;
  content: '';
  position: absolute;
  top: 3px;
  left: 8px;
  border-radius: 2px;
}
.car-top-back:after {
  content: '';
  background: #4c4b4b;
  border-radius: 30%;
  height: 5px;
  left: 3px;
  position: absolute;
  top: -1px;
  width: 62px;
}
.car-top-front {
  top: -19px;
  position: absolute;
  left: 47px;
  width: 20px;
  height: 20px;
  background: #dc4630;
  border-left: 1px solid #892924;
  border-radius: 2px 0 0 0;
}
.car-top-front:after {
  width: 26px;
  height: 20px;
  transform: skew(37deg);
  background: #dc4630;
  content: '';
  position: absolute;
  top: 0;
  left: 6px;
  border-radius: 4px 0 4px 4px;
}
.car-top-front:before {
  width: 12px;
  height: 5px;
  background: #dc4630;
  content: '';
  position: absolute;
  top: 14px;
  left: 28px;
  z-index: 1;
  border: solid #a82e27;
  border-width: 0 1px 1px 0;
}
.wind-sheild {
  top: 3px;
  left: 3px;
  position: absolute;
  z-index: 3;
  width: 18px;
  height: 12px;
  background: #f5e7e7;
  border-radius: 0 3px 0 0;
}
.wind-sheild:after {
  width: 12px;
  height: 12px;
  transform: skew(25deg);
  background: #f5e7e7;
  content: '';
  position: absolute;
  top: 0;
  left: 10px;
  border-radius: 3px;
}
.boundary-tyre-cover {
  position: absolute;
  top: 14px; left: 10px;
  border-bottom: 20px solid #4c4b4b;
  border-right: 10px solid transparent;
  height: 0;
  width: 20px;
}
.boundary-tyre-cover:before {
  content: '';
  position: absolute;
  display: inline-block;
  background: #4c4b4b;
  height: 20px;
  width: 15px;
  transform: skewX(-20deg);
  border-radius: 3px;
  left: -6px;
  top: 0;
}
.boundary-tyre-cover:after {
  content: '';
  position: absolute;
  display: inline-block;
  background: #4c4b4b;
  height: 20px;
  width: 20px;
  transform: skewX(40deg);
  border-radius: 3px;
  right: -14px;
  top: 0;
}
.boundary-tyre-cover-inner {
  position: absolute;
  top: 4px; left: 4px;
  border-bottom: 16px solid black;
  border-right: 10px solid transparent;
  height: 0;
  width: 15px;
  z-index: 2;
}
.boundary-tyre-cover-inner:before {
  content: '';
  position: absolute;
  display: inline-block;
  background: black;
  height: 16px;
  width: 15px;
  transform: skewX(-20deg);
  border-radius: 3px 3px 0 0;
  left: -6px;
  top: 0;
}
.boundary-tyre-cover-inner:after {
  content: '';
  position: absolute;
  display: inline-block;
  background: black;
  height: 16px;
  width: 20px;
  transform: skewX(40deg);
  border-radius: 3px 3px 0 0;
  right: -11px;
  top: 0;
}
.boundary-tyre-cover-back-bottom {
  position: absolute;
  width: 14px;
  height: 8px;
  background: #4c4b4b;
  top: 12px;
  left: -19px;
}
.bonet-front {
  background: #d1352b;
  border-radius: 5px 258px 0 38px / 36px 50px 0 0;
  height: 4px;
  position: absolute;
  right: 0;
  top: -4px;
  width: 40px;
  z-index: 0;
}
.back-curve {
  background: #4C4B4B;
  border-radius: 960% 100% 0 0;
  height: 20px;
  left: -3px;
  position: absolute;
  top: 1px;
  transform: rotate(6deg);
  width: 5px;
}
.stepney {
  height: 6px;
  left: -4px;
  position: absolute;
  top: 6px;
  width: 8px;
  z-index: -1;
  background: #3f3f40;
}
.stepney:before {
  width: 8px;
  height: 12px;
  background: #3f3f40;
  content: '';
  position: absolute;
  top: -10px;
  left: -7px;
  border-radius: 3px 3px 0 0;
}
.stepney:after {
  width: 8px;
  height: 12px;
  background: #0d0c0d;
  content: '';
  position: absolute;
  top: 0px;
  left: -7px;
  border-radius: 0 0 3px 3px;
}
.tyre-cover-front {
  background: #4c4b4b;
  height: 4px;
  left: 97px;
  position: absolute;
  top: 13px;
  width: 22px;
  z-index: 1;
}
.tyre-cover-front:before {
  background: #4c4b4b;
  content: '';
  display: inline-block;
  height: 21px;
  left: -10px;
  position: absolute;
  top: 0;
  transform: skewX(-30deg);
  width: 10px;
  z-index: 6;
  border-radius: 4px 0 0 0;
}
.tyre-cover-front:after {
  background: #4c4b4b;
  content: '';
  display: inline-block;
  height: 6px;
  left: 14px;
  position: absolute;
  top: 0;
  transform: skewX(30deg);
  width: 17px;
  z-index: 6;
  border-radius: 0 4px 2px 0;
}
.boundary-tyre-cover-inner-front {
  position: absolute;
  top: 4px; left: 4px;
  border-bottom: 16px solid black;
  border-right: 10px solid transparent;
  height: 0;
  width: 15px;
  z-index: 7;
}
.boundary-tyre-cover-inner-front:before {
  background: #000000;
  border-radius: 3px 3px 0 0;
  content: '';
  display: inline-block;
  height: 17px;
  left: -10px;
  position: absolute;
  top: 0;
  transform: skewX(-30deg);
  width: 15px;
}
.boundary-tyre-cover-inner-front:after {
  content: '';
  position: absolute;
  display: inline-block;
  background: black;
  height: 16px;
  width: 20px;
  transform: skewX(25deg);
  border-radius: 3px 3px 0 0;
  right: -12px;
  top: 0;
}
.base-axcel {
  background: black;
  bottom: -15px;
  height: 10px;
  left: 30px;
  position: absolute;
  transform: rotate(-2deg);
  width: 70px;
  z-index: -1;
}
.base-axcel:before {
  background: black;
  border-radius: 0 0 0 10px / 0 0 0 5px;
  content: '';
  height: 10px;
  left: -35px;
  position: absolute;
  top: -2px;
  transform: rotate(6deg);
  width: 30px;
}
.base-axcel:after {
  background: black;
  border-radius: 0 0 0 10px / 0 0 0 5px;
  content: '';
  height: 10px;
  right: -33px;
  position: absolute;
  top: -1px;
  transform: rotate(-4deg);
  width: 40px;
  border-radius: 0 10px 5px 0;
}
.front-bumper {
  background: #4c4b4b;
  border-radius: 0 2px 2px 0;
  height: 8px;
  position: absolute;
  right: -15px;
  width: 11px;
  z-index: 1;
  transform: rotate(-5deg);
}
.front-bumper:before {
  background: #000000;
  content: '';
  height: 10px;
  left: -7px;
  position: absolute;
  transform: rotate(-22deg);
  width: 9px;
  z-index: 1;
}
.car-shadow {
  background: rgba(0, 0, 0, 0);
  bottom: -15px;
  box-shadow: -5px 10px 15px 3px #000000;
  left: -7px;
  position: absolute;
  width: 136px;
}
</style>


