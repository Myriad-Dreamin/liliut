
#import "@preview/shiroa:0.2.3": *

#show: book

#book-meta(title: "shiroa", summary: [
  #prefix-chapter("scripting.typ")[Scripting]
])

// re-export page template
#import "/typ/templates/page.typ": project
#let book-page = project
