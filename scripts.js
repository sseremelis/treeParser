var text =
  '\
page 1\n\
  page 1.1\n\
    page 1.2.1\n\
  page 1.2\n\
page 2\n\
page 3\n\
  page 3.1\n\
  page 3.2\n\
page 4\n\
  page 4.1\n\
    page 4.1.1\n\
      page 4.1.1.1\n\
page 5\
'

// Target object:
// { title: null, isRoot: true, children: [ ... ] }

function textToTree(text) {
  var splitText = text.split('\n')
  var tree = { title: null, isRoot: false, children: [] }
  let parent = null
  splitText.map((item, index) => {
    let treeNode = {
      isRoot: false,
      title: item.replace(/^ +/gm, ''),
      children: [],
      depth: getDepth(item)
    }
    if (!item.startsWith(' ')) {
      treeNode.isRoot = true
      parent = treeNode
      tree.children.push(parent)
    } else {
      parent.children.push(treeNode)
      if (getDepth(splitText[index + 1]) > treeNode.depth) {
        parent = treeNode
      }
    }
  })
  return tree
}

function getDepth(line) {
  let depth = 0
  let charFound = false
  for (let i = 0; i < line.length; i++) {
    if (line[i] === ' ' && !charFound) {
      depth++
    } else {
      charFound = true
    }
  }
  return depth / 2
}

document.getElementById('action-button').addEventListener('click', function() {
  let text = document.getElementById('textarea').value
  console.log(textToTree(text))
  let treeObject = textToTree(text)
  let treeHtml = createHtmlTree(treeObject)
  document.getElementById('tree-area').innerHTML = ''
  document.getElementById('tree-area').appendChild(treeHtml)
})

function createHtmlTree(tree) {
  let htmlTree = createTreeNode(tree)
  tree.children.map(item => {
    htmlTree.appendChild(createHtmlTree(item))
  })
  return htmlTree
}

function createTreeNode(item) {
  let node = document.createElement('div')
  node.style.paddingLeft = `${item.depth / 2}rem`
  if (item.children.length > 0 && item.title) {
    node.classList.add('collapsible')
    node.addEventListener('click', toggleCollapse)
  }
  if (item.title) {
    node.classList.add('child')
    let title = document.createElement('div')
    title.classList.add('title')
    title.innerHTML = item.title
    node.appendChild(title)
  }
  return node
}

function toggleCollapse() {
  event.stopPropagation()
  event.cancelBubble = true
  this.classList.toggle('collapsible--open')
}
