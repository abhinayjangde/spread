import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://spread-lh4w.onrender.com/graphql',
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
