import { PromptGenerationImageInterface } from "./prompt-generation-image-interface";
import { SyntheticDataInterface } from "./synthetic-data-interface";

export interface PromptAndDataToValidateInterface {
    prompt_imagen?: Array<PromptGenerationImageInterface>;
    prompt_datos?: Array<PromptGenerationImageInterface>;
    prompt_facturas?: Array<PromptGenerationImageInterface>;
    dato_sintético?: Array<SyntheticDataInterface>;
}