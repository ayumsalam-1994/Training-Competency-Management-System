require('dotenv').config();
const {
    pool,
    createQuiz,
    createQuestion,
    createQuizOption
} = require('../src/utils/db');

async function seedQuizzes() {
    try {
        console.log('Starting quiz seeding...');

        // Sample Quiz 1: JavaScript Basics
        const quiz1 = await createQuiz(
            'JavaScript Fundamentals',
            'Test your knowledge of JavaScript basics including variables, functions, and scope.',
            20,
            70,
            'easy'
        );
        console.log('Created Quiz 1:', quiz1.id);

        // Questions for Quiz 1
        const q1_1 = await createQuestion(
            quiz1.id,
            'What is the output of: typeof undefined?',
            'mcq',
            'A',
            'The typeof operator returns "undefined" for undefined values.'
        );
        await createQuizOption(q1_1.id, 'A) "undefined"', true);
        await createQuizOption(q1_1.id, 'B) "null"', false);
        await createQuizOption(q1_1.id, 'C) "object"', false);
        await createQuizOption(q1_1.id, 'D) "unknown"', false);

        const q1_2 = await createQuestion(
            quiz1.id,
            'Which of the following is NOT a primitive data type in JavaScript?',
            'mcq',
            'D',
            'Objects (including arrays and functions) are not primitive types in JavaScript.'
        );
        await createQuizOption(q1_2.id, 'A) String', false);
        await createQuizOption(q1_2.id, 'B) Number', false);
        await createQuizOption(q1_2.id, 'C) Boolean', false);
        await createQuizOption(q1_2.id, 'D) Object', true);

        const q1_3 = await createQuestion(
            quiz1.id,
            'var a = 5; function test() { var a = 10; } test(); What is the value of a?',
            'mcq',
            'A',
            'Each variable declaration within a function scope is local to that function. The outer "a" remains 5.'
        );
        await createQuizOption(q1_3.id, 'A) 5', true);
        await createQuizOption(q1_3.id, 'B) 10', false);
        await createQuizOption(q1_3.id, 'C) undefined', false);
        await createQuizOption(q1_3.id, 'D) Error', false);

        const q1_4 = await createQuestion(
            quiz1.id,
            'Arrow functions have their own "this" context.',
            'true_false',
            'false',
            'Arrow functions do NOT have their own "this". They inherit "this" from the surrounding scope.'
        );

        const q1_5 = await createQuestion(
            quiz1.id,
            'What does const mean in JavaScript?',
            'mcq',
            'A',
            'const declares a block-scoped variable that cannot be reassigned after initialization.'
        );
        await createQuizOption(q1_5.id, 'A) A block-scoped variable that cannot be reassigned', true);
        await createQuizOption(q1_5.id, 'B) A variable that is always an object', false);
        await createQuizOption(q1_5.id, 'C) A variable that cannot be modified', false);
        await createQuizOption(q1_5.id, 'D) A global constant', false);

        console.log('✓ Quiz 1 seeded with 5 questions');

        // Sample Quiz 2: React Basics
        const quiz2 = await createQuiz(
            'React Components & Hooks',
            'Assess your understanding of React functional components and hooks.',
            15,
            75,
            'medium'
        );
        console.log('Created Quiz 2:', quiz2.id);

        const q2_1 = await createQuestion(
            quiz2.id,
            'What is the primary purpose of the useState hook?',
            'mcq',
            'A',
            'useState allows you to add state to functional components.'
        );
        await createQuizOption(q2_1.id, 'A) To add state to functional components', true);
        await createQuizOption(q2_1.id, 'B) To manage side effects', false);
        await createQuizOption(q2_1.id, 'C) To handle routing', false);
        await createQuizOption(q2_1.id, 'D) To optimize performance', false);

        const q2_2 = await createQuestion(
            quiz2.id,
            'useEffect runs after every render by default.',
            'true_false',
            'true',
            'By default, useEffect runs after every render. You can control this with dependency arrays.'
        );

        const q2_3 = await createQuestion(
            quiz2.id,
            'Which hook is used to access context values?',
            'mcq',
            'D',
            'useContext is the hook used to access context values in functional components.'
        );
        await createQuizOption(q2_3.id, 'A) useState', false);
        await createQuizOption(q2_3.id, 'B) useEffect', false);
        await createQuizOption(q2_3.id, 'C) useReducer', false);
        await createQuizOption(q2_3.id, 'D) useContext', true);

        const q2_4 = await createQuestion(
            quiz2.id,
            'What does the dependency array in useEffect do?',
            'mcq',
            'C',
            'The dependency array tells useEffect which values to watch. It only runs when those values change.'
        );
        await createQuizOption(q2_4.id, 'A) It makes the effect run faster', false);
        await createQuizOption(q2_4.id, 'B) It prevents all re-renders', false);
        await createQuizOption(q2_4.id, 'C) It specifies when the effect should run', true);
        await createQuizOption(q2_4.id, 'D) It cancels the effect', false);

        console.log('✓ Quiz 2 seeded with 4 questions');

        // Sample Quiz 3: HTML & CSS
        const quiz3 = await createQuiz(
            'HTML & CSS Fundamentals',
            'Basic HTML and CSS knowledge for web development.',
            10,
            60,
            'easy',
            null,
            5
        );
        console.log('Created Quiz 3:', quiz3.id);

        const q3_1 = await createQuestion(
            quiz3.id,
            'Which HTML tag is used for the largest heading?',
            'mcq',
            'A',
            'The <h1> tag represents the most important heading (Heading 1).'
        );
        await createQuizOption(q3_1.id, 'A) <h1>', true);
        await createQuizOption(q3_1.id, 'B) <header>', false);
        await createQuizOption(q3_1.id, 'C) <title>', false);
        await createQuizOption(q3_1.id, 'D) <head1>', false);

        const q3_2 = await createQuestion(
            quiz3.id,
            'CSS stands for Cascading Style Sheets.',
            'true_false',
            'true',
            'CSS is indeed an acronym for Cascading Style Sheets, used for styling HTML elements.'
        );

        const q3_3 = await createQuestion(
            quiz3.id,
            'Which CSS property controls text color?',
            'mcq',
            'B',
            'The "color" property in CSS sets the text color.'
        );
        await createQuizOption(q3_3.id, 'A) text-color', false);
        await createQuizOption(q3_3.id, 'B) color', true);
        await createQuizOption(q3_3.id, 'C) font-color', false);
        await createQuizOption(q3_3.id, 'D) text-style', false);

        console.log('✓ Quiz 3 seeded with 3 questions');

        console.log('\n✅ Quiz seeding completed successfully!');
        console.log('\nSeeded Quizzes:');
        console.log(`- Quiz 1 (ID: ${quiz1.id}): JavaScript Fundamentals (5 questions)`);
        console.log(`- Quiz 2 (ID: ${quiz2.id}): React Components & Hooks (4 questions)`);
        console.log(`- Quiz 3 (ID: ${quiz3.id}): HTML & CSS Fundamentals (3 questions)`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding quizzes:', err);
        process.exit(1);
    }
}

seedQuizzes();
