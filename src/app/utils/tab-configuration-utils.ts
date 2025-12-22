
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
        TabDeletePromptCategory.SYNTHETIC];
}

export enum TabDeletePromptCategory {
  IMAGE = 'image',
  DATA = 'data',
  BILL = 'bill',
  SYNTHETIC= 'synthetic'
}

export enum TabGlobalDfectCategory {
  PRIMARY_TEXTURE = 'Primary Texture',
  LIQUID_STAIN = 'Liquid & Stain',
  COLOR_AGING = 'Color & Aging',
  ANNOTATIONS_FILING= 'Annotations & Filing'
}

/**
 * 
 * 
 * const extractData = (obj) => {
  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // If it's an object, dive deeper
      extractData(obj[key]);
    } else {
      // If it's a primitive, extract the info
      console.log(`${key}: ${obj[key]}`);
    }
  }
};
 */

/**
 * 
 * const iterativeExtract = (rootObj) => {
  const stack = [rootObj];

  while (stack.length > 0) {
    const current = stack.pop();

    for (let key in current) {
      if (typeof current[key] === 'object' && current[key] !== null) {
        stack.push(current[key]);
      } else {
        console.log(`${key}: ${current[key]}`);
      }
    }
  }
};
 */