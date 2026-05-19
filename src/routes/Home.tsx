import type { UserProps } from "../type/user";
import { useState, useEffect } from "react";
import Search from "../components/Search";
import Erro from "../components/Erro";
import User from "../components/User";

function Home() {
  const [user, setUser] = useState<UserProps | null>(null);
  const [erro, setErro] = useState(false);

  // Restaura o usuário do localStorage ao carregar a página
  useEffect(() => {
    const savedUser = localStorage.getItem("githubUser");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("githubUser");
      }
    }
  }, []);

  const loadUser = async (userName: string) => {
    setErro(false);
    setUser(null);

    const res = await fetch(`https://api.github.com/users/${userName}`);
    const data = await res.json();

    if (res.status === 404) {
      setErro(true);
      return;
    }

    if (res.ok) {
      const { avatar_url, login, location, followers, following } = data;

      const userData: UserProps = {
        avatar_url,
        login,
        location,
        followers,
        following,
      };
      setUser(userData);
      // Salva o usuário no localStorage
      localStorage.setItem("githubUser", JSON.stringify(userData));
    } else {
      setUser(null);
      localStorage.removeItem("githubUser");
      console.error("Usuário não encontrado.");
    }
  };

  const clearUser = () => {
    setUser(null);
    setErro(false);
    localStorage.removeItem("githubUser");
  };

  return (
    <div>
      <Search loadUser={loadUser} />
      {user && (
        <div>
          <User {...user} />
          <button onClick={clearUser} style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}>
            Limpar Usuário
          </button>
        </div>
      )}
      {erro && <Erro />}
    </div>
  );
}

export default Home;
