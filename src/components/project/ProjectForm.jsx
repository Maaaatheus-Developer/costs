import React, { useState, useEffect } from "react";
import styles from "./ProjectForm.module.css";
import Input from "../form/Input";
import Select from "../form/Select";
import SubmitButton from "../form/SubmitButton";

const ProjectForm = ({ btnText, handleSubmit, projectData }) => {
  const [categories, setCategories] = useState([]);
  const [project, setProject] = useState(projectData || []);
  useEffect(() => {
    fetch("http://localhost:5000/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const submit = (e) => {
    e.preventDefault();
    handleSubmit(project);
  };

  const handleChange = (e) => {
    // e.target é o input que foi digitado
    // e.target.name = o nome do input (exemplo: "name" ou "budget")
    // e.target.value = o valor que o usuário digitou
    // Se o usuário digitou "Meu App" no input name="name":
    // Usuário digita "Meu App" no input name="name"
    // O evento (e) dispara com: e.target.name = "name" e.target.value = "Meu App"

    // A linha executa:
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleCategory = (e) => {
    setProject({
      ...project,
      categories: {
        id: e.target.value,
        name: e.target.options[e.target.selectedIndex].text,
      },
    });
  };

  return (
    <form onSubmit={submit} className={styles.form}>
      {/* <div>
        <input type="text" placeholder="Insira o nome do projeto" />
      </div> */}
      <Input
        type="text"
        text="Nome do projeto"
        name="name"
        placeholder="Insira o nome do projeto"
        handleOnChange={handleChange}
        value={project.name ? project.name : ""}
      />
      {/* <div>
        <input type="number" placeholder="Insira o orçamento Total" />
      </div> */}
      <Input
        type="number"
        text="Orçamento do projeto"
        name="budget"
        placeholder="Insira o orçamento total"
        handleOnChange={handleChange}
        value={project.budget ? project.budget : ""}
      />
      {/* <div>
        <select name="category_id">
          <option disabled>Selecione a categoria</option>
        </select>
      </div> */}
      <Select
        name="category_id"
        text="Selecione a categoria"
        options={categories}
        handleOnChange={handleCategory}
        value={project.categories ? project.categories.id : ""}
      />
      {/* <div>
        <input type="submit" value={"Criar projeto"} />
      </div> */}
      <SubmitButton text={btnText} />
    </form>
  );
};

export default ProjectForm;
