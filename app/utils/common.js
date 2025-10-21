export function camelToTitle(str) {
   return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (c) => c.toUpperCase())
      .trim();
}
export function toTitleCaseWithAcronyms(
   input,
   acronyms = ['GPU', 'TDP', 'VRAM', 'RAM']
) {
   return input
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Split camelCase into words
      .split(/[\s_]+/) // Split by space or underscore
      .map((word) => {
         const upperWord = word.toUpperCase();
         const matchedAcronym = acronyms.find(
            (acronym) => acronym === upperWord
         );
         return matchedAcronym || word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
}

// Examples:
console.log(toTitleCaseWithAcronyms('gpuTempMonitor')); // GPU Temp Monitor
console.log(toTitleCaseWithAcronyms('vramUsageStats')); // VRAM Usage Stats
console.log(toTitleCaseWithAcronyms('ramSpeedTest')); // RAM Speed Test
console.log(toTitleCaseWithAcronyms('tdpLimitExceeded')); // TDP Limit Exceeded
console.log(toTitleCaseWithAcronyms('gpuVRAMTempMonitor')); // GPU VRAM Temp Monitor
