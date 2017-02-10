/**
 * Created by kelen on 2017/2/6.
 */


export let insertAfter = (node, newNode) => {
    node && node.parentNode && node.parentNode.insertBefore(newNode, node.nextSibling);
}

export let inserBefore = (node, newNode) => {
    node && node.parentNode && node.parentNode.insertBefore(newNode, node);
}

export let deleteNode = (parent, node) => {
    parent && node && parent.removeChild(node);
}

export let changeNodeValue = (node, text) => {
    node && (node.nodeValue = text);
}

export let findIteratorNode = (parentNode, key) => {
    let childrens = parentNode.childNodes;
    let iteratorNodes = [];
    for (let i = 0; i < childrens.length; i++) {
        let node = childrens[i];
        if (node.forString && node.forKey && node.forKey == key) {
            iteratorNodes.push(node);
        }
        if (node.childNodes.length) {
            iteratorNodes.concat(findIteratorNode(node, key));
        }
    }
    return iteratorNodes;
}

// 新增元素, last最后添加
export let insertNodeByIndex = (node, index, text) => {

    let tagName = node.tagName;
    let idx = 0; 		// 第一个下标开始
    let groupId = node.groupId;
    let attrs = node.attributes;
    let template = node.template;

    if (index == 0) {
        node.innerText = text;
        node.style.display = "";
    } else {
        while (idx < index - 1 && node) {
            if (node.nextSibling && node.nextSibling.groupId == groupId) {
                idx ++;
            }
            node = node.nextSibling;
        }
        let newNode = document.createElement(tagName);
        newNode.groupId = groupId;
        newNode.template = template;
        newNode.innerText = text;
        // 父属性
        for (let i = 0; i < attrs.length; i++) {
            let kv = attrs[i];
            switch (kv.name) {
                default:
                    newNode.setAttribute(kv.name, kv.nodeValue);
            }
        }
        insertAfter(node, newNode);
    }

}

export let removeNodeByIndex = (node, index) => {
    var tagName = node.tagName;
    var idx = 0;
    var groupId = node.groupId;
    // 当下标为1时，重新选举标准
    if (index == 0) {
        if (node.nextSibling.groupId == groupId) {
            node.nextSibling['forKey'] = node.forKey;
            node.nextSibling['forString'] = node.forString;
            node.parentNode.removeChild(node);
        } else {
            node.style.display = 'none';
            node.innerText = '';
        }
    } else {
        while (idx < index && node) {
            if (node.nextSibling && node.groupId == groupId) {
                idx ++;
            }
            node = node.nextSibling;
        }
        node && node.parentNode.removeChild(node);
    }
}

export let replaceNodeByIndex = (node, index, text) => {
    var idx = 0;
    var groupId = node.groupId;
    while (idx < index && node) {
        if (node.nextSibling && node.nextSibling.groupId == groupId) {
            idx ++;
        }
        node = node.nextSibling;
    }
    if (node) {
        node.innerText = text;
    } else {

    }
}

export let removeNode = (node) => {
    node && node.parentNode.removeChild(node);
}

