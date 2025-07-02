
#import "/typ/templates/scene.typ": *

#show: main.with(
  title: "Chapter 01 Scene 01",
  desc: "This is the first scene of chapter 01, introducing the main characters and setting the stage for the story.",
)

#let miya = say.with(name: "Miya")
#let you = say.with(name: "You")
#let aside = say.with(name: "Aside")


// todo: view scene in typst preview

#aside[今天是特殊的日子。]
#load-portrait(image("/public/175143313235882373.png"))
#miya[户口本带了吗？身份证带了吗？]
#miya[真是的...打起点精神来哦。]
#load-portrait(none)
#you[啊哈哈...]

#let lines-div = context {
  let lines = lines.final()
  lines
    .enumerate()
    .map(((idx, l)) => {
      let vis = if idx == 0 { ("data-active": "") }
      html.elem("div", attrs: (class: "scene-frame", data-index: str(idx), ..vis), {
        context {
          let pt = portrait.at(l.loc)
          if pt != none {
            html.elem("div", attrs: (class: "portrait"))[
              #html.elem("img", attrs: (src: pt.source.replace("/public/", "/liliut/")))
            ]
          }
        }
        html.elem("div", attrs: (class: "line-container"), {
          if l.name != "Aside" {
            html.elem("div", attrs: (class: "line"), l.name)
          }
          html.elem("p", attrs: (class: "line"))[「#l.body」]
        })
      })
    })
    .join()
}

#html.elem("div", attrs: (class: "scene"), {
  lines-div
})
