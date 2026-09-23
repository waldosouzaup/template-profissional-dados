import { Navigate, Route } from "react-router-dom";

// Old standalone list/form URLs now live as anchored sections of /admin/about.
const LEGACY_ABOUT_PATHS = [
  { path: "education", anchor: "#formacao" },
  { path: "experiences", anchor: "#experiencias" },
  { path: "books", anchor: "#livros" },
  { path: "courses", anchor: "#cursos" },
  { path: "journey", anchor: "" },
];

export const legacyAboutRoutes = () =>
  LEGACY_ABOUT_PATHS.map(({ path, anchor }) => (
    <Route key={path} path={`${path}/*`} element={<Navigate to={`/admin/about${anchor}`} replace />} />
  ));
