let expandTag = tag => tag
  .split('-')
  .reduce((expanded, part, i, parts) => {
    expanded.push(parts.slice(0, i+1).join('-'))
    return expanded
  }, [])

let expandTags = tags => tags
  .flatMap(expandTag)
  .reduce((unique, tag) => {
    if(!unique.includes(tag)){ unique.push(tag) }
    return unique
  }, [])

let parseEntry = entry => {
  let tokens = entry.split(/\p{White_Space}+/gu)
  let url = tokens.filter(token => 
     token.startsWith(`http`) && 
    !token.startsWith('#')
  )
  let tags = tokens.filter(token => token != url)
  tags = expandTags(tags)
  return {url, tags}
}

let parseLinksPlaintext = plaintext => {
  let entries = plaintext
    .trim()
    .split(/\n\n+/g)
    .map(parseEntry)

  return entries
}

let add = async link => {
  links.links.push(link)
  await Deno.writeTextFile('links.json', JSON.stringify(links, null, 2))
}

let data = await Deno.readTextFile('links.json')
let links = JSON.parse(data)


add(...parseLinksPlaintext(`https://www.quackit.com/css/grid/tutorial/ #css-grid #css-layout #beginner`))