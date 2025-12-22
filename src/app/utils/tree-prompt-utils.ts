import { TreeNode } from "primeng/api";

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

