import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../layouts/Loading";
import Container from "../../layouts/Container";
import styles from "./Project.module.css";
import ProjectForm from "../project/ProjectForm";
import Message from "../../layouts/Message";
import ServiceForm from "../service/ServiceForm";
import ServiceCard from "../service/ServiceCard";

const Project = () => {
  const { id } = useParams();
  const [project, setProject] = useState([]);
  const [services, setServices] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch(`http://localhost:5000/projects/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setProject(data);
          setServices(data.services || []);
        })

        .catch((err) => console.error(err));
    }, 1000);
    // Cleanup: limpar o timer se o componente desmontar ou as dependências mudarem
    return () => clearTimeout(timer);
  }, [id]);

  const editPost = (project) => {
    setMessage("");
    //budget validation
    if (project.budget < project.cost) {
      //message
      setMessage("O orçamento não pode ser menor que o custo do projeto!");
      setType("error");
      return false;
    }
    fetch(`http://localhost:5000/projects/${project.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setShowProjectForm(false);
        setMessage("Projeto, atualizado!");
        setType("success");

        //message
      })
      .catch((err) => err);
  };

  const toggleProjectForm = () => {
    setShowProjectForm(!showProjectForm);
  };

  const toggleServiceForm = () => {
    setShowServiceForm(!showServiceForm);
  };

  const createService = (project) => {
    setMessage("");
    if (!project.services || project.services.length === 0) return;

    //last service
    // Cria uma cópia do último serviço do array e gera um novo id.
    // O operador spread (...) copia todas as propriedades do objeto.
    // Em seguida, o id é sobrescrito com um UUID, preservando os demais campos.
    // Dessa forma, o objeto original permanece inalterado (imutabilidade).
    const lastService = {
      ...project.services.at(-1),
      id: uuidv4(),
    };

    //Substituir o último serviço por uma cópia com um novo id
    const services = [...project.services];
    services[services.length - 1] = lastService;

    const newCost = Number(project.cost) + Number(lastService.cost);

    // max value validation
    if (newCost > Number(project.budget)) {
      setMessage("Orçamento ultrapassado, verifique o valor do serviço");
      setType("error");
      return false;
    }
    // add service cost to project total cost
    const updatedProject = {
      ...project,
      cost: newCost,
      services,
    };
    //update project
    fetch(`http://localhost:5000/projects/${project.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProject),
    })
      .then((res) => res.json())
      .then((data) => {
        setShowServiceForm(false);
        setProject(data);
        setServices(data.services);
        setMessage("Serviço adicionado com sucesso!");
        setType("sucess");
        //display the services
        return console.log(data);
      })
      .catch((err) => console.error(err));
  };

  const removeService = (id, cost) => {
    //Filter nesse caso diz basicamente o seguinte: "Percorra todos os itens e mantenha apenas aqueles em que a condição seja verdadeira."
    const servicesUpdate = project.services.filter((service) => {
      return service.id !== id;
    });

    const projectUpdate = {
      ...project,
      services: servicesUpdate,
      cost: Number(project.cost) - Number(cost),
    };

    fetch(`http://localhost:5000/projects/${projectUpdate.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectUpdate),
    })
      .then(() => {
        setProject(projectUpdate);
        setServices(servicesUpdate);
        setMessage("Serviço Atualizado com sucesso!");
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      {project.name ? (
        <div className={styles.project_details}>
          <Container customClass="column">
            {message && <Message type={type} message={message} />}
            <div className={styles.details_container}>
              <h1>Projeto: {project.name}</h1>
              <button className={styles.btn} onClick={toggleProjectForm}>
                {!showProjectForm ? "Editar Projeto" : "Fechar"}
              </button>
              {!showProjectForm ? (
                <div className={styles.project_info}>
                  <p>
                    <span>Categoria:</span> {project.categories.name}
                  </p>
                  <p>
                    <span>Total de orçamento:</span> R${project.budget}
                  </p>
                  <p>
                    <span>Total utilizado:</span> R${project.cost}
                  </p>
                </div>
              ) : (
                <div className={styles.project_info}>
                  <ProjectForm
                    handleSubmit={editPost}
                    btnText="Concluir edição"
                    projectData={project}
                  />
                </div>
              )}
            </div>
            <div className={styles.service_form_container}>
              <h2>Adicione um serviço:</h2>
              <button className={styles.btn} onClick={toggleServiceForm}>
                {!showServiceForm ? "Adicionar serviço" : "Fechar"}
              </button>
              <div className={styles.project_info}>
                {showServiceForm && (
                  <ServiceForm
                    handleSubmit={createService}
                    btnText="Adicionar Serviço"
                    projectData={project}
                  />
                )}
              </div>
            </div>
            <h2>Serviços</h2>
            <Container customClass="start">
              {services.length > 0 ? (
                services.map((service) => (
                  <ServiceCard
                    id={service.id}
                    name={service.name}
                    cost={service.cost}
                    description={service.description}
                    key={service.id}
                    handleRemove={removeService}
                  />
                ))
              ) : (
                <p>Nenhum serviço adicionado</p>
              )}
            </Container>
          </Container>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Project;
