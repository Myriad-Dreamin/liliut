// Generated Typst types for scripts: content/scene/state.ts


#import "/typ/templates/types.typ": *
  
/// Greeting to user.
/// 
/// - name (string): The parameter name of the function.
/// -> none
#let greet(name) = _call-external("greet", name)