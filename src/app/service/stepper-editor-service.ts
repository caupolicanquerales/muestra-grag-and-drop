import { computed, Injectable, Signal } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { StepConfig } from '../reusable-component/horizontal-stepper/horizontal-stepper';
import { StepperConfig } from './stepper-service';

@Injectable({
  providedIn: 'root'
})
export class StepperEditorService {

  buildConfig(selectedNode: Signal<TreeNode | null>): Signal<StepperConfig> {
    return computed(() => {
      const node = selectedNode();

      // Only show the stepper for leaf nodes that carry data (type + label)
      if (!node?.data?.type || !node?.label) {
        return { steps: [], active: 1 };
      }

      const parentLabel = node.data.type as string;
      const childLabel  = node.label as string;

      const steps: StepConfig[] = [
        { value: 1, label: parentLabel },
        { value: 2, label: childLabel  }
      ];

      return { steps, active: 2 };
    });
  }
}
