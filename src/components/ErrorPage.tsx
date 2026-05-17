import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import classes from "./ErrorPage.module.css";

function ErrorPage() {
  const error = useRouteError();

  return (
    <div className={classes.errorContainer}>
      <h1>Oops! Algo deu errado</h1>
      {isRouteErrorResponse(error) ? (
        <>
          <p className={classes.status}>{error.status}</p>
          <p className={classes.message}>
            {error.statusText || "Página não encontrada"}
          </p>
          {error.data?.message && <p>{error.data.message}</p>}
        </>
      ) : (
        <p>Um erro inesperado ocorreu</p>
      )}
      <a href="/" className={classes.link}>
        Voltar para a página inicial
      </a>
    </div>
  );
}

export default ErrorPage;
