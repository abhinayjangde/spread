import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.NODE_ENV === "development" ? "http://localhost:9000/graphql" : process.env.NEXT_PUBLIC_API_URL!,

  documents: ['src/**/*.{tsx,ts}'],
  ignoreNoDocuments: true,
  generates: {
    './src/gql/': {
      preset: 'client',
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
}

export default config
