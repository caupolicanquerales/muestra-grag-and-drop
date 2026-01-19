import { BasicTemplateInterface } from "../models/basic-template-interface";

export function getBasicTemplateInterfaceFromEvent(event: any): BasicTemplateInterface {
  return {
    id: event?.id ?? null,
    htmlString: "",
    cssString: "",
    name: ""
  };
}

export function composeHtmlCssTemplate(data: any): string {
  const css = data?.["cssString"] ?? "";
  const html = data?.["htmlString"] ?? "";
  return `<style>${css}</style>${html}`;
}
