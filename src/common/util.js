console.log('util')

export default function render(text) {
  const textNode = document.createTextNode(text)

  document.body.appendChild(textNode)
}