
#import "@preview/shiroa:0.2.3": plain-text
#import "/typ/typings/typst-types.typ": *

#let lines = state("liliut:lines", ())
#let say(name: none, quote: true, body) = {
  context {
    let loc = here()
    lines.update(it => it + ((loc: loc, name: name, body: body, quote: quote),))
  }
  call-state.update(it => ())
}
#let portrait = state("liliut:portrait")
#let load-portrait(img) = portrait.update(it => img)

#let lines-div = context {
  let lines = lines.final()
  lines
    .enumerate()
    .map(((idx, l)) => context {
      let tags = {
        // if idx == 0 { ("data-active": "") }
        let calls = call-state.at(l.loc)
        if calls.len() > 0 {
          (
            "data-script": calls
              .map(it => {
                it.pos().at(0)
                "("
                it.pos().slice(1).map(json.encode).join(",")
                ")"
              })
              .join(";"),
          )
        }
      }
      html.elem("div", attrs: (class: "scene-frame", data-index: str(idx), ..tags), {
        context {
          let pt = portrait.at(l.loc)
          if pt != none {
            html.elem("div", attrs: (class: "portrait"))[
              #html.elem("img", attrs: (draggable: "false", src: pt.source.replace("/public/", "/liliut/")))
            ]
          }
        }
        html.elem("div", attrs: (class: "line-container"), {
          if l.name != "Aside" {
            html.elem("div", attrs: (class: "line"), l.name)
          }
          html.elem("p", attrs: (class: "line"), if l.quote [「#l.body」] else { l.body })
        })
      })
    })
    .join()
}

#let call-fn(fence, children) = if fence != none {
  fence(children.join())
}

#let state-update = (state("_").update(none)).func()

#let scene-script(body) = {
  let mk-flatten(it) = {
    // it
    // .map(it => if it.func() == [].func() {
    //   mk-flatten(it.children)
    // } else {
    //   (it,)
    // })
    // .join()

    let children = ()
    if it.has("children") {
      for child in it.children {
        if child.has("children") {
          for v in mk-flatten(child) {
            children.push(v)
          }
        } else {
          children.push(child)
        }
      }
      return children
    } else {
      return (it,)
    }
  }
  let fence = none
  let fenced-children = none

  for child in mk-flatten(body) {
    if child.func() == metadata and type(child.value) == function {
      call-fn(fence, fenced-children)
      fence = child.value
      fenced-children = ()
    } else if child.func() == state-update {
      child
    } else if child.func() == [ ].func() {} else if fence != none and child.func() != parbreak {
      fenced-children.push(child)
    } else {
      child
    }
  }
  call-fn(fence, fenced-children)
}

#let main(body, title: "", desc: "") = {
  [
    #metadata((
      title: plain-text(title),
      author: "Myriad-Dreamin",
      description: plain-text(desc),
    )) <frontmatter>
  ]
  body
  html.elem("div", attrs: (class: "scene"), {
    lines-div
  })
}
