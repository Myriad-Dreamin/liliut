
#let call-state = state("liliut:call", ())

#let _call-external(..args) = call-state.update(it => it + (args,))
#let _default-value = "ΘdefaultΘ";
