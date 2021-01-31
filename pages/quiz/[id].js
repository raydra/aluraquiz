/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { ThemeProvider } from 'styled-components';
import Widget from '../../src/components/Widget';
import QuizScreen from '../../src/screens/Quiz';
import BackLinkArrow from '../../src/components/BackLinkArrow';
import QuizContainer from '../../src/components/QuizContainer';
import QuizBackground from '../../src/components/QuizBackground';
import db from '../../db.json';

export default function QuizDaGaleraPage({ dbExterno }) {
  if (dbExterno === 'erro') {
    return (
      <QuizBackground backgroundImage={db.bg}>
        <QuizContainer>
          <Widget>
            <Widget.Header>
              <BackLinkArrow href="/" />
              Quiz inválido, volte para a tela principal!
            </Widget.Header>
          </Widget>
        </QuizContainer>
      </QuizBackground>
    );
  }
  return (
    <ThemeProvider theme={dbExterno.theme}>
      <QuizScreen
        questionsDB={dbExterno.questions}
        bgDB={dbExterno.bg}
      />
    </ThemeProvider>
  );
}

export async function getServerSideProps(context) {
  const [projectName, githubUser] = context.query.id.split('___');

  try {
    const dbExterno = await fetch(`https://${projectName}.${githubUser}.vercel.app/api/db`)
      .then((respostaDoServer) => {
        if (respostaDoServer.ok) {
          return respostaDoServer.json();
        }
        throw new Error('Falha em pegar os dados');
      })
      .then((respostaConvertidaEmObjeto) => respostaConvertidaEmObjeto);
    return {
      props: {
        dbExterno,
      },
    };
  } catch (err) {
    return {
      props: {
        dbExterno: 'erro',
      },
    };
  }
}
