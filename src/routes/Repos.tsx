import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import classes from "./Repos.module.css";

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
}

function Repos() {
  const { login } = useParams<{ login: string }>();
  const navigate = useNavigate();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadRepos = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(`https://api.github.com/users/${login}/repos`);

        if (res.status === 404) {
          setError(true);
          setRepos([]);
          return;
        }

        if (res.ok) {
          const data: Repo[] = await res.json();
          setRepos(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Erro ao buscar repositórios:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadRepos();
  }, [login]);

  if (loading) {
    return (
      <div className={classes.container}>
        <p>Carregando repositórios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.container}>
        <p>Erro ao carregar repositórios</p>
        <button onClick={() => navigate("/")} className={classes.backButton}>
          Voltar
        </button>
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className={classes.container}>
        <p>Nenhum repositório encontrado para {login}</p>
        <button onClick={() => navigate("/")} className={classes.backButton}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <button onClick={() => navigate("/")} className={classes.backButton}>
        ← Voltar
      </button>
      <h2>Repositórios de {login}</h2>
      <div className={classes.reposList}>
        {repos.map((repo) => (
          <div key={repo.id} className={classes.repoCard}>
            <h3>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
            </h3>
            {repo.description && (
              <p className={classes.description}>{repo.description}</p>
            )}
            <div className={classes.info}>
              {repo.language && (
                <span className={classes.language}>
                  <strong>Linguagem:</strong> {repo.language}
                </span>
              )}
              <span className={classes.stars}>⭐ {repo.stargazers_count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Repos;
