import { ToastMessageOptions } from "primeng/api";


export function getToastMessageOption(state: string, detail: string): ToastMessageOptions{
    return {
      severity: state,
      detail: detail,
      life: 5000
    }
}