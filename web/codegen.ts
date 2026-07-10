import type { CodegenConfig } from '@graphql-codegen/cli'

const fallbackSchemaUrl = 'http://localhost:9000/graphql'
const schemaUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || fallbackSchemaUrl

const config: CodegenConfig = {
  overwrite: true,
  schema: schemaUrl,

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
