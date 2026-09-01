import { useLayout } from "../layout/core";
import { ThemeModeComponent } from "../assets/ts/layout";

// BASE_URL vaut "/" (vite.config.ts). Une concatenation nue donne "//media/..."
// des que l'appelant passe un chemin commencant par "/", et le navigateur lit
// "//host/path" comme une URL protocol-relative : la requete part vers
// https://media/... et echoue en ERR_NAME_NOT_RESOLVED. On normalise ici plutot
// que sur chaque appelant — 16 des 236 appels du projet sont dans ce cas.
export const toAbsoluteUrl = (pathname: string) =>
  import.meta.env.BASE_URL.replace(/\/+$/, "") + "/" + pathname.replace(/^\/+/, "");

export const useIllustrationsPath = (illustrationName: string): string => {
  const { config } = useLayout();

  const extension = illustrationName.substring(
    illustrationName.lastIndexOf("."),
    illustrationName.length
  );
  const illustration =
    ThemeModeComponent.getMode() === "dark"
      ? `${illustrationName.substring(
          0,
          illustrationName.lastIndexOf(".")
        )}-dark`
      : illustrationName.substring(0, illustrationName.lastIndexOf("."));
  return toAbsoluteUrl(
    `media/illustrations/${config.illustrations?.set}/${illustration}${extension}`
  );
};
