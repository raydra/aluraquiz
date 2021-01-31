/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import md5 from 'js-md5';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import QuizBackground from '../../src/components/QuizBackground';
import Widget from '../../src/components/Widget';
import BackLinkArrow from '../../src/components/BackLinkArrow';
import db from '../../db.json';

const HeroContainer = styled.div`
  width: 100%;
  max-width: 350px;
  padding-top: 45px;
  margin: auto 10%;
  @media screen and (max-width: 500px) {
    margin: auto;
    padding: 15px;
  }
`;

export default function HeroDatails({ marvelResponse }) {
  const existHero = marvelResponse.data.total;

  if (existHero === 0) {
    return (
      <QuizBackground backgroundImage={db.bg}>
        <HeroContainer>
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
              Não encontrado!
            </Widget.Header>
            <Widget.Content>
              <p>Por favor verifique se o nome do personagem está em INGLÊS e tente novamente.</p>
            </Widget.Content>
          </Widget>
        </HeroContainer>
      </QuizBackground>
    );
  }

  const heroName = marvelResponse.data.results[0].name;
  const heroDescription = marvelResponse.data.results[0].description;
  const hqUrl = marvelResponse.data.results[0].urls[0].url;
  const imgPath = marvelResponse.data.results[0].thumbnail.path;
  const imgExtension = marvelResponse.data.results[0].thumbnail.extension;
  const imgFinalPath = `${imgPath}.${imgExtension}`;
  return (
    <QuizBackground backgroundImage={db.bg}>
      <HeroContainer>
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
            <img
              src={imgFinalPath}
              alt="AvatarHero"
              style={{
                width: '3rem',
                height: '3rem',
                objectFit: 'cover',
                marginRight: '10px',
                borderRadius: '50%',
              }}
            />
            {heroName}
          </Widget.Header>
          <Widget.Content>
            <h1>Description</h1>
            <div style={{
              border: '1px solid #330e62',
              marginTop: '20px',
              borderRadius: '4px',
              marginBottom: '20px',
            }}
            >
              <p style={{
                paddingLeft: '5px',
                paddingRight: '5px',
              }}
              >
                {heroDescription}
              </p>
            </div>
            <a
              href={hqUrl}
              style={{
                textDecoration: 'none',
                color: 'white',
                fontSize: '16px',
                fontWeight: '700',
              }}
            >
              Conheça as HQs do personagem...
            </a>
          </Widget.Content>
        </Widget>
      </HeroContainer>
    </QuizBackground>

  );
}

export async function getServerSideProps(context) {
  const PRIVATE_KEY = 'e1bd40240ba5d0437d272bb8c93dee3a36d586f8';
  const PUBLIC_KEY = '34be0d81e8dd2694ad5acd0370da91ba';

  const timestamp = Number(new Date());
  const hash = md5.create();
  hash.update(timestamp + PRIVATE_KEY + PUBLIC_KEY);

  const heroName = context.query.name;

  try {
    const marvelResponse = await fetch(`https://gateway.marvel.com/v1/public/characters?ts=${timestamp}&name=${heroName}&apikey=${PUBLIC_KEY}&hash=${hash.hex()}`)
      .then((respostaDoServer) => {
        if (respostaDoServer.ok) {
          return respostaDoServer.json();
        }
        throw new Error('Falha em pegar os dados');
      })
      .then((respostaConvertidaEmObjeto) => respostaConvertidaEmObjeto);
    return {
      props: {
        marvelResponse,
      },
    };
  } catch (err) {
    throw new Error(err);
  }
}
