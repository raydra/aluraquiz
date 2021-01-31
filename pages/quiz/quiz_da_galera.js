import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import QuizContainer from '../../src/components/QuizContainer';
import QuizBackground from '../../src/components/QuizBackground';
import Widget from '../../src/components/Widget';
import BackLinkArrow from '../../src/components/BackLinkArrow';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';
import db from '../../db.json';

export default function HeroDatails() {
  const router = useRouter();
  const [game, setGame] = React.useState('');

  function handleQuiz(infosDoEvento) {
    infosDoEvento.preventDefault();

    const [projectName, githubUser] = game.split('/');
    if (githubUser === undefined) {
      // eslint-disable-next-line no-alert
      alert('Nome do quiz incompleto!');
      setGame('');
    } else {
      router.push(`/quiz/${projectName}___${githubUser}`);
    }
  }
  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <Widget
          as={motion.section}
          transition={{ delay: 0.5, duration: 0.5 }}
          variants={{
            show: { opacity: 1 },
            hidden: { opacity: 0 },
          }}
          initial="hidden"
          animate="show"
        >
          <Widget.Header>
            <BackLinkArrow href="/" />
            Pesquise um quiz específico.
          </Widget.Header>
          <Widget.Content>
            <p>Pesquise um quiz específico seguindo o pdrão ensinado durante a imersão.</p>
            <p>´nome do quiz´/´usuário Git´</p>
            <form onSubmit={handleQuiz}>
              <Input
                name="nomeDoQuiz"
                onChange={(infosDoEvento) => setGame(infosDoEvento.target.value)}
                placeholder="aluraquiz/raydra"
                value={game}
              />
              <Button type="submit" disabled={game.length === 0}>
                Jogar
              </Button>
            </form>
          </Widget.Content>
        </Widget>
      </QuizContainer>
    </QuizBackground>
  );
}
