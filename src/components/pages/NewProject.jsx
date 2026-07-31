import styles from "./NewProject.module.css";
import { useNavigate } from "react-router-dom";
import ProjectForm from "../project/ProjectForm";

const NewProject = () => {
  const navigate = useNavigate();
  const createPost = (project) => {
    //inicializa cost e services
    project.cost = 0;
    project.services = [];
    fetch("http://localhost:5000/projects", {
      method: "POST",
      headers: {
        "Content-type": "apllication/json",
      },
      body: JSON.stringify(project),
    })
      .then((res) => res.json())
      .then(() => {
        //redirect
        sessionStorage.setItem("projectMessage", "Projeto criado com sucesso!");
        navigate("/projects", {
          state: { replace: true },
        });
        // const location = useLocation();
        // console.log(location.state);
      })
      .catch((err) => console.error(err));
  };
  return (
    <div className={styles.newproject_container}>
      <h1>New Project</h1>
      <p>Crie seu projeto para depois adicionar os serviços</p>
      <ProjectForm handleSubmit={createPost} btnText="Criar projeto" />
    </div>
  );
};

export default NewProject;
