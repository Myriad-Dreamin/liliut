import type { APIRoute } from "astro";

import * as ts from "typescript";

const scripts = ["content/scene/state.ts"];

interface TypeConverted {
  types: Set<string>;
  ty: string | undefined;
  default: TypeConverted | undefined;
}

class TypeConverter {
  converted: TypeConverted;

  constructor(type: ts.Type, typeChecker: ts.TypeChecker, optional: boolean) {
    const worker = new TypeConvertWorker(typeChecker);
    worker.run(type);
    let defaultType = type.getDefault();
    if (defaultType) {
      const defaultWorker = new TypeConvertWorker(typeChecker);
      defaultWorker.run(defaultType);
      worker.default = defaultWorker.freeze();
    }
    if (optional) {
      worker.types.add("none");
    }
    this.converted = worker.freeze();
  }
}

class TypeConvertWorker implements TypeConverted {
  types: Set<string> = undefined!;
  ty: string | undefined;
  default: TypeConverted | undefined;

  constructor(private typeChecker: ts.TypeChecker) {}

  freeze(): TypeConverted {
    this.typeChecker = undefined!;
    return this;
  }

  run(type: ts.Type): TypeConverted {
    this.types = new Set<string>();
    this.ty = undefined;

    if (type.isStringLiteral() || type === this.typeChecker.getStringType()) {
      this.types.add("string");
    } else if (
      type.isNumberLiteral() ||
      type === this.typeChecker.getNumberType()
    ) {
      this.types.add("int");
      this.types.add("float");
    } else if (type === this.typeChecker.getBooleanType()) {
      this.types.add("boolean");
    } else if (type === this.typeChecker.getVoidType()) {
      this.types.add("none");
    } else if (type.isClassOrInterface()) {
      this.types.add("dictionary");
    } else if (this.typeChecker.isArrayLikeType(type)) {
      this.types.add("array");
    } else if (type.isUnion()) {
      type.types.forEach((t) => this.run(t));
    } else if (type.isIntersection()) {
      const types = type.getBaseTypes();
      if (types) {
        types.forEach((t) => this.run(t));
      }
    }

    return this;
  }

  toString(): string {
    if (this.types.size > 0) {
      const sortedTypes = Array.from(this.types).sort();
      return sortedTypes.join(", ");
    } else if (this.ty) {
      return this.ty;
    } else {
      return "any";
    }
  }
}

function toTypstType(ty: ts.Type, typeChecker: ts.TypeChecker): string {
  return new TypeConverter(ty, typeChecker, false).converted.toString();
}

export const generateTypstTypes = (): string => {
  const program = ts.createProgram(scripts, {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    strict: true,
    noEmit: true,
    skipLibCheck: true,
  });
  const typeChecker = program.getTypeChecker();
  const types: string[] = [];
  scripts.forEach((script) => {
    const sourceFile = program.getSourceFile(script);
    if (sourceFile) {
      ts.forEachChild(sourceFile, (node) => {
        if (
          ts.isFunctionDeclaration(node) &&
          node.name &&
          node.modifiers?.some(
            (mod) => mod.kind === ts.SyntaxKind.ExportKeyword
          )
        ) {
          const signature = typeChecker.getSignatureFromDeclaration(node);
          if (signature) {
            const params = signature.parameters
              .map((param) => {
                if (param.flags & ts.SymbolFlags.Optional) {
                  return `${param.name}: _default-value`;
                } else {
                  return param.name;
                }
              })
              .join(", ");
            const args = signature.parameters
              .map((param) => param.name)
              .join(", ");
            const paramDocs: string[] = signature.parameters
              .map((param) => {
                const types = new TypeConverter(
                  typeChecker.getTypeOfSymbol(param),
                  typeChecker,
                  !!(param.flags & ts.SymbolFlags.Optional)
                ).converted.toString();
                return `- ${param.name} (${types}): The parameter ${param.name} of the function.`;
              })
              .filter((assert) => assert !== null);

            const jsDocsAt = ts
              .getJSDocCommentsAndTags(node)
              .filter((doc) => doc.kind === ts.SyntaxKind.JSDoc);
            const jsDocs = jsDocsAt
              .map((doc) => ts.getTextOfJSDocComment(doc.comment))
              .join("\n")
              .split("\n");

            const returnType = signature.getReturnType();
            jsDocs.push("");
            jsDocs.push(...paramDocs);
            jsDocs.push(`-> ${toTypstType(returnType, typeChecker)}`);
            const docs = jsDocs.map((line) => `/// ${line}`).join("\n");
            const body = `_call-external("${node.name.text}", ${args})`;

            types.push(`${docs}\n#let ${node.name.text}(${params}) = ${body}`);
          }
        }
      });
    }
  });

  return `// Generated Typst types for scripts: ${scripts.join(", ")}\n\n
#import "/typ/templates/types.typ": *
  
${types.join("\n")}`;
};

export const GET: APIRoute = ({}) => {
  return new Response(generateTypstTypes());
};
