
#import "/typ/templates/scene.typ": *

#show: main.with(
  title: "Chapter 01 Scene 01",
  desc: "This is the first scene of chapter.",
)

#let miya = {
  metadata(say.with(name: "Miya"))
  load-portrait(image("/public/175143313235882373.png"))
}
#let lily-question = metadata(say.with(name: "???"))
#let lily = metadata(say.with(name: "Lily"))
#let aside = {
  metadata(say.with(name: "Aside", quote: false))
  load-portrait(none)
}

#show: scene-script

// todo: view scene in typst preview

#aside
意识到自己睡了很久很久，在漫无边际的梦境里过了无尽的岁月。

#aside
清醒梦，但无法主动醒来。梦是什么都没有的虚无。

#aside
焦急。却什么都做不了。想要有人来唤醒自己，脑内却是一片浆糊，想不起任何人的名字。

#aside
直到被一阵轻柔的声音唤醒。

#lily-question
姐姐，你醒啦...

#aside
女孩子微笑，露出一排好看的牙齿。

#miya
啊哈哈...
#greet("Miya")
