import { Journey } from '@/types/journey';

// ALL attachment styles will get their own introduction journey to begin with.

export const journeys: Journey[] = [
  {
    id: '10001',
    title: 'Introduction',
    description: 'This journey will show you why why why Monica is annoying, she won’t know you started this new journey in exploring her annoying ass.',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/tether-1f278.firebasestorage.app/o/images%2Fimagetest1.png?alt=media&token=12caf778-b533-4e14-89f7-1159481ec594',
    tags: ['Awareness', "Understanding"],
    keywords: ['Dismissive', "Avoidant", "Secure", "Anxious", "Fearful", "Understanding","Awareness","Meaning"],
    isPublished: true,

    sections: [
      {
        id: 'intro',
        title: 'Getting Oriented',
        description: 'This is where you get started!',
        order: 1,
        steps: [
          {
            id: 'attachment-question-01',
            author: "Kevin Guerrero",
            type: 'question',
            title: 'Welcome to Secure',
            order: 1,
            payload: {
              questions: [
                {
                  id: 'q1',
                  text: 'A birthday memory that still makes you smile is…',
                  type: "choice",
                  options: [
                    'Big cake',
                    'Small cake',
                    'These nuts',
                    'Perfer not to say'
                  ],
                },
                {
                  id: 'q2',
                  text: 'I dont need my GF…',
                  type: "text"
                },
                {
                  id: 'q4',
                  text: 'What you like 2?',
                  type: "choice",
                  options: [
                    'Apples 1',
                    'Girls 2',
                    'Boys 3'
                  ],
                },
                {
                  id: 'q3',
                  text: 'What you like?',
                  type: "choice",
                  options: [
                    'Apples',
                    'Girls',
                    'Boys'
                  ],
                },
              ],
              scoring: 'none',
            },
            prerequisites: [],
          },
          {
            id: 'attachment-meditation-01',
            author: "Elevenlabs.io",
            type: 'meditation',
            title: 'Four key attachment styles',
            order: 2,
            gradient: ['#FFB6B6', '#FF9F9F'],
            payload: {
              url: 'https://firebasestorage.googleapis.com/v0/b/tether-1f278.firebasestorage.app/o/audio%2Fmeditation%2Fstyles.MP3?alt=media&token=e82a1996-0fee-43d8-a9e3-8256a3ecde50',
            },
            prerequisites: ["attachment-question-01"],
          }
        ],
      },
      {
        id: 'Core',
        title: 'Core skills to learn',
        description: 'You need these skills to be able to overcome that avoidant NIGGER',
        order: 2,
        steps: [
          {
            id: 'attachment-question-02',
            author: "Kevin Guerrero",
            type: 'question',
            title: 'Welcome to Secure',
            order: 1,
            payload: {
              questions: [
                {
                  id: 'q1',
                  text: 'We human are good looking',
                  type: "choice",
                  options: [
                    'Strongly disagree',
                    'Disagree',
                    'Neutral',
                    'Agree',
                    'Strongly agree',
                  ],
                },
                {
                  id: 'q2',
                  text: 'What is your favorite pizza?',
                  type: "text"
                },
              ],
              scoring: 'none',
            },
            prerequisites: ["attachment-meditation-01"],
          }
        ],
      }
    ],
  },
  {
    id: '10002',
    title: 'Introduction',
    description: 'This journey will show you why why why Monica is annoying, she won’t know you started this new journey in exploring her annoying ass.',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/tether-1f278.firebasestorage.app/o/images%2Fimagetest1.png?alt=media&token=12caf778-b533-4e14-89f7-1159481ec594',
    tags: ['Awareness', "Understanding"],
    keywords: ['Dismissive', "Avoidant", "Secure", "Anxious", "Fearful", "Understanding","Awareness","Meaning"],
    isPublished: true,

    sections: [
      {
        id: 'intro',
        title: 'Getting Oriented',
        description: 'This is where you get started!',
        order: 1,
        steps: [
          {
            id: 'attachment-question-01',
            author: "Kevin Guerrero",
            type: 'question',
            title: 'Welcome to Secure',
            order: 1,
            payload: {
              questions: [
                {
                  id: 'q1',
                  text: 'A birthday memory that still makes you smile is…',
                  type: "choice",
                  options: [
                    'Big cake',
                    'Small cake',
                    'These nuts',
                    'Perfer not to say'
                  ],
                },
                {
                  id: 'q2',
                  text: 'I dont need my GF…',
                  type: "text"
                },
                {
                  id: 'q4',
                  text: 'What you like 2?',
                  type: "choice",
                  options: [
                    'Apples 1',
                    'Girls 2',
                    'Boys 3'
                  ],
                },
                {
                  id: 'q3',
                  text: 'What you like?',
                  type: "choice",
                  options: [
                    'Apples',
                    'Girls',
                    'Boys'
                  ],
                },
              ],
              scoring: 'none',
            },
            prerequisites: [],
          },
          {
            id: 'attachment-meditation-01',
            author: "Elevenlabs.io",
            type: 'meditation',
            title: 'Four key attachment styles',
            order: 2,
            gradient: ['#FFB6B6', '#FF9F9F'],
            payload: {
              url: 'https://firebasestorage.googleapis.com/v0/b/tether-1f278.firebasestorage.app/o/audio%2Fmeditation%2Fstyles.MP3?alt=media&token=e82a1996-0fee-43d8-a9e3-8256a3ecde50',
            },
            prerequisites: ["attachment-question-01"],
          }
        ],
      },
      {
        id: 'Core',
        title: 'Core skills to learn',
        description: 'You need these skills to be able to overcome that avoidant NIGGER',
        order: 2,
        steps: [
          {
            id: 'attachment-question-02',
            author: "Kevin Guerrero",
            type: 'question',
            title: 'Welcome to Secure',
            order: 1,
            payload: {
              questions: [
                {
                  id: 'q1',
                  text: 'We human are good looking',
                  type: "choice",
                  options: [
                    'Strongly disagree',
                    'Disagree',
                    'Neutral',
                    'Agree',
                    'Strongly agree',
                  ],
                },
                {
                  id: 'q2',
                  text: 'What is your favorite pizza?',
                  type: "text"
                },
              ],
              scoring: 'none',
            },
            prerequisites: ["attachment-meditation-01"],
          }
        ],
      }
    ],
  },
  {
    id: '10003',
    title: 'Introduction',
    description: 'This journey will show you why why why Monica is annoying, she won’t know you started this new journey in exploring her annoying ass.',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/tether-1f278.firebasestorage.app/o/images%2Fimagetest1.png?alt=media&token=12caf778-b533-4e14-89f7-1159481ec594',
    tags: ['Awareness', "Understanding"],
    keywords: ['Dismissive', "Avoidant", "Secure", "Anxious", "Fearful", "Understanding","Awareness","Meaning"],
    isPublished: true,

    sections: [
      {
        id: 'intro',
        title: 'Getting Oriented',
        description: 'This is where you get started!',
        order: 1,
        steps: [
          {
            id: 'attachment-question-01',
            author: "Kevin Guerrero",
            type: 'question',
            title: 'Welcome to Secure',
            order: 1,
            payload: {
              questions: [
                {
                  id: 'q1',
                  text: 'A birthday memory that still makes you smile is…',
                  type: "choice",
                  options: [
                    'Big cake',
                    'Small cake',
                    'These nuts',
                    'Perfer not to say'
                  ],
                },
                {
                  id: 'q2',
                  text: 'I dont need my GF…',
                  type: "text"
                },
                {
                  id: 'q4',
                  text: 'What you like 2?',
                  type: "choice",
                  options: [
                    'Apples 1',
                    'Girls 2',
                    'Boys 3'
                  ],
                },
                {
                  id: 'q3',
                  text: 'What you like?',
                  type: "choice",
                  options: [
                    'Apples',
                    'Girls',
                    'Boys'
                  ],
                },
              ],
              scoring: 'none',
            },
            prerequisites: [],
          },
          {
            id: 'attachment-meditation-01',
            author: "Elevenlabs.io",
            type: 'meditation',
            title: 'Four key attachment styles',
            order: 2,
            gradient: ['#FFB6B6', '#FF9F9F'],
            payload: {
              url: 'https://firebasestorage.googleapis.com/v0/b/tether-1f278.firebasestorage.app/o/audio%2Fmeditation%2Fstyles.MP3?alt=media&token=e82a1996-0fee-43d8-a9e3-8256a3ecde50',
            },
            prerequisites: ["attachment-question-01"],
          }
        ],
      },
      {
        id: 'Core',
        title: 'Core skills to learn',
        description: 'You need these skills to be able to overcome that avoidant NIGGER',
        order: 2,
        steps: [
          {
            id: 'attachment-question-02',
            author: "Kevin Guerrero",
            type: 'question',
            title: 'Welcome to Secure',
            order: 1,
            payload: {
              questions: [
                {
                  id: 'q1',
                  text: 'We human are good looking',
                  type: "choice",
                  options: [
                    'Strongly disagree',
                    'Disagree',
                    'Neutral',
                    'Agree',
                    'Strongly agree',
                  ],
                },
                {
                  id: 'q2',
                  text: 'What is your favorite pizza?',
                  type: "text"
                },
              ],
              scoring: 'none',
            },
            prerequisites: ["attachment-meditation-01"],
          }
        ],
      }
    ],
  },
];
