declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string
      PINATA_API_KEY: string
      PINATA_SECRET: string
      PINATA_JWT: string
      ONE_SERVER_URL: string
    }
  }
}

// This export is necessary to make this file a module
export {}
