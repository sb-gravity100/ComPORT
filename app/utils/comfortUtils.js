/**
 * Compatibility checking utilities for PC components
 */

/**
 * Check if CPU and Motherboard are compatible
 * @param {Object} cpu - CPU product
 * @param {Object} motherboard - Motherboard product
 * @returns {Object} { compatible, issues }
 */
function checkCPUMotherboardCompatibility(cpu, motherboard) {
   const issues = [];

   if (!cpu || !motherboard) {
      return { compatible: true, issues: [] };
   }

   const cpuSocket = cpu.specifications?.socket?.toLowerCase() || '';
   const mbSocket = motherboard.specifications?.socket?.toLowerCase() || '';

   if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
      issues.push(
         `Socket mismatch: CPU (${cpu.specifications.socket}) vs Motherboard (${motherboard.specifications.socket})`
      );
   }

   return {
      compatible: issues.length === 0,
      issues,
   };
}

/**
 * Check if RAM and Motherboard are compatible
 * @param {Object} ram - RAM product
 * @param {Object} motherboard - Motherboard product
 * @returns {Object} { compatible, issues }
 */
function checkRAMMotherboardCompatibility(ram, motherboard) {
   const issues = [];

   if (!ram || !motherboard) {
      return { compatible: true, issues: [] };
   }

   const ramType = ram.specifications?.memoryType?.toLowerCase() || '';
   const mbMemoryType =
      motherboard.specifications?.memoryType?.toLowerCase() || '';

   if (ramType !== mbMemoryType) {
      issues.push(
         `Memory type mismatch: RAM (${ramType.toUpperCase()}) vs Motherboard (${mbMemoryType.toUpperCase()})`
      );
   }

   return {
      compatible: issues.length === 0,
      issues,
   };
}

/**
 * Check if PSU has enough wattage for the system
 * @param {Object} parts - All bundle parts
 * @returns {Object} { compatible, issues, totalWattage, psuWattage }
 */
function checkPSUWattage(parts) {
   const issues = [];
   const warnings = [];

   let estimatedWattage = 100; // Base system

   // CPU
   if (parts.CPU) {
      const cpuTDP = parseInt(parts.CPU.specifications?.tdp) || 65;
      estimatedWattage += cpuTDP;
   }

   // GPU
   if (parts.GPU) {
      const gpuTDP = parseInt(parts.GPU.specifications?.tdp) || 150;
      estimatedWattage += gpuTDP;
   }

   // RAM (rough estimate)
   if (parts.RAM) {
      estimatedWattage += 30;
   }

   // Storage
   if (parts.Storage) {
      const isSSD = parts.Storage.specifications?.driveType
         ?.toLowerCase()
         .includes('ssd');
      estimatedWattage += isSSD ? 10 : 20;
   }

   // Add 20% headroom
   const recommendedWattage = Math.ceil(estimatedWattage * 1.2);

   // Check PSU
   const psuWattage = parseInt(parts?.PSU?.specifications?.wattage) || 500;

   if (psuWattage < estimatedWattage) {
      issues.push(
         `PSU wattage too low: ${psuWattage}W (need at least ${estimatedWattage}W)`
      );
   } else if (psuWattage < recommendedWattage) {
      warnings.push(
         `PSU wattage adequate but tight: ${psuWattage}W (recommended ${recommendedWattage}W)`
      );
   }

   return {
      compatible: issues.length === 0,
      issues,
      warnings,
      totalWattage: estimatedWattage,
      psuWattage,
      recommendedWattage,
   };
}

/**
 * Check if GPU fits in the case
 * @param {Object} gpu - GPU product
 * @param {Object} pcCase - Case product
 * @returns {Object} { compatible, issues }
 */
