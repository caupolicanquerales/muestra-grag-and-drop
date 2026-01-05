
export function getConfigurationTabGlobalDefect(){
    return [{
      category:TabGlobalDfectCategory.PRIMARY_TEXTURE,
      title:"Textura primaria"
    },{
      category:TabGlobalDfectCategory.LIQUID_STAIN,
      title:"Líquido y mancha"
    },{
      category:TabGlobalDfectCategory.COLOR_AGING,
      title:"Color y desgaste"
    },
    {
      category:TabGlobalDfectCategory.ANNOTATIONS_FILING,
      title:"Anotaciones y marcas"
    }
  ];
}

export function getConfigurationTabDeletePrompt(){
    return [TabDeletePromptCategory.IMAGE,
        TabDeletePromptCategory.DATA,
        TabDeletePromptCategory.BILL,
        TabDeletePromptCategory.SYSTEM,
        TabDeletePromptCategory.SYNTHETIC];
}

export function getDeletePromptTabName(){
    return{
      [TabDeletePromptCategory.IMAGE]:"Prompt imagen",
      [TabDeletePromptCategory.DATA]:"Prompt dato",
      [TabDeletePromptCategory.BILL]:"Prompt factura",
      [TabDeletePromptCategory.SYSTEM]:"Prompt sistema",
      [TabDeletePromptCategory.SYNTHETIC]:"Dato sintético"
    }
}

export function getHeaderDialogTitle(){
    return{
      [TabDeletePromptCategory.IMAGE]:"Esta por eliminar un prompt imagen",
      [TabDeletePromptCategory.DATA]:"Esta por eliminar un prompt dato",
      [TabDeletePromptCategory.BILL]:"Esta por eliminar un prompt factura",
      [TabDeletePromptCategory.SYSTEM]:"Esta por eliminar un prompt sistema",
      [TabDeletePromptCategory.SYNTHETIC]:"Esta por eliminar un dato sintético"
    }
}

export enum TabDeletePromptCategory {
  IMAGE = 'image',
  DATA = 'data',
  BILL = 'bill',
  SYNTHETIC= 'synthetic',
  SYSTEM= 'system'
}

export enum TabGlobalDfectCategory {
  PRIMARY_TEXTURE = 'Primary Texture',
  LIQUID_STAIN = 'Liquid & Stain',
  COLOR_AGING = 'Color & Aging',
  ANNOTATIONS_FILING= 'Annotations & Filing'
}