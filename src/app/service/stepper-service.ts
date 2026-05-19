import { computed, Injectable, Signal } from '@angular/core';
import { StepConfig } from '../horizontal-stepper/horizontal-stepper';

export interface StepperConfig {
  steps: StepConfig[];
  active: number;
}

@Injectable({
  providedIn: 'root'
})
export class StepperService {

  buildConfig(
    hasBasicTemplate: Signal<boolean>,
    hasSyntheticData: Signal<boolean>,
    hasPublicityData: Signal<boolean>
  ): Signal<StepperConfig> {
    return computed(() => {
      const hasTpl  = hasBasicTemplate();
      const hasSynt = hasSyntheticData();
      const hasPub  = hasPublicityData();

      // ── Con publicidad ──────────────────────────────────────────────────
      // SINT + PUB + TPL → all done, generate
      if (hasTpl && hasSynt && hasPub) {
        return {
          steps: [
            { value: 1, label: 'Template Básico' },
            { value: 2, label: 'Dato Sintético' },
            { value: 3, label: 'Dato Publicidad' },
            { value: 4, label: 'Genera' }
          ],
          active: 4
        };
      }
      // SINT + PUB, missing TPL → warning on last pending step
      if (hasSynt && hasPub && !hasTpl) {
        return {
          steps: [
            { value: 1, label: 'Dato Sintético' },
            { value: 2, label: 'Dato Publicidad' },
            { value: 3, label: 'Template Básico', warning: true }
          ],
          active: 3
        };
      }
      // TPL + PUB
      if (hasTpl && hasPub) {
        return {
          steps: [
            { value: 1, label: 'Template Básico' },
            { value: 2, label: 'Dato Publicidad' },
            { value: 3, label: 'Genera' }
          ],
          active: 3
        };
      }
      // Only PUB
      if (hasPub && !hasSynt && !hasTpl) {
        return {
          steps: [
            { value: 1, label: 'Dato Publicidad' },
            { value: 2, label: 'Genera' }
          ],
          active: 2
        };
      }

      // ── Sin publicidad ───────────────────────────────────────────────────
      if (hasTpl && hasSynt) {
        return {
          steps: [
            { value: 1, label: 'Template Básico' },
            { value: 2, label: 'Dato Sintético' },
            { value: 3, label: 'Genera' }
          ],
          active: 3
        };
      }
      if (hasTpl) {
        return {
          steps: [
            { value: 1, label: 'Template Básico' },
            { value: 2, label: 'Genera' }
          ],
          active: 2
        };
      }
      if (hasSynt) {
        return {
          steps: [
            { value: 1, label: 'Dato Sintético' },
            { value: 2, label: 'Genera' }
          ],
          active: 2
        };
      }
      // Default — nothing selected
      return {
        steps: [
          { value: 1, label: 'Template Básico' },
          { value: 2, label: 'Genera' }
        ],
        active: 1
      };
    });
  }
}
