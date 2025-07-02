
#import "@preview/shiroa:0.2.3": plain-text

#let lines = state("liliut:lines", ())
#let say(name: none, body) = context {
  let loc = here()
  lines.update(it => it + ((loc: loc, name: name, body: body),))
}
#let portrait = state("liliut:portrait")
#let load-portrait(img) = portrait.update(it => img)

#let main(body, title: "", desc: "") = {
  [
    #metadata((
      title: plain-text(title),
      author: "Myriad-Dreamin",
      description: plain-text(desc),
    )) <frontmatter>
  ]
  body
}
