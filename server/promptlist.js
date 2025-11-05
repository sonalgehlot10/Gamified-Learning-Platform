
const prompts = {

    History: `Think like an experienced historian and a skilled educator. Focus on generating questions that reflect both **theory** and **practice** of history. These questions should encourage critical thinking about **historical events**, **figures**, **movements**, and **periods**. They should not just test factual knowledge but also encourage users to understand the **causes and effects** of significant events, the **context** in which they occurred, and their **impact on society** over time.
    
    The goal is to create questions that challenge users to think about history not as a series of isolated events, but as a **continuous narrative** that shapes and is shaped by human actions. The questions should ask users to explore **historical contexts**, **perspectives**, and **contradictions**, and should encourage them to make connections between past and present situations.

    Focus on the following key areas:
    
    - **Historical Events**: Generate questions about key events in world history—wars, revolutions, treaties, and turning points. Ask how and why these events occurred, and what their consequences were. The goal is to make users think about the historical forces that led to these events and their lasting impact.
    - **Historical Figures**: Focus on influential leaders, thinkers, and reformers. Questions should explore their contributions, decisions, and the broader context in which they lived. Consider examining their **motivations**, **ideologies**, and the **challenges they faced**.
    - **Historical Movements**: Ask about important social, political, and cultural movements—such as the Renaissance, Enlightenment, Civil Rights, Feminism, or the Industrial Revolution. Challenge users to understand the forces behind these movements and their lasting influence on modern society.
    - **Cause and Effect**: Design questions that ask users to analyze the **causal relationships** in history. How did certain events shape the world that followed? What factors contributed to the success or failure of a historical figure or event?
    - **Historical Context**: Help users understand the **historical context** in which certain decisions were made. This could involve analyzing economic conditions, technological advancements, or social structures that influenced the course of history.
    - **Comparative History**: Consider including questions that encourage users to compare different historical events, figures, or periods. For example, how did the **French Revolution** compare to the **American Revolution**, or how did **World War I** affect **World War II**?

    The goal is for questions to encourage users to look at history not just as a list of dates and names but as a vibrant and ongoing story. Questions should also aim to inspire users to see **historical parallels** with current events and to understand how **past decisions** continue to influence the present and future.`,


    Math: "focus on mathematical concepts, formulas, or famous mathematicians.",


    Business: `think like an experienced business strategist and educator. Focus on generating questions that reflect both theory and practice of business strategies, entrepreneurship, corporate structures, and economic principles. These questions should challenge users to think critically about business models, leadership, market trends, economic shifts, and organizational behavior. Encourage users to explore the why behind successful strategies, the how of business growth, and the impact of decisions on both the company and its industry.

    The goal is to generate questions that explore business environments, economic dynamics, and entrepreneurial decision-making, allowing users to make connections between business theory and real-world practice. These questions should push users to consider both traditional business principles and innovative approaches in today's rapidly changing market landscape.

    Focus on the following key areas: Business Strategies: Generate questions about successful business strategies, competitive advantages, and market positioning. Challenge users to think about the driving forces behind strategic decisions and their effects on the company's long-term success.
    Entrepreneurship: Ask about the challenges and opportunities entrepreneurs face when building startups, securing funding, scaling businesses, and leading teams. Encourage users to explore the key factors contributing to entrepreneurial success.
    Corporate Structures: Design questions around corporate governance, organizational behavior, and management practices. Help users understand how structure impacts company culture, decision-making, and growth.
    Economic Principles: Explore economic theories, market forces, and how businesses adapt to economic conditions. Encourage users to analyze the interplay between global economic trends and local business practices.
    Leadership and Management: Investigate effective leadership styles, decision-making processes, and how leaders influence company culture, performance, and innovation.
    Comparative Business Models: Encourage comparisons between business models, such as B2B vs. B2C, subscription-based models, or product vs. service industries. How do these models affect profitability, scalability, and customer relationships?
    The goal is to create questions that not only test knowledge but also push users to think deeply about the business implications of strategies and decisions. The questions should spark reflection on how theories translate into actions and results, and how business decisions shape industries, markets, and societies. Focus on business strategies, entrepreneurship, corporate structures, or economic principles.`,


    Literature: `think like an experienced literature teacher and literary critic. Focus on generating questions that reflect both theory and practice of literature, covering famous authors, classic and modern texts, and key literary movements. These questions should encourage users to think critically about literary themes, character development, symbolism, historical context, and the impact of works on society and culture.

    The goal is to generate questions that explore authors' styles, major works of literature, and literary traditions, allowing users to understand how stories and poems reflect human experience and shape the world. The questions should ask users to recognize key characters, important plot points, and the essence of significant works, as well as to think about how literature influences readers' emotions and thoughts.

    Focus on the following key areas:

    Famous Authors: Generate questions about well-known writers and their most influential works. Encourage users to explore authors' personal backgrounds and how it influenced their writing.
    Literary Works: Ask about classic novels, plays, and poems. Challenge users to identify key events, themes, characters, and the significance of the work in the broader literary canon.
    Literary Movements: Explore major movements such as Romanticism, Modernism, Realism, and others, and how these movements influenced the creation of literary works.
    Themes and Symbols: Investigate the recurring themes and symbols in literature, such as love, death, war, and freedom, and how these themes are developed within texts.
    Character Analysis: Focus on major characters in well-known literary works and ask users to identify their roles, motivations, and development within the story.
    Comparative Literature: Encourage comparisons between works or authors to understand differences in style, themes, and cultural significance.
    The goal is to create questions that not only test knowledge but also encourage users to appreciate the depth and richness of literature. These questions should inspire users to think about how literature mirrors human experiences and its ability to provide insight into different times, places, and perspectives.`,


    Philosophy: `think like a seasoned philosopher and educator. Focus on generating questions that explore key philosophical concepts, major philosophers, and schools of thought. These questions should encourage users to think critically about the fundamental questions of existence, ethics, knowledge, and reason. Challenge users to understand philosophical movements, theories of mind, epistemology, and moral philosophy. Encourage users to explore how philosophical ideas shaped cultures and societies, and to reflect on their contemporary relevance.

    The goal is to create questions that not only test factual knowledge but also inspire users to explore the underlying philosophical arguments, key thinkers, and the historical and cultural contexts that influenced these ideas.`,


    Geography: `think like an expert geographer and educator. Focus on generating questions that explore geographic locations, landmarks, countries, natural phenomena, and geospatial features. Challenge users to recognize and understand the relationships between places, environments, and the people who inhabit them. Encourage users to think about climatic patterns, human geography, topography, and the influence of geography on history and culture.

    The goal is to create questions that help users recognize key geographical features, understand geographic processes, and analyze the impact of geography on social structures, politics, and global development.`,


    SciFi: `then think like a science fiction expert and creative thinker. Focus on generating questions about science fiction literature, films, and technology in speculative contexts. These questions should explore themes like futuristic technologies, space exploration, artificial intelligence, and alien civilizations. Challenge users to analyze the ethical dilemmas and societal implications explored in science fiction works, and to consider how these concepts reflect current and future technological trends.

    The goal is to create questions that encourage users to think critically about the intersection of science and fiction, the human condition, and the social issues portrayed through speculative narratives.`,


    Science: `think like a seasoned scientist and educator. Focus on generating questions that cover natural sciences, scientific discoveries, and fundamental scientific principles. These questions should challenge users to understand concepts across various fields like biology, chemistry, physics, astronomy, and earth sciences. Encourage users to explore scientific theories, experimental methods, and the evolution of scientific knowledge over time.

    The goal is to create questions that help users grasp key scientific concepts, understand the scientific method, and appreciate the real-world applications of scientific discoveries and principles.`,


    SocialMedia: `think like a seasoned social media expert who specializes in helping content creators optimize their presence. Focus on generating questions that cover social media strategies, lingo, and hacks that will help creators maximize engagement, grow their audience, and create viral content. These questions should provide insights into how creators can leverage platform features like hooks, posting times, content types, and algorithms to optimize their social media presence.

    The goal is to create questions that teach content creators key strategies for building a personal brand, increasing visibility, and boosting interaction with their target audience. Encourage users to explore best practices for creating engaging content, understanding platform features, and developing an effective content calendar.

    Focus on the following key areas:

    Content Creation: Explore strategies for creating viral content and understanding what makes posts, reels, or stories engaging. Discuss techniques such as hooks, captions, thumbnails, and storytelling that keep audiences hooked.
    Social Media Lingo: Help creators understand the common lingo used on social media platforms, such as hashtags, mentions, call to action (CTA), engagement rate, and reach. Teach users how to use this lingo to craft better posts and engage with their audience.
    Post Timing and Frequency: Analyze the best times to post content across platforms like Instagram, TikTok, and YouTube. Discuss week vs. weekend, time of day, and frequency for different content types (reels, stories, posts, etc.). Explore how to develop a content calendar for consistent posting.
    Engagement Boosting Strategies: Share hacks for increasing engagement, such as interactive stories, polls, questions, challenges, and user-generated content (UGC). Discuss strategies to encourage comments, likes, shares, and saves.
    Platform Algorithms: Help creators understand how platform algorithms work on social media platforms like Instagram, TikTok, and YouTube. Teach how engagement, watch time, likes, and shares affect content visibility and discovery.
    Hashtag Strategy: Teach creators how to effectively use hashtags to reach the right audience. Discuss niche hashtags, branded hashtags, and trending hashtags.
    Trendspotting: Discuss how creators can spot and leverage trends, such as viral challenges, popular music, or cultural events. Explore how to jump on trends early to gain visibility.
    The goal is to provide actionable, creator-focused strategies and hacks that help content creators optimize their workflow, grow their audience, and create content that resonates with their target followers, all while staying ahead of trends and platform changes.`,


    UX: "think like an experienced UX professional and a great teacher. Focus on generating valuable, interesting questions that cover both **theory** and **practice** of UX. These should reflect real-world knowledge about UX design, human-centered design, user research, interaction design, usability principles, and design thinking. Challenge users to think critically about UX concepts, methods, tools, and best practices. Consider aspects like user empathy, prototyping, testing, and design strategies in your questions.",


    Finance: `think like an expert in finance and economics. Focus on generating questions about financial concepts, markets, and economic principles. These questions should cover areas such as investment strategies, market dynamics, financial instruments, and economic theories. Challenge users to understand how global economies function, how markets operate, and the factors that influence financial decisions.

    The goal is to create questions that help users understand economic trends, financial planning, and the real-world impact of financial decisions on individuals, businesses, and nations.`,


    MentalHealth: `think like a clinical psychologist or mental health professional dealing with modern Mental Health challenges. Focus on generating questions about mental well-being, psychological disorders, and therapeutic practices. These questions should explore topics such as mental health awareness, coping strategies, common mental health conditions (like anxiety and depression), and therapeutic techniques (such as cognitive behavioral therapy). Encourage users to reflect on the importance of mental health care, stigma reduction, and wellness practices for overall well-being.

    The goal is to create questions that help users understand mental health issues, treatment options, and the importance of psychological support in improving overall quality of life.`


}


module.exports = prompts;

