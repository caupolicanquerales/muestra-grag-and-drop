import { TreeNode } from "primeng/api";
import { PromptGenerationImageInterface } from "../models/prompt-generation-image-interface";
import { SyntheticDataInterface } from "../models/synthetic-data-interface";
import { orderChildren, removeNodeChild, searchNodeToDisableNode } from "./bfs-search-node-utils";
import { BasicTemplateInterface } from "../models/basic-template-interface";
import { TypePromptEnum } from "../enums/type-prompt-enum";

export function buildMainNode(label:string, expanded?: boolean): TreeNode{
    return {
        key: label,
        label: label,
        expandedIcon: 'pi pi-folder-open',
        collapsedIcon: 'pi pi-folder',
        expanded: expanded,
        children: [],
    }
}

export function getMainNode(label: string, type: string, array: Array<any>):TreeNode{
    let mainNode= buildMainNode(label);
    let children= array.map(item=> childNode(item.name, type, item?.['prompt'] || item?.['data'] || item));
    mainNode.children=children;
    return mainNode;
}

function childNode(label:string, type: string, data: any): TreeNode{
    return {
        key: label,
        label: label,
        icon: 'pi pi-align-justify',
        data: {
            type: type,
            data: data
        }
    }
}

export function setChildInTree(treeInit:TreeNode[], backUpTree: string, typePrompt: string,  
    data: Array<PromptGenerationImageInterface> | Array<SyntheticDataInterface> | Array<BasicTemplateInterface>,
    orderPrompt: any){
    let initialTree= backUpTree==''?treeInit:JSON.parse(backUpTree);
    let tree= removeNodeChild(initialTree,typePrompt);
    let treeWithChild= setChildrenInTreeNode(tree, typePrompt, typePrompt, data);
    const children = orderChildren(treeWithChild[0].children, orderPrompt);
    treeWithChild.children= children;
    return JSON.stringify(treeWithChild);
}

function setChildrenInTreeNode(tree: TreeNode[],label: string, type: string, 
    data: Array<PromptGenerationImageInterface> | Array<SyntheticDataInterface> | Array<BasicTemplateInterface>){
    let mother= tree[0];
    let mainNode= getMainNode(label,type,data);
    mother.children?.push(mainNode);
    return removeCircularDependency([mother]);
}

function removeCircularDependency(tree: any){
    let backup= JSON.stringify(tree, (key, value) => {
        if (key === 'parent') return undefined;
        return value;
    });
    return JSON.parse(backup);
}


export function disablePrompts(tree: TreeNode[], promptOption: string,amountTypePrompts: number){
    if(tree[0].children?.length== amountTypePrompts){
        const prompts= getPromptsToDisable(promptOption);
        return setDisableNodeInTree(tree, prompts); 
    }
    return tree;
}

function getPromptsToDisable(promptOption: string){
    if(promptOption==promptOptions[0]){
        return [...[TypePromptEnum.PUBLICITY_DATA,TypePromptEnum.SYSTEM_PROMPT],...typeBasePrompts];
    }else if(promptOption==promptOptions[1]){   
        return [...[TypePromptEnum.PUBLICITY_DATA,TypePromptEnum.DATA_PROMPT],...typeBasePrompts];
    }
    return [TypePromptEnum.DATA_PROMPT, TypePromptEnum.SYSTEM_PROMPT];
}

function setDisableNodeInTree(tree: TreeNode[],nodeNames: Array<string>){
    const treeModified= searchNodeToDisableNode(tree,nodeNames);
    return JSON.parse(JSON.stringify(treeModified));
}

const typeBasePrompts: Array<string> =[TypePromptEnum.BILL_PROMPT,TypePromptEnum.IMAGE_PROMPT
        ,TypePromptEnum.SYNTHETIC_DATA,TypePromptEnum.GLOBAL_DEFECT_PROMPT,TypePromptEnum.BASIC_TEMPLATE];

const  promptOptions = [
   'Prompt dato' , 
  'Prompt sistema' ,
  'Otros Prompt' ];