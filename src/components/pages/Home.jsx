import React from "react";
import savings from "../../img/savings.svg";
import styles from "./Home.module.css";
import LinkButton from "../../layouts/LinkButton";

const Home = () => {
  return (
    <section className={styles.home_container}>
      <h1>
        Bem vindo ao <span>Costas</span>
      </h1>
      <p>Comece a gerenciar os seus projetos agora mesmo!</p>
      <LinkButton to="/newproject" text={"Criar projeto"} />
      <img src={savings} alt="costs" />
    </section>
  );
};

export default Home;
