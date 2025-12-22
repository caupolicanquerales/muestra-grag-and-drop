export function createNewObjTab(tabs: Array<any>, obj: any, type: string){
    if(tabs.length==0){
      tabs.push(obj);
      return JSON.parse(JSON.stringify(tabs));
    }else{
      let tab= tabs.filter(item=>item?.type!=type);
      if(tab.length!=0){
        tab.push(obj);
        const newTab= JSON.stringify(tab);
        return JSON.parse(newTab);
      }
      return tabs;
    } 
}

export function sortedTabs(tabs: Array<any>, orderMap: any, numberOfTabs: number){
    if(tabs.length==numberOfTabs){
      tabs.sort((a, b) => {
      const aIndex = orderMap[a?.type];
      const bIndex = orderMap[b?.type];
      if (aIndex === undefined) return 1;
      if (bIndex === undefined) return -1;
      return aIndex - bIndex;
      });
    }
    return tabs;
  }