/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
 
const apiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-3.8-flash",
});

  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
  
   export const GeneraterCourseLayout_AI = model.startChat({
      generationConfig,
   // safetySettings: Adjust safety settings
   // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [
        {
          role: "user",
          parts: [
            {text: "Ai course with  introducation and chapters\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "## Introduction to Artificial Intelligence (AI)\n\n**Course Overview:**\n\nThis course will provide a comprehensive introduction to the fascinating world of Artificial Intelligence (AI). We'll explore the history, concepts, core techniques, and applications of AI, along with its societal implications. Whether you're a complete beginner or have some prior knowledge, this course will equip you with a solid foundation to understand and engage with AI in its various forms. \n\n**Course Objectives:**\n\nBy the end of this course, you will be able to:\n\n* Understand the basic concepts and definitions of AI.\n* Distinguish between different types of AI, including weak and strong AI.\n* Identify key areas of AI research and application.\n* Explain the principles and methods behind various AI techniques, such as machine learning, deep learning, and natural language processing.\n* Analyze the impact of AI on society and its potential ethical challenges.\n* Explore future trends and developments in the field of AI.\n\n**Course Structure:**\n\nThe course is divided into the following chapters:\n\n**Chapter 1: Introduction to AI**\n\n* What is AI?\n* History of AI\n* Different Types of AI\n* AI Applications in Real World\n* Key Areas of AI Research\n\n**Chapter 2: Foundations of AI**\n\n* Logic and Reasoning\n* Problem Solving and Search\n* Knowledge Representation\n* Expert Systems\n\n**Chapter 3: Machine Learning**\n\n* Supervised Learning\n* Unsupervised Learning\n* Reinforcement Learning\n* Common Machine Learning Algorithms\n\n**Chapter 4: Deep Learning**\n\n* Neural Networks\n* Convolutional Neural Networks (CNNs)\n* Recurrent Neural Networks (RNNs)\n* Applications of Deep Learning\n\n**Chapter 5: Natural Language Processing (NLP)**\n\n* Text Preprocessing\n* Language Models\n* Machine Translation\n* Sentiment Analysis\n\n**Chapter 6: Computer Vision**\n\n* Image Processing\n* Object Detection and Recognition\n* Facial Recognition\n* Applications in Healthcare and Robotics\n\n**Chapter 7: AI Ethics and Societal Impact**\n\n* Bias in AI\n* Privacy Concerns\n* Job Displacement\n* Responsible AI Development\n\n**Chapter 8: Future of AI**\n\n* AI Trends and Innovations\n* Emerging Technologies\n* AI's Role in the Future\n\n**Course Resources:**\n\n* Course textbook: \"Artificial Intelligence: A Modern Approach\" by Stuart Russell and Peter Norvig\n* Online resources: Coursera, edX, Udacity\n* AI research papers and articles\n* AI community forums and discussions\n\n**Assessment:**\n\n* Quizzes at the end of each chapter\n* Final project involving the application of AI techniques to a real-world problem\n\n**This course is designed to be accessible to a wide audience, including:**\n\n* Students interested in exploring the field of AI\n* Professionals looking to expand their knowledge of AI and its applications\n* Individuals curious about the impact of AI on our lives\n\nLet's embark on this exciting journey into the world of Artificial Intelligence!\n"},
          ],
        },
      ],
    });


  export const GeneraterChapterContent_AI = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "Explain the concept in Detail on Topic: next js, Chapter :Introduction to Next.js in JSON Format with feild as title, description in detail, Code Example(HTML Code format) if application"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "## Next.js Introduction\n\n```json\n{\n  \"title\": \"Introduction to Next.js\",\n  \"description\": \"Next.js is a popular React framework that simplifies building fast, SEO-friendly, and production-ready web applications. It offers server-side rendering (SSR), static site generation (SSG), automatic code splitting, built-in routing, and more. This makes Next.js ideal for creating dynamic and complex web experiences while maintaining high performance and scalability.\",\n  \"key_features\": [\n    {\n      \"feature\": \"Server-Side Rendering (SSR)\",\n      \"description\": \"Next.js allows you to render your React components on the server, resulting in fully rendered HTML being sent to the browser. This improves SEO, initial page load times, and overall performance.\"\n    },\n    {\n      \"feature\": \"Static Site Generation (SSG)\",\n      \"description\": \"Next.js can pre-render your pages at build time, making them incredibly fast and efficient. This is perfect for content-driven websites and landing pages.\"\n    },\n    {\n      \"feature\": \"Automatic Code Splitting\",\n      \"description\": \"Next.js automatically splits your code into smaller chunks, reducing the amount of data that needs to be downloaded for each page, further improving performance.\"\n    },\n    {\n      \"feature\": \"Built-in Routing\",\n      \"description\": \"Next.js provides a simple and intuitive routing system that allows you to define routes for different pages within your application.\"\n    },\n    {\n      \"feature\": \"API Routes\",\n      \"description\": \"Next.js allows you to create serverless APIs that can be accessed from both your client-side and server-side code, simplifying data fetching and logic.\"\n    },\n    {\n      \"feature\": \"Data Fetching\",\n      \"description\": \"Next.js provides several ways to fetch data on the server and client-side, including `getStaticProps`, `getServerSideProps`, and `getInitialProps`.\"\n    },\n    {\n      \"feature\": \"Hot Reloading\",\n      \"description\": \"Next.js enables hot reloading during development, allowing you to see changes in your code reflected in the browser in real-time.\"\n    }\n  ],\n  \"code_example\": \"```html\\n<!-- pages/index.js -->\\nimport React from 'react';\\n\\nconst Home = () => {\\n  return (\\n    <div>\\n      <h1>Welcome to my Next.js App</h1>\\n      <p>This is a simple home page.</p>\\n    </div>\\n  );\\n};\\n\\nexport default Home;\\n```\"\n}\n```\n\n**Explanation:**\n\n* **Title:** This field provides the title of the topic, which is \"Introduction to Next.js\" in this case.\n* **Description:** This field gives a general overview of Next.js, highlighting its key features and benefits. \n* **key_features:** This field contains an array of objects, each describing a specific feature of Next.js. Each object has a `feature` field (e.g., \"Server-Side Rendering\") and a `description` field explaining the feature in detail.\n* **code_example:** This field provides a basic HTML example showcasing a simple Next.js component. This code demonstrates how to create a basic page component and render elements within it.\n\n**In Summary:**\n\nThis JSON object provides a structured and comprehensive introduction to Next.js, including its core features, benefits, and a basic code example. \n"},
          ],
        },
      ],
    });
  
    // const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    // console.log(result.response.text());
 