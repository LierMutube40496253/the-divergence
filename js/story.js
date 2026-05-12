// js/story.js — The Divergence v5 (3-chapter structure)

window.STORY = {

  // ═══════════════════════════════════════════════════════════
  // PROLOGUE — THE BAR
  // ═══════════════════════════════════════════════════════════

  'pro-1': {
    id: 'pro-1', speaker: 'narrator',
    text: 'Davos, Switzerland. January 25th, 2007. A few minutes past midnight.\n\nThe conference rooms are empty. Hans Rosling gave a presentation this morning that made several economists reconsider assumptions they had held for decades.\n\nYou have a research question that none of the panels quite answered: why did South Korea and Nigeria, two nations at nearly identical starting points in 1952, diverge so dramatically by today?',
    next: 'pro-2',
  },

  'pro-2': {
    id: 'pro-2', speaker: 'narrator',
    text: 'The hotel bar is almost empty. Two men sit with drinks and a laptop open between them, talking quietly. You recognise both from the morning session.',
    next: 'pro-3',
  },

  'pro-3': {
    id: 'pro-3', speaker: 'emeka', expression: 'sharp',
    text: 'You were in the morning session. Sit down. We were just getting to the part of the conversation that took us twenty years to be able to have properly.',
    next: 'pro-4',
  },

  'pro-4': {
    id: 'pro-4', speaker: 'jiho', expression: 'neutral',
    text: 'We have a version of this conversation every time we are at the same conference. Tonight we thought we would try explaining it to someone who does not already have a conclusion.\n\nThe question you are working on, Korea and Nigeria, the divergence, we have been living inside that question from opposite sides of it for most of our professional lives. Let us start in 1952.',
    next: 'ch1-0',
  },

  // ═══════════════════════════════════════════════════════════
  // CHAPTER 1 — THE DIVERGENCE
  // ═══════════════════════════════════════════════════════════

  'ch1-0': {
    id: 'ch1-0', speaker: 'narrator', chapter: 'ch1',
    text: 'Chapter One: The Divergence',
    next: 'ch1-1',
  },

  'ch1-1': {
    id: 'ch1-1', speaker: 'emeka', expression: 'serious',
    text: 'In 1952, South Korea and Nigeria had almost identical GDP per capita. Korea sat at $1,030 per person, Nigeria at $1,077. The difference was forty seven dollars. If you had asked a development economist in 1952 to predict which would be richer in fifty years, many would have picked Nigeria. We had more land, more people, a larger agricultural base, and natural resources already being surveyed by the British. On paper, Nigeria had the stronger starting position.',
    next: 'ch1-2',
  },

  'ch1-2': {
    id: 'ch1-2', speaker: 'jiho', expression: 'neutral',
    text: 'And Korea had less than nothing. The war that ended in 1953 killed approximately two and a half million Koreans and destroyed roughly half of the country\'s industrial infrastructure. When economists looked at the two countries in 1952, the honest assessment was that Korea had a worse starting position than Nigeria, not just a similar one.\n\nThe divergence that followed is not the story of an obvious winner pulling ahead. It is the story of a country that should have lost finding a way to win, and a country that should have won finding a way to lose.',
    next: 'ch1-3',
  },

  'ch1-3': {
    id: 'ch1-3', speaker: 'emeka', expression: 'sharp',
    text: 'Before we show you the data, I want to ask you something first. In 1952, if you had to bet your career on which of these two countries would be richer fifty years later, which would you have picked?',
    next: 'ch1-predict',
  },

  'ch1-predict': {
    id: 'ch1-predict', speaker: 'prediction',
    prompt: 'In 1952, which country would you have predicted to be richer by 2007?',
    options: ['South Korea', 'Nigeria'],
    next: 'ch1-chart',
  },

  'ch1-chart': {
    id: 'ch1-chart', speaker: 'jiho', expression: 'neutral',
    chart: 'CHART1',
    text: 'This shows fifty-five years of GDP per capita for both countries, one of the starkest economic divergences in modern history. The gap at the right edge, that twenty-one thousand dollar difference per person, did not exist in 1952. It was created year by year, by decisions each country made, by structures each country built or failed to build, and by external forces that acted on each economy differently.',
    next: 'ch1-5',
  },

  'ch1-5': {
    id: 'ch1-5', speaker: 'emeka', expression: 'serious',
    text: 'The question is when the lines began to separate, what was happening at that moment, and how each country handled the shocks that came afterward. Both lines are close together through the 1950s. It is in the 1960s that Korea\'s line begins to pull away.',
    next: 'ch1-choices',
  },

  'ch1-choices': {
    id: 'ch1-choices', speaker: 'choice',
    prompt: 'What do you want to examine first?',
    choices: [
      {
        text: 'Show me when and why the lines started to separate.',
        chartUpdate: 'CHART1-A',
        reaction: [
          { speaker: 'jiho', expression: 'neutral',
            text: 'That shaded region, 1965 to 1980, is where the story begins. Both countries were making structural decisions in the same fifteen year window.\n\nBefore that window opened: between 1949 and 1950, Korea undertook a substantial redistribution of agricultural land. By the time industrialisation began, Korea had a relatively egalitarian agrarian base, rural households with secure land tenure and a direct stake in what their country built next.\n\nIn 1962, the Korean government launched its First Five Year Plan, targeting textiles, steel, and chemicals. In 1967, Nigeria began exporting crude oil for the first time.' },
          { speaker: 'emeka', expression: 'serious',
            text: 'And in that same year, 1967, Nigeria\'s civil war began. The Biafran conflict ran until 1970, killing approximately two million people and devastating the eastern region that contained much of Nigeria\'s most productive agricultural and oil producing land.\n\nKorea was building during peace. Nigeria was building during civil war. Two nations, same window, completely different conditions. The lines began to separate almost immediately, and they never came back together.' },
        ],
      },
      {
        text: 'Show me how stable each country\'s growth was through the shocks.',
        chartUpdate: 'CHART1-B',
        reaction: [
          { speaker: 'jiho', expression: 'neutral',
            text: 'The lower panel shows growth rates between the data points. Korea\'s bars are consistently positive across every decade. That predictability was the result of a diversified, manufacturing-based economy. Banks could lend long-term, firms could plan multi-year training programmes, families could commit to their children\'s education with reasonable confidence about the future.' },
          { speaker: 'emeka', expression: 'serious',
            text: 'Nigeria\'s bars swing dramatically. The pattern mirrors the global oil price. Nigeria\'s economic growth was not driven by what Nigeria produced or built, it was driven by a number set in London and Houston. A country that cannot predict its own GDP growth rate cannot build the long-term institutions development requires.' },
          { speaker: 'jiho', expression: 'quiet',
            text: 'I want to be honest about the 1997 dip on Korea\'s line. The Asian Financial Crisis hit Korea hard. GDP fell six percent in a single year. But the recovery happened in two years because Korea\'s economy had depth. Nigeria\'s 1982 crash, by contrast, was followed by more than a decade of stagnation. The difference is not that Korea avoided pain. It is what existed underneath each economy to absorb the pain when it arrived.' },
        ],
      },
      {
        text: 'Move on, I want to understand the deeper economic reasons.',
        isD: true, chapter: '1', next: 'ch1-optionC-1',
      },
    ],
  },

  // Option C dialogue — Dutch Disease (no chart update, pure dialogue)
  'ch1-optionC-1': {
    id: 'ch1-optionC-1', speaker: 'emeka', expression: 'sharp',
    text: 'You are going to ask about the oil, because that is always the question. Nigeria had oil, oil means revenue, revenue means investment, investment means development. Why did that chain not hold? The oil did something to Nigeria that took us decades to understand properly.',
    next: 'ch1-optionC-2',
  },

  'ch1-optionC-2': {
    id: 'ch1-optionC-2', speaker: 'jiho', expression: 'neutral',
    text: 'The economic literature calls it the Dutch Disease, named after the Netherlands in the 1960s, when the discovery of large North Sea natural gas reserves caused the Dutch manufacturing sector to collapse despite the country becoming wealthier in aggregate.',
    next: 'ch1-optionC-3',
  },

  'ch1-optionC-3': {
    id: 'ch1-optionC-3', speaker: 'emeka', expression: 'serious',
    text: 'Wealthier in the aggregate. Poorer in the parts that would have had to build what came next.',
    next: 'ch1-optionC-4',
  },

  'ch1-optionC-4': {
    id: 'ch1-optionC-4', speaker: 'jiho', expression: 'neutral',
    text: 'When a country discovers a highly profitable natural resource and begins exporting at scale, foreign currency floods in. The national currency strengthens. A strong currency makes every other export more expensive for the world to buy. Your textile factories become uncompetitive, your manufacturing sector contracts, and gradually the only viable export left is the commodity itself.',
    next: 'ch1-optionC-5',
  },

  'ch1-optionC-5': {
    id: 'ch1-optionC-5', speaker: 'emeka', expression: 'sharp',
    text: 'Nigeria\'s case was more severe than the Netherlands. The oil did not just crowd out other sectors economically, it hollowed out the institutional architecture a modern economy requires. When a government can fund itself entirely from oil royalties, it does not need to build an effective tax system. When you do not need tax revenue, you do not need the institutions that collect it.\n\nKorea had no oil and had to build all of those institutions because there was no other way to generate revenue to run the state. That pressure, uncomfortable as it was, forced us to construct the infrastructure of a modern economy.',
    next: 'ch1-bridge',
  },

  'ch1-bridge': {
    id: 'ch1-bridge', speaker: 'jiho', expression: 'neutral',
    text: 'Which brings us to what each country was actually exporting over time, and what that meant for the kind of economy each one became.',
    next: 'ch2-0',
  },

  // ═══════════════════════════════════════════════════════════
  // CHAPTER 2 — THE STRUCTURAL TRAP
  // ═══════════════════════════════════════════════════════════

  'ch2-0': {
    id: 'ch2-0', speaker: 'narrator', chapter: 'ch2',
    text: 'Chapter Two: The Structural Trap',
    next: 'ch2-1',
  },

  'ch2-1': {
    id: 'ch2-1', speaker: 'jiho', expression: 'neutral',
    chart: null,
    text: 'Before we look at the next chart, I want to be honest about how Korea actually executed the industrial policy I just described. The Five Year Plans were implemented under Park Chung hee, a general who took power in a military coup in 1961 and ruled Korea as a dictator until his assassination in 1979. Labour unions were suppressed. Opposition politicians were imprisoned. Journalists were censored.\n\nThe path Korea walked was effective. It was also, for long stretches, profoundly authoritarian. Any honest analysis has to include both facts.',
    next: 'ch2-2',
  },

  'ch2-2': {
    id: 'ch2-2', speaker: 'emeka', expression: 'serious',
    text: 'I appreciate you saying that, because the export complexity story usually gets told as if it were a pure economic accomplishment, when in fact it was a political bargain Korea made.\n\nNow, before we show you, your instinct. By 2007, what do you think Nigeria\'s exports looked like?',
    next: 'ch2-predict',
  },

  'ch2-predict': {
    id: 'ch2-predict', speaker: 'prediction',
    prompt: 'By 2007, what did Nigeria\'s export basket look like?',
    options: ['Spread across sectors', 'Concentrated in oil'],
    next: 'ch2-chart',
  },

  'ch2-chart': {
    id: 'ch2-chart', speaker: 'emeka', expression: 'sharp',
    chart: 'CHART2',
    text: 'Korea\'s chart looks like a staircase. Every decade a new category of product grows to take more of the stack. Textiles replace raw agriculture in the 1960s, steel and chemicals in the 1970s, ships and heavy machinery in the 1980s, consumer electronics and semiconductors in the 1990s and 2000s. Each transition represents Korean workers acquiring new skills and Korean institutions adapting to support more complex industries.',
    next: 'ch2-4',
  },

  'ch2-4': {
    id: 'ch2-4', speaker: 'jiho', expression: 'neutral',
    text: 'Nigeria\'s chart looks like a wall. One colour, essentially unchanged, from 1982 to 2007. Ninety six percent of Nigerian exports were oil by 1982. Ninety six percent in 2007. The country\'s entire economic structure froze the moment oil became profitable enough to make everything else uncompetitive.',
    next: 'ch2-choices',
  },

  'ch2-choices': {
    id: 'ch2-choices', speaker: 'choice',
    prompt: 'What do you want to examine?',
    choices: [
      {
        text: 'Show me how these structures changed decade by decade.',
        chartUpdate: 'CHART2-A',
        reaction: [
          { speaker: 'jiho', expression: 'neutral',
            text: 'Looking at each decade in sequence makes the pattern clearer. In 1962 Korea\'s exports are mostly agricultural. By 1972 manufactures have appeared. By 1982 they dominate. By 2007 Korea is one of the world\'s largest exporters of memory chips, televisions, and steel.\n\nThe sequence was not accidental. The Korean government sat down every five years and asked what we could learn to make next. Then they built the universities, research institutes, and subsidised firms to get there.' },
          { speaker: 'emeka', expression: 'serious',
            text: 'Nigeria\'s sequence is different. In 1962 agricultural exports dominate. By 1967 oil appears. By 1982 it has swallowed everything else. Then the panels stop changing. 1992, 2002, 2007, the same amber orange wall every time.\n\nNot because Nigerians stopped trying to build alternative sectors, but because the Dutch Disease mechanism was relentless. Every time a non oil sector began to grow, oil\'s profitability made it uncompetitive.' },
        ],
      },
      {
        text: 'Show me the external conditions that made this divergence possible.',
        chartUpdate: 'CHART2-B',
        reaction: [
          { speaker: 'emeka', expression: 'sharp',
            text: 'Korea did not develop alone. Between 1953 and 1980, the United States provided Korea with approximately six billion dollars in grants and concessional loans, one of the largest per capita foreign aid programmes in modern history. Korea also received preferential access to the American consumer market under Cold War trade arrangements, technology transfer from American and Japanese firms, and continuous military protection.' },
          { speaker: 'jiho', expression: 'quiet',
            text: 'Each of those supports was real. I grew up in a country shaped by all of them.' },
          { speaker: 'emeka', expression: 'serious',
            text: 'None of this diminishes what Korean workers and institutions accomplished. It just describes the conditions under which they accomplished it. The Five Year Plans were not fundable without American grant assistance. The export-led industrialisation model was not viable without preferential access to American consumer markets.\n\nNigeria inherited a different external context entirely. At independence in 1960, the oil contracts negotiated with multinational firms had concession terms that today would be considered profoundly asymmetric. And when the 1982 oil price crash hit, Nigeria turned to the IMF, which came with the Structural Adjustment Programme imposed in 1986, mandating specific cuts to public spending on health and education exactly when investment in those areas was most needed.' },
          { speaker: 'emeka', expression: 'sharp',
            text: 'By credible estimates, approximately four hundred billion dollars of Nigerian oil revenue was lost to corruption between 1960 and 1999. Oil revenue makes corruption possible at that scale because it bypasses the citizen state accountability mechanism. If your revenue comes from drilling rather than from your population\'s earnings, your population has less leverage over how the revenue is spent.' },
        ],
      },
      {
        text: 'I understand the structural difference. What does it mean for the people?',
        isD: true, chapter: '2', next: 'ch2-bridge-1',
      },
    ],
  },

  'ch2-bridge-1': {
    id: 'ch2-bridge-1', speaker: 'emeka', expression: 'serious',
    text: 'The export structure is a description of what each country\'s workforce spent their time doing, and therefore what skills they were developing, and what kind of economy they were building for the next generation. Korean workers in 2007 were designing semiconductors, engineering vehicles, writing software. These activities require continuous learning and continuous institutional investment.',
    next: 'ch2-bridge-2',
  },

  'ch2-bridge-2': {
    id: 'ch2-bridge-2', speaker: 'jiho', expression: 'neutral',
    chart: null,
    text: 'Nigerian workers in 2007, in the formal economy, were mostly employed in government, services, or oil adjacent roles. The manufacturing sector that might have employed millions and trained them in complex skills had never been built at scale. Which brings us to the most important part of the story: not what each country produced, but who was doing the work, and what investments were being made in people.',
    next: 'ch3-0',
  },

  // ═══════════════════════════════════════════════════════════
  // CHAPTER 3 — THE DEMOGRAPHIC DIVIDEND VS BURDEN
  // ═══════════════════════════════════════════════════════════

  'ch3-0': {
    id: 'ch3-0', speaker: 'narrator', chapter: 'ch3',
    text: 'Chapter Three: The Demographic Dividend',
    next: 'ch3-1',
  },

  'ch3-1': {
    id: 'ch3-1', speaker: 'jiho', expression: 'neutral',
    text: 'There is a concept called the demographic dividend. When fertility falls, when families have fewer children, the ratio of working age adults to dependants improves. Households have more savings per person. Governments have more revenue per person. More resources are invested in each individual child. Those better educated children enter the workforce more productive than the previous generation, which accelerates growth, which leads to higher incomes, which leads to lower fertility. The cycle is self reinforcing. Korea experienced this dividend in full. Nigeria did not.',
    next: 'ch3-2',
  },

  'ch3-2': {
    id: 'ch3-2', speaker: 'emeka', expression: 'serious',
    text: 'Before the chart traces these paths, which country do you think moved further along this trajectory? Fertility falling and life expectancy rising, both at once, over those fifty-five years.',
    next: 'ch3-predict',
  },

  'ch3-predict': {
    id: 'ch3-predict', speaker: 'prediction',
    prompt: 'Which country completed the demographic transition?',
    options: ['South Korea', 'Nigeria'],
    next: 'ch3-chart',
  },

  'ch3-chart': {
    id: 'ch3-chart', speaker: 'emeka', expression: 'serious',
    chart: 'CHART3',
    text: 'Korea\'s path is long and sweeping, moving steadily toward lower fertility and higher life expectancy over five decades. By 2007 Korea has essentially completed the demographic transition, fertility 1.3 children per woman, life expectancy 78.6 years.\n\nNigeria\'s path moves upward, life expectancy improved from 36 to 47 years, which is real human progress. But the path barely moves to the right at all. A Nigerian woman in 2007 still has, on average, six children. Almost identical to 1960.',
    next: 'ch3-4',
  },

  'ch3-4': {
    id: 'ch3-4', speaker: 'jiho', expression: 'neutral',
    text: 'The fertility decline that triggers the demographic dividend never arrived. Because fertility stayed high, each dollar of oil revenue had to be divided among an ever larger population. Each expansion of the healthcare system was immediately absorbed by a growing number of people who needed it. The dividend was never collected.',
    next: 'ch3-choices',
  },

  'ch3-choices': {
    id: 'ch3-choices', speaker: 'choice',
    prompt: 'What aspect do you want to examine?',
    choices: [
      {
        text: 'Show me how Korea put all of its people, women and men alike, into the economy.',
        chartUpdate: 'CHART3-A',
        reaction: [
          { speaker: 'jiho', expression: 'neutral',
            text: 'When Korea built those factories in the 1970s, and offices in the 1980s, and technology firms in the 1990s, women were on the floors, in the offices, in the engineering departments. The government invested in girls\' education at the same rate as boys\' from early in the industrialisation process. By 1990 the gender gap in Korean secondary enrollment was three percentage points, statistically negligible.\n\nThis matters economically in a specific way. If you have a hundred working age people in your economy but structural barriers prevent fifty of them from participating fully, your economy is operating at half capacity. Korea found a way to use all hundred.' },
          { speaker: 'emeka', expression: 'serious',
            text: 'Nigeria\'s gender gap in secondary education in 1990 was fourteen percentage points. Boys at 31%, girls at 17%. We were not simply losing the economic contribution of those girls. We were losing the savings they would have generated, the fertility decline their economic participation would have produced, and the next generation of educated workers they would have raised.\n\nNigeria was leaving a substantial portion of its human capital unused at the precise moment when oil revenue was making the urgency of that investment feel optional.' },
        ],
      },
      {
        text: 'Show me the difference in education investment between the two countries.',
        chartUpdate: 'CHART3-B',
        reaction: [
          { speaker: 'jiho', expression: 'pleased',
            text: 'By 1990 Korea\'s secondary enrollment was 91 percent, at the far right of the distribution, practically adjacent to Scandinavia. This is a country that in 1952 had a war ruined education system and within forty years achieved enrollment rates comparable to Western Europe.\n\nThis transformation required decades of sustained public investment, mandatory schooling laws, and a cultural emphasis on academic achievement that the government actively cultivated. When the economy needed engineers, Korea had engineers. When it needed semiconductor technicians, it had semiconductor technicians.' },
          { speaker: 'emeka', expression: 'sharp',
            text: 'Nigeria\'s enrollment in 1990 was 24 percent, in that cluster on the left, alongside countries that had a fraction of Nigeria\'s oil revenue. We had the money. Nigeria in the 1970s and 1980s was collecting enormous oil revenues. The economists advising the government knew what the enrollment rates were and what they needed to be.\n\nWhat did not exist was the institutional commitment to redirect that money toward long-term human capital investment. The oil removed the accountability mechanism at the same time as it removed the urgency.' },
        ],
      },
      {
        text: 'Show me how Korea and Nigeria fit into the broader Asia and Africa story.',
        chartUpdate: 'CHART3-C',
        reaction: [
          { speaker: 'emeka', expression: 'serious',
            text: 'Korea and Nigeria are one story, but they are also representative of something larger. East Asia is significantly richer, significantly healthier. Sub-Saharan Africa is almost uniformly poorer. This is not about two countries that happened to diverge, it is about two regions that followed fundamentally different developmental paths over the same fifty-five years, and the reasons are broadly the same reasons we have been discussing.' },
          { speaker: 'jiho', expression: 'neutral',
            text: 'East Asia, including South Korea, Taiwan, Singapore, Hong Kong, and increasingly China, pursued variations of the same strategy: export-led industrialisation, sustained education investment, demographic transition, female workforce participation. Sub-Saharan Africa, with important exceptions, remained in commodity dependency, whether oil in Nigeria, copper in Zambia, diamonds in the DRC, cocoa in West Africa. The colonial export structures were not replaced.' },
          { speaker: 'emeka', expression: 'serious',
            text: 'I want to be careful here not to make this sound like a simple morality tale. Conditions were not equal. Colonial history left very different institutional inheritances. The Cold War geopolitics that gave Korea access to American markets was not available to most of sub-Saharan Africa in the same way.\n\nBut the maps also show that some countries made more of what was possible than others. Understanding the difference, at the level of economic structure, education, and human capital, is what this conversation has been trying to show you.' },
        ],
      },
      {
        text: 'I\'ve seen enough. Let us hear your final positions.',
        isD: true, chapter: '3', next: 'ch3-bridge',
      },
    ],
  },

  // Bridge to dissertation
  'ch3-bridge': {
    id: 'ch3-bridge', speaker: 'emeka', expression: 'serious',
    text: 'You know what this chart shows me? It is not that we were unlucky. It is that every advantage we had, the oil, the people, the land, we found a way to turn into a constraint.',
    next: 'ch3-bridge-2',
  },

  'ch3-bridge-2': {
    id: 'ch3-bridge-2', speaker: 'jiho', expression: 'quiet',
    text: 'And every constraint we had: no resources, no land, a war that destroyed everything. We found a way to turn it into a reason to build.',
    next: 'ch3-bridge-3',
  },

  'ch3-bridge-3': {
    id: 'ch3-bridge-3', speaker: 'emeka', expression: 'serious',
    text: 'Is that the lesson? Is that what you want the person reading this to walk away with?',
    next: 'ch3-bridge-4',
  },

  'ch3-bridge-4': {
    id: 'ch3-bridge-4', speaker: 'jiho', expression: 'quiet',
    text: 'I want them to walk away with the data. And their own conclusion.',
    next: 'ch3-bridge-5',
  },

  'ch3-bridge-5': {
    id: 'ch3-bridge-5', speaker: 'emeka', expression: 'serious',
    text: 'Then let us each say what we believe. Not what the data says. The data says what it says. What we each think it means.',
    next: 'dis-1',
  },

  // ═══════════════════════════════════════════════════════════
  // FINAL DISSERTATION — 4 ALTERNATING SEGMENTS
  // ═══════════════════════════════════════════════════════════

  'dis-1': {
    id: 'dis-1', speaker: 'jiho', expression: 'neutral',
    text: 'Korea in 1952 had nothing. No resources, no intact infrastructure. A war had destroyed what little had been built. What Korea had was a government willing to plan deliberately, a population accustomed to sacrifice, the geopolitical position that brought American aid and market access at exactly the right moment, and the pressure that comes from having no alternative. We built things. Textiles, then steel, then ships, then semiconductors. Each industry more complex than the last, each requiring more investment in people and institutions.',
    next: 'dis-2',
  },

  'dis-2': {
    id: 'dis-2', speaker: 'emeka', expression: 'serious',
    text: 'Nigeria had oil. We had land, people, and a head start on virtually every metric that 1952 economists used to predict development. What we did not have was the pressure Korea had, the geopolitical position Korea had, or the favourable external conditions Korea had. We inherited colonial export contracts at independence. We fought a civil war during the critical industrialisation window. The oil was not a gift. It was an anaesthetic. It made the urgency of building disappear, it bypassed the citizen state accountability mechanism, and it created a volatility that made long-term institutional planning almost impossible.',
    next: 'dis-3',
  },

  'dis-3': {
    id: 'dis-3', speaker: 'jiho', expression: 'quiet',
    text: 'We built under authoritarian rule for thirty years, and the price of that bargain is something Koreans still negotiate with our own history. But the chart is what it is. Fifty-five years later a Korean worker earns more than eleven times what a Nigerian worker earns. A Korean child born today will live, on average, thirty-two years longer. The path was hard. Parts of it I am not comfortable with in retrospect. But it existed, it worked, and other countries are walking versions of it right now.',
    next: 'dis-4',
  },

  'dis-4': {
    id: 'dis-4', speaker: 'emeka', expression: 'serious',
    text: 'We faced structural adjustment programmes that mandated cuts to health and education exactly when investment in those areas was most needed. Four hundred billion dollars of Nigerian oil revenue was lost to corruption that the oil itself made structurally possible at that scale. None of this absolves Nigerian governments of responsibility for what they did with what they had. But it does mean the playing field was profoundly uneven, in ways the GDP chart alone cannot show you.\n\nNow we sit in 2007 at the level Korea was at in 1952. That fifty-five year gap is not an abstraction. It is the difference between a life of dignity and a life of struggle for millions of people who deserved better.',
    next: 'final-choice',
  },

  // ═══════════════════════════════════════════════════════════
  // FINAL CHOICE
  // ═══════════════════════════════════════════════════════════

  'final-choice': {
    id: 'final-choice', speaker: 'choice',
    prompt: 'Having heard both arguments, which interpretation is more compelling to you?',
    choices: [
      {
        text: 'Korea\'s story shows that deliberate policy and planning can overcome a difficult starting position. The model is hard but replicable for any country able to find the external support needed to make it work.',
        isD: true, next: '__ending-A',
      },
      {
        text: 'Nigeria\'s story shows that oil dependency is a structural trap and that external conditions profoundly shape what domestic policy can achieve. Understanding the divergence requires looking at what oil prevented from being built.',
        isD: true, next: '__ending-B',
      },
    ],
  },

};

// Special: ending navigation nodes
(function patchStory() {
  var S = window.STORY;
  S['__ending-A'] = { id: '__ending-A', speaker: 'narrator', text: '.', _navigate: 'ending.html?end=A' };
  S['__ending-B'] = { id: '__ending-B', speaker: 'narrator', text: '.', _navigate: 'ending.html?end=B' };
  S['__ending-C'] = { id: '__ending-C', speaker: 'narrator', text: '.', _navigate: 'ending.html?end=C' };

  // Option C in Chapter 3 choices leads to ch3-bridge after reactions complete
  // We patch the choice node to add a dedicated advance after option C reactions
  // (handled by the isD chapter advancement pattern in engine.js)

  // ch1 Option C is handled via isD path → ch1-optionC-1
  // ch2 Option C is handled via isD path → ch2-bridge-1
  // ch3 choices have no isD — after reactions, bridge is reached via separate node chain
  // Add a helper: after ch3 option reactions player clicks to advance to bridge
  // But engine stops after reactions. We attach ch3-bridge as accessible via the
  // "continue" path after ch3 option C reaction sequence.
  // Simplest approach: option C in ch3-choices has an isD path that routes to ch3-bridge
})();
