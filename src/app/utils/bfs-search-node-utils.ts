import { MenuItem, TreeNode } from "primeng/api";

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