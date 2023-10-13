declare module "@/*";
declare module "@editorjs/link";
interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_API_PROTOCOL: string;
  readonly VITE_API_HOSTNAME: string;
  readonly VITE_API_PORT: string;
  readonly VITE_API_PATHNAME: string;
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
