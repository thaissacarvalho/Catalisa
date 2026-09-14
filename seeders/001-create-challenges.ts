import { Op, QueryInterface } from 'sequelize';

const challenges = [
  {
    code: 'LEADERSHIP',
    title: 'Liderança',
    description: 'Sugestões para desenvolver e melhorar a liderança.',
  },
  {
    code: 'COMMUNICATION',
    title: 'Comunicação',
    description: 'Ideias para tornar a comunicação mais clara e eficiente.',
  },
  {
    code: 'INNOVATION',
    title: 'Inovação',
    description: 'Propostas para transformar ideias em melhorias relevantes.',
  },
  {
    code: 'COLLABORATION',
    title: 'Colaboração',
    description: 'Práticas para fortalecer o trabalho conjunto entre equipes.',
  },
  {
    code: 'CUSTOMER_EXPERIENCE',
    title: 'Experiência do Cliente',
    description: 'Soluções para aprimorar cada etapa da jornada do cliente.',
  },
  {
    code: 'SUSTAINABILITY',
    title: 'Sustentabilidade',
    description: 'Iniciativas para reduzir impactos e usar recursos melhor.',
  },
  {
    code: 'DIVERSITY_AND_INCLUSION',
    title: 'Diversidade e Inclusão',
    description: 'Ações para promover ambientes mais diversos e inclusivos.',
  },
  {
    code: 'DIGITAL_TRANSFORMATION',
    title: 'Transformação Digital',
    description: 'Uso de tecnologia para simplificar e melhorar o trabalho.',
  },
  {
    code: 'PROCESS_IMPROVEMENT',
    title: 'Melhoria de Processos',
    description: 'Ideias para eliminar desperdícios e aumentar a eficiência.',
  },
  {
    code: 'PEOPLE_DEVELOPMENT',
    title: 'Desenvolvimento de Pessoas',
    description: 'Práticas para apoiar aprendizado e crescimento profissional.',
  },
  {
    code: 'WELL_BEING',
    title: 'Bem-estar',
    description: 'Iniciativas para promover saúde e qualidade de vida.',
  },
  {
    code: 'SOCIAL_IMPACT',
    title: 'Impacto Social',
    description: 'Soluções que gerem benefícios positivos para a sociedade.',
  },
] as const;

const challengeCodes = challenges.map((challenge) => challenge.code);

export default {
  async up(queryInterface: QueryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'challenges',
      challenges.map((challenge, index) => ({
        ...challenge,
        status: 'ACTIVE',
        displayOrder: index + 1,
        createdAt: now,
        updatedAt: now,
      })),
    );
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('challenges', {
      code: {
        [Op.in]: challengeCodes,
      },
    });
  },
};