function checkMotherBCaseCompatibility(board, pcCase) {
   const issues = [];
   let compat = false;
   let mbTypeName = '';

   if (!board || !pcCase) {
      return { compatible: true, issues: [] };
   }

   const mbType = board.specifications?.formFactor || '';
   const caseType = pcCase.specifications?.motherboardSupport.split(', ') || [];

   if (!caseType.includes(mbType)) {
      issues.push(
         `Motherboard (${mbTypeName}) is not compatible with Case (${pcCase.compatibilityTags.join(
            ', '
         )})`
      );
   }

   return {
      compatible: issues.length === 0,
      issues,
   };
}

/**
 * Check overall bundle compatibility
 * @param {Object} parts - Object with category keys and product values
 * @returns {Object} Compatibility report
 */
export function checkCompatibility(parts) {
   const report = {
      compatible: true,
      issues: [],
      warnings: [],
      checks: {},
   };

   // CPU-Motherboard compatibility
   const cpuMBCheck = checkCPUMotherboardCompatibility(
      parts.CPU,
      parts.Motherboard
   );
   report.checks.cpuMotherboard = cpuMBCheck;
   if (!cpuMBCheck.compatible) {
      report.compatible = false;
      report.issues.push(...cpuMBCheck.issues);
   }

   // RAM-Motherboard compatibility
   const ramMBCheck = checkRAMMotherboardCompatibility(
      parts.RAM,
      parts.Motherboard
   );
   report.checks.ramMotherboard = ramMBCheck;
   if (!ramMBCheck.compatible) {
      report.compatible = false;
      report.issues.push(...ramMBCheck.issues);
   }

   // PSU wattage check
   const psuCheck = checkPSUWattage(parts);
   report.checks.psuWattage = psuCheck;
   if (!psuCheck.compatible) {
      report.compatible = false;
      report.issues.push(...psuCheck.issues);
   }
   if (psuCheck.warnings?.length > 0) {
      report.warnings.push(...psuCheck.warnings);
   }

   // GPU-Case compatibility
   const boardCaseCheck = checkMotherBCaseCompatibility(
      parts.Motherboard,
      parts.Case
   );
   report.checks.boardCase = boardCaseCheck;
   if (!boardCaseCheck.compatible) {
      report.compatible = false;
      report.issues.push(...boardCaseCheck.issues);
   }

   // Calculate compatibility score (0-100)
   const totalChecks = Object.keys(report.checks).length;
   const passedChecks = Object.values(report.checks).filter(
      (c) => c.compatible
   ).length;
   report.score =
      totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100;

   return report;
}

/**
 * Get compatibility status text and color
 * @param {number} score - Compatibility score (0-100)
 * @returns {Object} { text, color, icon }
 */
export function getCompatibilityStatus(score) {
   if (score === 100) {
      return {
         text: 'Fully Compatible',
         color: '#00e676',
         icon: 'check-circle',
      };
   }
   if (score >= 75) {
      return {
         text: 'Mostly Compatible',
         color: '#00b2d8',
         icon: 'check-circle-outline',
      };
   }
   if (score >= 50) {
      return {
         text: 'Partially Compatible',
         color: '#ffb74d',
         icon: 'warning',
      };
   }
   return {
      text: 'Incompatible',
      color: '#ef5350',
      icon: 'error',
   };
}

/**
 * Suggest improvements for compatibility issues
 * @param {Object} compatibilityReport - Report from checkCompatibility
 * @returns {Array} Array of suggestions
 */
export function getSuggestions(compatibilityReport) {
   const suggestions = [];

   if (!compatibilityReport.compatible) {
      compatibilityReport.issues.forEach((issue) => {
         if (issue.includes('Socket mismatch')) {
            suggestions.push(
               'Consider selecting a motherboard that matches your CPU socket'
            );
         } else if (issue.includes('Memory type mismatch')) {
            suggestions.push(
               "Select RAM that matches your motherboard's memory type"
            );
         } else if (issue.includes('PSU wattage too low')) {
            suggestions.push('Upgrade to a higher wattage PSU');
         } else if (issue.includes('GPU too long')) {
            suggestions.push('Choose a larger case or a more compact GPU');
         }
      });
   }

   return suggestions;
}
