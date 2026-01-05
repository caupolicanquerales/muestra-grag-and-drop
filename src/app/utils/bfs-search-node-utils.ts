import { MenuItem, TreeNode } from "primeng/api";
import { TypePromptEnum } from "../enums/type-prompt-enum";

export function bfsSearchNodeToInsertFunctionCommand(root: any, handlerFunction: any, prompts: MenuItem[], promptLabel: string): MenuItem[] {
      if (!root) {
          return [];
      }
      const queue = [root];
      while (queue.length > 0) {
          const currentNode = queue.shift();
          currentNode['command']=handlerFunction;
          if(currentNode['label']==promptLabel){
            currentNode['items']= prompts;
          }
          if (currentNode.items && Array.isArray(currentNode.items)) {
              for (const child of currentNode.items) {
                  child['parent']=currentNode['label']
                  child['grandParent']=currentNode['parent']
                  queue.push(child);
              }
          }
      }
      return root['items'];
}

export function searchNodeToDisableNode(tree: any[], nodeNames: Array<string>): MenuItem[] {
      if (!tree) {
          return [];
      }
      let dimension= tree[0]?.children?.length;
      if(dimension!=undefined){
        for(let i=0;i<dimension;i++){
            if(nodeNames.includes(tree[0]['children'][i]['label'])){
                tree[0]['children'][i]['style']= {'color':'red'};
                tree[0]['children'][i]['collapsedIcon']="pi pi-ban";
                tree[0]['children'][i]['selectable']=false;
                tree[0]['children'][i]['children']=[];
            }
        }
      }
    return tree;
}

export function removeNodeChild(tree: any[], key: string): MenuItem[] {
      if (!tree) {
          return [];
      }
      let children= tree[0]?.children;
      if(children!=undefined){
        let newChildren= children.filter((child: MenuItem)=>child?.['key']!=key);
        tree[0]['children']= newChildren;
      }
    return tree;
}

export function orderChildren(children:any, orderMap: any){
      children.sort((a:any, b:any) => {
        const aIndex = orderMap[a?.key];
        const bIndex = orderMap[b?.key];
        if (aIndex === undefined) return 1;
        if (bIndex === undefined) return -1;
        return aIndex - bIndex;
      });
    return children;
}

export function orderOtherPrompts(){
    return [TypePromptEnum.BILL_PROMPT,
        TypePromptEnum.IMAGE_PROMPT,
        TypePromptEnum.SYSTEM_PROMPT,
        ,TypePromptEnum.SYNTHETIC_DATA,
        TypePromptEnum.DATA_PROMPT,
        TypePromptEnum.GLOBAL_DEFECT_PROMPT,
      TypePromptEnum.BASIC_TEMPLATE];
}

export function getMapOrder(array: Array<any>){
  let orderMap: any = {};
  array.forEach((name, index) => {orderMap[name] = index;});
  return orderMap;
}