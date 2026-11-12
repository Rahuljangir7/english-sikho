import type { Lesson, Module, ModuleSeed } from '@/types/curriculum'

export const curriculumSeed: ModuleSeed[] = [
  {
    id: 'foundation',
    title: 'Foundation',
    titleHi: 'नींव (यहीं से शुरू करो)',
    desc: 'Tense se pehle ye 3 cheezein clear karo. Iske bina tense samajh nahi aayega.',
    emoji: '🧱',
    accent: 'amber',
    lessons: [
      {
        id: 'sentence-ka-dhancha',
        title: 'Sentence ka Dhancha',
        titleHi: 'वाक्य की बनावट — Subject, Verb, Object',
        summary: 'Kaun + kya karta hai + kis pe. Bas itna.',
        concept: [
          'Sentence ka matlab hai ek poora vichaar (complete idea). Har sentence me 3 cheezein hoti hain: **Subject (kaun)**, **Verb (kya karta hai)** aur **Object (kis pe / kis cheez pe)**.',
          'Subject = jo kaam kar raha hai (I, You, He, She, Rahul, The dog). Verb = kaam (eat, go, play, is, have). Object = jispe kaam ho raha hai (a ball, rice, school).',
          'Zaroori nahi ki har sentence me object ho. Jaise "I sleep." me object nahi hai, phir bhi sentence poora hai.',
        ],
        formula: {
          positive: 'Subject + Verb + Object',
          negative: 'Subject + helping verb + not + Verb + Object',
          question: 'Helping verb + Subject + Verb + Object?',
        },
        examples: [
          { en: 'I eat rice.', hi: 'मैं चावल खाता हूँ।', note: 'I = subject, eat = verb, rice = object' },
          { en: 'She reads a book.', hi: 'वह किताब पढ़ती है।' },
          { en: 'They play football.', hi: 'वे फुटबॉल खेलते हैं।' },
          { en: 'I sleep.', hi: 'मैं सोता हूँ।', note: 'Yahan koi object nahi hai — phir bhi sahi hai.' },
        ],
        signals: [],
        rules: [
          'Sentence ka pehla akshar (capital letter) hamesha capital hota hai.',
          'Sentence ke end me full stop (.) lagao.',
          'Subject ke hisaab se verb badalta hai — I eat, but She eats.',
        ],
        mistakes: [
          { wrong: 'Rice eat I.', right: 'I eat rice.', why: 'English me pehle Subject aata hai, phir Verb, phir Object.' },
          { wrong: 'I eats rice.', right: 'I eat rice.', why: 'I ke saath verb ki V1 (eat) aati hai, -s nahi lagti.' },
        ],
        quiz: [
          {
            q: '"Rahul kicks the ball." — isme Verb kaunsa hai?',
            options: ['Rahul', 'kicks', 'the ball', 'none'],
            answer: 1,
            explain: 'kicks = kaam, isliye ye Verb hai. Rahul = subject, the ball = object.',
          },
          {
            q: 'Sahi sentence chuno:',
            options: ['Book reads She.', 'She reads book a.', 'She reads a book.', 'Reads she a book.'],
            answer: 2,
            explain: 'Subject (She) + Verb (reads) + Object (a book) — yehi sahi order hai.',
          },
          {
            q: '"They ___ cricket." — sahi verb kaunsa hai?',
            options: ['plays', 'play', 'playing', 'played'],
            answer: 1,
            explain: 'They ke saath V1 (play) lagti hai, -s nahi.',
          },
          {
            q: 'Object kaun hai: "Maa khaana banati hai." (Maa cooks the food.)',
            options: ['Maa', 'cooks', 'the food', 'koi nahi'],
            answer: 2,
            explain: 'the food = jispe kaam ho raha hai, wahi object hai.',
          },
        ],
      },
      {
        id: 'verb-ke-5-roop',
        title: 'Verb ke 5 Forms (V1 se V5)',
        titleHi: 'क्रिया के पाँच रूप — यही tense की चाबी है',
        summary: 'V1, V2, V3, V4, V5 — ye yaad ho gaye to tense aasan ho jayega.',
        concept: [
          'Ek verb ke 5 roop hote hain. Har tense inhi roop ko use karta hai. Ye 5 seekh liye to aadha tense samajh gaye!',
          '**V1** = basic form (go, eat, play). **V2** = past form (went, ate, played). **V3** = past participle (gone, eaten, played). **V4** = ing form (going, eating, playing). **V5** = s/es form (goes, eats, plays).',
          'Kuch verbs "regular" hote hain — unme V2 aur V3 me bas "-ed" lagta hai (play → played → played). Kuch "irregular" hote hain — unhe ratna padta hai (go → went → gone).',
        ],
        formula: {
          positive: 'V1 (base) | V2 (past) | V3 (past participle) | V4 (ing) | V5 (s/es)',
          negative: 'Irregular verbs ki list yaad karo — go/went/gone jaise.',
          question: 'Tense me V1, V2, V3, V4, V5 kab use hote hain? (aage har lesson me)',
        },
        examples: [
          { en: 'go → went → gone → going → goes', hi: 'जाना', note: 'V1 → V2 → V3 → V4 → V5' },
          { en: 'eat → ate → eaten → eating → eats', hi: 'खाना' },
          { en: 'play → played → played → playing → plays', hi: 'खेलना (regular)' },
          { en: 'write → wrote → written → writing → writes', hi: 'लिखना' },
        ],
        signals: [],
        rules: [
          'V3 ke saath hamesha helping verb lagti hai (have/has/had/is/was) — akele V3 use nahi hota.',
          'V4 (ing) ke saath bhi helping verb chahiye (is/am/are/was/were).',
          'He/She/It ke saath present me V5 (s/es wali) lagti hai.',
        ],
        mistakes: [
          { wrong: 'I have went to Delhi.', right: 'I have gone to Delhi.', why: 'have ke baad V3 (gone) aata hai, V2 (went) nahi.' },
          { wrong: 'She is goes to school.', right: 'She goes to school.', why: 'V5 (goes) akele aata hai, iske saath "is" nahi lagta.' },
        ],
        quiz: [
          {
            q: '"write" ka V3 kaunsa hai?',
            options: ['wrote', 'written', 'writing', 'writes'],
            answer: 1,
            explain: 'write → wrote (V2) → written (V3).',
          },
          {
            q: '"eat" ka V4 kaunsa hai?',
            options: ['eaten', 'ate', 'eating', 'eats'],
            answer: 2,
            explain: 'V4 hamesha "-ing" wala roop hota hai: eating.',
          },
          {
            q: 'Sahi sentence chuno:',
            options: ['I have ate.', 'I have eaten.', 'I have eating.', 'I eat eaten.'],
            answer: 1,
            explain: 'have/has ke baad hamesha V3 (eaten) aata hai.',
          },
          {
            q: '"go" ka V2 kaunsa hai?',
            options: ['goed', 'gone', 'went', 'going'],
            answer: 2,
            explain: 'go ek irregular verb hai: go → went (V2) → gone (V3).',
          },
        ],
      },
      {
        id: 'helping-verbs',
        title: 'Helping Verbs (Sahayak Kriya)',
        titleHi: 'सहायक क्रिया — is/am/are, has/have, did, will',
        summary: 'Ye chote words sentence ka mood (time + sawaal/na) banate hain.',
        concept: [
          'Helping verbs woh chote words hain jo main verb ke pehle aate hain. Ye batate hain ki kaam kab ho raha hai aur sentence positive/negative/question hai.',
          'Be verbs: **is, am, are** (present), **was, were** (past). Ye V4 (ing) ke saath aate hain — jaise "He is playing."',
          'Have verbs: **has, have** (present), **had** (past). Ye V3 ke saath aate hain — jaise "He has eaten."',
          'Do verbs: **do, does** (present), **did** (past). Ye negative aur question banane me use hote hain.',
          'Future ke liye: **will** (aur kabhi shall).',
        ],
        formula: {
          positive: 'He is eating. | She has eaten. | I will go.',
          negative: 'He is not eating. | She has not eaten. | I will not go.',
          question: 'Is he eating? | Has she eaten? | Will I go?',
        },
        examples: [
          { en: 'I am a developer.', hi: 'मैं एक डेवलपर हूँ।', note: 'am = be verb' },
          { en: 'She is cooking.', hi: 'वह खाना बना रही है।' },
          { en: 'They have finished.', hi: 'वे खत्म कर चुके हैं।' },
          { en: 'Do you know me?', hi: 'क्या तुम मुझे जानते हो?', note: 'Do = question me' },
          { en: 'I did not sleep.', hi: 'मैं सोया नहीं।', note: 'did not = negative me' },
        ],
        signals: [],
        rules: [
          'I ke saath "am", He/She/It ke saath "is", You/We/They ke saath "are".',
          'I/You/We/They ke saath "have", He/She/It ke saath "has".',
          'Negative me "not" helping verb ke baad aata hai (is not, have not, will not).',
        ],
        mistakes: [
          { wrong: 'He are playing.', right: 'He is playing.', why: 'He ke saath hamesha "is" lagta hai.' },
          { wrong: 'I not go.', right: 'I do not go.', why: 'Negative banane ke liye helping verb (do) chahiye.' },
        ],
        quiz: [
          {
            q: 'He ___ reading a book.',
            options: ['am', 'is', 'are', 'be'],
            answer: 1,
            explain: 'He ke saath "is" aata hai.',
          },
          {
            q: 'They ___ completed the work. (present perfect)',
            options: ['has', 'have', 'is', 'did'],
            answer: 1,
            explain: 'They ke saath "have" aata hai.',
          },
          {
            q: 'Sahi negative chuno (Present Simple):',
            options: ['He not plays.', 'He does not play.', 'He is not play.', 'He do not plays.'],
            answer: 1,
            explain: 'He ke saath "does not" + V1 (play).',
          },
          {
            q: 'I ___ go tomorrow.',
            options: ['will', 'am', 'has', 'did'],
            answer: 0,
            explain: 'Future ke liye "will" use hota hai.',
          },
        ],
      },
    ],
  },
  {
    id: 'present',
    title: 'Present Tense',
    titleHi: 'वर्तमान काल — ab kya ho raha hai',
    desc: 'Aaj, rozana, abhi — present tense ke 4 roop.',
    emoji: '🌤️',
    accent: 'indigo',
    lessons: [
      {
        id: 'present-simple',
        title: 'Present Simple',
        titleHi: 'सामान्य वर्तमान काल',
        summary: 'Aadat, routine aur hamesha sach wali baatein.',
        concept: [
          'Present Simple tab use hota hai jab kaam **rozana** hota hai, ya koi **aadat** hai, ya koi **universal truth** hai.',
          'Jaise: "I go to office every day" (rozana), "She drinks tea" (aadat), "The sun rises in the east" (hamesha sach).',
          'Yaad rakho: He/She/It ke saath verb me **-s ya -es** lagti hai. I/You/We/They ke saath V1 (simple) rehti hai.',
        ],
        formula: {
          positive: 'Sub + V1 / V1+s/es + Obj  →  She plays. / They play.',
          negative: 'Sub + do/does + not + V1 + Obj  →  She does not play.',
          question: 'Do/Does + Sub + V1 + Obj?  →  Does she play?',
        },
        examples: [
          { en: 'I go to office every day.', hi: 'मैं रोज़ ऑफिस जाता हूँ।' },
          { en: 'She drinks tea in the morning.', hi: 'वह सुबह चाय पीती है।' },
          { en: 'They do not watch TV.', hi: 'वे टीवी नहीं देखते।' },
          { en: 'Does he work here?', hi: 'क्या वह यहाँ काम करता है?' },
        ],
        signals: ['every day', 'always', 'usually', 'often', 'sometimes', 'never', 'daily'],
        rules: [
          'He/She/It ke saath verb me -s/-es lagao (go → goes, watch → watches).',
          'Negative/Question me verb ki V1 aati hai, -s hatti hai (She does not go, Does she go?).',
          'Frequency words (always, never) aam taur pe main verb se pehle aate hain.',
        ],
        mistakes: [
          { wrong: 'He go to school every day.', right: 'He goes to school every day.', why: 'He ke saath V5 (goes) lagti hai.' },
          { wrong: 'Does she goes to school?', right: 'Does she go to school?', why: 'Question me "does" ke baad verb ki V1 (go) aati hai.' },
        ],
        quiz: [
          {
            q: 'She ___ to music every night.',
            options: ['listen', 'listens', 'listening', 'listened'],
            answer: 1,
            explain: 'She ke saath V5 (listens) lagti hai.',
          },
          {
            q: 'Correct negative chuno:',
            options: ['They not like tea.', 'They do not like tea.', 'They does not like tea.', 'They not likes tea.'],
            answer: 1,
            explain: 'They ke saath "do not" + V1 (like).',
          },
          {
            q: '___ he speak English?',
            options: ['Do', 'Does', 'Is', 'Has'],
            answer: 1,
            explain: 'He ke saath question me "Does" aata hai.',
          },
          {
            q: 'Present Simple ke signal word kaunsa hai?',
            options: ['yesterday', 'right now', 'usually', 'tomorrow'],
            answer: 2,
            explain: '"usually" rozana/aadat batata hai — ye Present Simple ka signal hai.',
          },
        ],
      },
      {
        id: 'present-continuous',
        title: 'Present Continuous',
        titleHi: 'अपूर्ण वर्तमान काल',
        summary: 'Jo kaam abhi is waqt ho raha hai.',
        concept: [
          'Present Continuous tab use hota hai jab kaam **abhi is samay** chal raha ho, "right now".',
          'Iska format: **is/am/are + V4 (ing)**. Jaise "I am eating" = main abhi kha raha hoon.',
          'Ye aage ke plans ke liye bhi use hota hai: "I am meeting him tomorrow" (fixed plan).',
        ],
        formula: {
          positive: 'Sub + is/am/are + V4 + Obj  →  She is playing.',
          negative: 'Sub + is/am/are + not + V4 + Obj  →  She is not playing.',
          question: 'Is/Am/Are + Sub + V4 + Obj?  →  Is she playing?',
        },
        examples: [
          { en: 'I am learning English.', hi: 'मैं अंग्रेज़ी सीख रहा हूँ।' },
          { en: 'They are playing cricket.', hi: 'वे क्रिकेट खेल रहे हैं।' },
          { en: 'She is not cooking now.', hi: 'वह अभी खाना नहीं बना रही।' },
          { en: 'Are you listening to me?', hi: 'क्या तुम मेरी बात सुन रहे हो?' },
        ],
        signals: ['now', 'right now', 'at the moment', 'currently', 'look!', 'listen!'],
        rules: [
          'I ke saath "am", He/She/It ke saath "is", You/We/They ke saath "are".',
          'Kuch verbs me ing lagane se pehle spelling badalti hai: run → running, write → writing.',
          'Feel/understand/know jaise verbs aam taur pe continuous me use nahi hote (I know, not I am knowing).',
        ],
        mistakes: [
          { wrong: 'She is play cricket.', right: 'She is playing cricket.', why: 'is/are ke baad verb ki V4 (ing) aati hai.' },
          { wrong: 'I am knowing the answer.', right: 'I know the answer.', why: '"know" ek state verb hai, ise continuous me nahi likhte.' },
        ],
        quiz: [
          {
            q: 'They ___ studying now.',
            options: ['is', 'am', 'are', 'be'],
            answer: 2,
            explain: 'They ke saath "are" aata hai.',
          },
          {
            q: 'I ___ writing a message.',
            options: ['am', 'is', 'are', 'have'],
            answer: 0,
            explain: 'I ke saath "am" aata hai.',
          },
          {
            q: 'Sahi sentence chuno:',
            options: ['She is run.', 'She is running.', 'She running is.', 'She are running.'],
            answer: 1,
            explain: 'is + V4 (running) — sahi format.',
          },
          {
            q: 'Present Continuous ke signal word kaunsa hai?',
            options: ['every day', 'right now', 'last week', 'never'],
            answer: 1,
            explain: '"right now" batata hai ki kaam abhi ho raha hai.',
          },
        ],
      },
      {
        id: 'present-perfect',
        title: 'Present Perfect',
        titleHi: 'पूर्ण वर्तमान काल',
        summary: 'Kaam ho chuka hai, par uska asar aaj bhi hai.',
        concept: [
          'Present Perfect tab use hota hai jab kaam **abhi abhi poora hua** ho ya uska **result present me dikh raha** ho.',
          'Format: **has/have + V3**. Jaise "I have finished my work" = maine apna kaam khatam kar liya (ab result hai).',
          'Agar time nahi diya gaya ki kab hua (just, already, yet, ever, never) — to Present Perfect use hota hai.',
        ],
        formula: {
          positive: 'Sub + has/have + V3 + Obj  →  She has finished.',
          negative: 'Sub + has/have + not + V3 + Obj  →  She has not finished.',
          question: 'Has/Have + Sub + V3 + Obj?  →  Has she finished?',
        },
        examples: [
          { en: 'I have completed the project.', hi: 'मैंने प्रोजेक्ट पूरा कर लिया है।' },
          { en: 'She has just left.', hi: 'वह अभी-अभी निकली है।' },
          { en: 'We have not eaten yet.', hi: 'हमने अभी तक खाया नहीं है।' },
          { en: 'Have you ever been to Delhi?', hi: 'क्या तुम कभी दिल्ली गए हो?' },
        ],
        signals: ['just', 'already', 'yet', 'ever', 'never', 'so far', 'recently'],
        rules: [
          'I/You/We/They ke saath "have", He/She/It ke saath "has".',
          'has/have ke baad hamesha V3 aata hai (done, eaten, gone).',
          '"yesterday", "last week" jaise past time ke saath Present Perfect use nahi karte — wahan Past Simple lagta hai.',
        ],
        mistakes: [
          { wrong: 'I have finish my work.', right: 'I have finished my work.', why: 'have ke baad V3 (finished) chahiye.' },
          { wrong: 'I have gone to Mumbai yesterday.', right: 'I went to Mumbai yesterday.', why: 'Past time (yesterday) ke saath Past Simple use hota hai.' },
        ],
        quiz: [
          {
            q: 'She ___ finished her homework.',
            options: ['have', 'has', 'is', 'did'],
            answer: 1,
            explain: 'She ke saath "has" aata hai.',
          },
          {
            q: 'Correct sentence chuno:',
            options: ['I have ate.', 'I have eaten.', 'I have eat.', 'I has eaten.'],
            answer: 1,
            explain: 'have ke baad V3 (eaten) aata hai.',
          },
          {
            q: 'We ___ not completed it yet.',
            options: ['has', 'have', 'are', 'did'],
            answer: 1,
            explain: 'We ke saath "have" aata hai.',
          },
          {
            q: 'Present Perfect ka signal word kaunsa hai?',
            options: ['yesterday', 'just', 'tomorrow', 'every day'],
            answer: 1,
            explain: '"just" (abhi abhi) Present Perfect ka signal hai.',
          },
        ],
      },
      {
        id: 'present-perfect-continuous',
        title: 'Present Perfect Continuous',
        titleHi: 'पूर्ण अपूर्ण वर्तमान काल',
        summary: 'Kaam pehle shuru hua aur abhi bhi chal raha hai.',
        concept: [
          'Ye tense batata hai ki kaam **past me shuru hua** aur **abhi bhi jaari hai** (aur kuch samay se ho raha hai).',
          'Format: **has/have been + V4 (ing) + since/for**. Jaise "I have been working since morning" = main subah se kaam kar raha hoon.',
          '**Since** = shuru ka point (since 2020, since Monday). **For** = kitna time (for 2 hours, for 3 years).',
        ],
        formula: {
          positive: 'Sub + has/have + been + V4 + since/for ...  →  I have been working for 3 years.',
          negative: 'Sub + has/have + not + been + V4 ...  →  I have not been working.',
          question: 'Has/Have + Sub + been + V4 ...?  →  Have you been working?',
        },
        examples: [
          { en: 'I have been learning English since January.', hi: 'मैं जनवरी से अंग्रेज़ी सीख रहा हूँ।' },
          { en: 'She has been teaching for 5 years.', hi: 'वह 5 साल से पढ़ा रही है।' },
          { en: 'They have not been coming lately.', hi: 'वे हाल में आ नहीं रहे।' },
          { en: 'How long have you been waiting?', hi: 'तुम कितनी देर से इंतज़ार कर रहे हो?' },
        ],
        signals: ['since', 'for', 'how long', 'lately', 'all day'],
        rules: [
          'since = shuru ka time/point, for = duration (kitna samay).',
          'I/You/We/They → have been; He/She/It → has been.',
          'been ke baad hamesha V4 (ing) aata hai.',
        ],
        mistakes: [
          { wrong: 'I have been work since morning.', right: 'I have been working since morning.', why: 'been ke baad V4 (working) chahiye.' },
          { wrong: 'I am working here since 2019.', right: 'I have been working here since 2019.', why: 'since ke saath Present Perfect Continuous use hota hai.' },
        ],
        quiz: [
          {
            q: 'He ___ been playing for two hours.',
            options: ['have', 'has', 'is', 'had'],
            answer: 1,
            explain: 'He ke saath "has" aata hai.',
          },
          {
            q: 'She has been studying ___ morning.',
            options: ['for', 'since', 'from', 'at'],
            answer: 1,
            explain: 'since = shuru ka point (morning) batane ke liye.',
          },
          {
            q: 'Correct sentence chuno:',
            options: ['They have been wait.', 'They have been waiting.', 'They has been waiting.', 'They have waiting.'],
            answer: 1,
            explain: 'have + been + V4 (waiting) — sahi format.',
          },
          {
            q: '"for 3 years" ka matlab?',
            options: ['3 saal ka point', '3 saal ki duration', '3 saal pehle', '3 saal baad'],
            answer: 1,
            explain: '"for" duration batata hai (kitne samay se).',
          },
        ],
      },
    ],
  },
  {
    id: 'past',
    title: 'Past Tense',
    titleHi: 'भूतकाल — jo guzar gaya',
    desc: 'Kal hua, pehle hua — past tense ke 4 roop.',
    emoji: '🌙',
    accent: 'rose',
    lessons: [
      {
        id: 'past-simple',
        title: 'Past Simple',
        titleHi: 'सामान्य भूतकाल',
        summary: 'Kaam past me hua aur khatam ho gaya.',
        concept: [
          'Past Simple tab use hota hai jab kaam **past me hua** aur **poora khatam** ho gaya. Uska time bhi pata hota hai.',
          'Format: **V2** (verb ki second form). Jaise "I went to Delhi yesterday" = main kal dilli gaya.',
          'Negative/Question me **did + not + V1** / **Did + Sub + V1** use hota hai (did ke baad V2 nahi, V1 aati hai).',
        ],
        formula: {
          positive: 'Sub + V2 + Obj  →  She played.',
          negative: 'Sub + did + not + V1 + Obj  →  She did not play.',
          question: 'Did + Sub + V1 + Obj?  →  Did she play?',
        },
        examples: [
          { en: 'I went to Mumbai yesterday.', hi: 'मैं कल मुंबई गया।' },
          { en: 'She studied hard last night.', hi: 'उसने कल रात कड़ी मेहनत की।' },
          { en: 'We did not watch the movie.', hi: 'हमने फिल्म नहीं देखी।' },
          { en: 'Did you call me?', hi: 'क्या तुमने मुझे फोन किया?' },
        ],
        signals: ['yesterday', 'last night', 'last week', 'ago', 'in 2019', 'then'],
        rules: [
          'Regular verbs me V2 = V1 + ed (play → played).',
          'Irregular verbs ka V2 yaad karo (go → went, eat → ate).',
          'Negative/Question me "did" ke baad V1 aati hai, V2 nahi.',
        ],
        mistakes: [
          { wrong: 'I did not went there.', right: 'I did not go there.', why: 'did ke baad V1 (go) aati hai.' },
          { wrong: 'She goed to school.', right: 'She went to school.', why: 'go irregular hai, V2 = went.' },
        ],
        quiz: [
          {
            q: 'I ___ to the market yesterday.',
            options: ['go', 'goes', 'went', 'gone'],
            answer: 2,
            explain: 'yesterday ke saath Past Simple (went) aata hai.',
          },
          {
            q: 'She ___ not come to the party.',
            options: ['do', 'does', 'did', 'was'],
            answer: 2,
            explain: 'Past negative me "did not" use hota hai.',
          },
          {
            q: 'Correct question chuno:',
            options: ['Did you called me?', 'Did you call me?', 'Do you called me?', 'You did call me?'],
            answer: 1,
            explain: 'Did ke baad V1 (call) aati hai.',
          },
          {
            q: 'Past Simple ka signal word kaunsa hai?',
            options: ['yesterday', 'tomorrow', 'now', 'since'],
            answer: 0,
            explain: '"yesterday" past time batata hai.',
          },
        ],
      },
      {
        id: 'past-continuous',
        title: 'Past Continuous',
        titleHi: 'अपूर्ण भूतकाल',
        summary: 'Past me koi kaam chal raha tha (aur beech me kuch hua).',
        concept: [
          'Past Continuous batata hai ki past me **koi kaam chal raha tha** ek khaas samay par.',
          'Format: **was/were + V4 (ing)**. Jaise "I was sleeping at 10 pm" = main 10 baje so raha tha.',
          'Aksar do kaam saath dikhate hain: "I was cooking when he came" — cooking chal raha tha, tabhi wo aaya.',
        ],
        formula: {
          positive: 'Sub + was/were + V4 + Obj  →  She was reading.',
          negative: 'Sub + was/were + not + V4 + Obj  →  She was not reading.',
          question: 'Was/Were + Sub + V4 + Obj?  →  Was she reading?',
        },
        examples: [
          { en: 'I was watching TV at 9 pm.', hi: 'मैं 9 बजे टीवी देख रहा था।' },
          { en: 'They were playing when it rained.', hi: 'जब बारिश हुई तब वे खेल रहे थे।' },
          { en: 'She was not listening.', hi: 'वह सुन नहीं रही थी।' },
          { en: 'Were you sleeping?', hi: 'क्या तुम सो रहे थे?' },
        ],
        signals: ['while', 'when', 'at that time', 'all day yesterday'],
        rules: [
          'I/He/She/It ke saath "was", You/We/They ke saath "were".',
          'was/were ke baad hamesha V4 (ing) aata hai.',
          '"while" aam taur pe continuous action ke saath, "when" short action ke saath.',
        ],
        mistakes: [
          { wrong: 'They was playing.', right: 'They were playing.', why: 'They ke saath "were" aata hai.' },
          { wrong: 'I was watch TV.', right: 'I was watching TV.', why: 'was ke baad V4 (watching) chahiye.' },
        ],
        quiz: [
          {
            q: 'They ___ playing football at 5 pm.',
            options: ['was', 'were', 'is', 'are'],
            answer: 1,
            explain: 'They ke saath "were" aata hai.',
          },
          {
            q: 'I ___ reading when he called.',
            options: ['was', 'were', 'am', 'is'],
            answer: 0,
            explain: 'I ke saath "was" aata hai.',
          },
          {
            q: 'Correct sentence chuno:',
            options: ['She was cook.', 'She was cooking.', 'She were cooking.', 'She is cooking.'],
            answer: 1,
            explain: 'was + V4 (cooking) — sahi format.',
          },
          {
            q: 'Past Continuous ke signal word kaunsa hai?',
            options: ['while', 'every day', 'will', 'just'],
            answer: 0,
            explain: '"while" do chalte hue kaam jodta hai.',
          },
        ],
      },
      {
        id: 'past-perfect',
        title: 'Past Perfect',
        titleHi: 'पूर्ण भूतकाल',
        summary: 'Past me ek kaam doosre se pehle khatam hua.',
        concept: [
          'Past Perfect batata hai ki past me **ek kaam doosre kaam se pehle** poora ho gaya tha.',
          'Format: **had + V3**. Jaise "The train had left before I reached" = gaadi mere pahunchne se pehle ja chuki thi.',
          'Isme hamesha do past actions hote hain — jo pehle hua uske liye Past Perfect, jo baad me hua uske liye Past Simple.',
        ],
        formula: {
          positive: 'Sub + had + V3 + Obj  →  She had left.',
          negative: 'Sub + had + not + V3 + Obj  →  She had not left.',
          question: 'Had + Sub + V3 + Obj?  →  Had she left?',
        },
        examples: [
          { en: 'I had finished my work before he came.', hi: 'वह आने से पहले मैं अपना काम खत्म कर चुका था।' },
          { en: 'She had already left.', hi: 'वह पहले ही जा चुकी थी।' },
          { en: 'We had not met before.', hi: 'हम पहले मिले नहीं थे।' },
          { en: 'Had you eaten before the class?', hi: 'क्या तुम क्लास से पहले खा चुके थे?' },
        ],
        signals: ['before', 'after', 'already', 'by the time', 'when'],
        rules: [
          'Sabhi subjects (I/You/He/She/We/They) ke saath "had" hi lagta hai.',
          'had ke baad hamesha V3 (left, eaten, gone) aata hai.',
          '"before" wale part me aksar Past Perfect, "when/after" wale me Past Simple.',
        ],
        mistakes: [
          { wrong: 'I had went there.', right: 'I had gone there.', why: 'had ke baad V3 (gone) aata hai.' },
          { wrong: 'She had leave before I came.', right: 'She had left before I came.', why: 'had ke baad V3 (left) chahiye.' },
        ],
        quiz: [
          {
            q: 'She ___ finished before I arrived.',
            options: ['have', 'has', 'had', 'did'],
            answer: 2,
            explain: 'Past me pehla kaam = had + V3.',
          },
          {
            q: 'Correct sentence chuno:',
            options: ['I had ate.', 'I had eaten.', 'I had eat.', 'I have ate.'],
            answer: 1,
            explain: 'had ke baad V3 (eaten) aata hai.',
          },
          {
            q: 'The bus ___ left before we reached.',
            options: ['have', 'had', 'has', 'did'],
            answer: 1,
            explain: 'Do past actions me pehla = had left.',
          },
          {
            q: 'Past Perfect ka format kya hai?',
            options: ['had + V3', 'was + V4', 'did + V1', 'has + V3'],
            answer: 0,
            explain: 'Past Perfect = had + V3.',
          },
        ],
      },
      {
        id: 'past-perfect-continuous',
        title: 'Past Perfect Continuous',
        titleHi: 'पूर्ण अपूर्ण भूतकाल',
        summary: 'Past me koi kaam kuch samay se chal raha tha.',
        concept: [
          'Past Perfect Continuous batata hai ki past me koi kaam **ek samay se chal raha tha** jab kuch aur hua.',
          'Format: **had been + V4 (ing) + since/for**. Jaise "I had been waiting for 2 hours when he arrived."',
          'Ye Past Perfect (had + V3) ka "chalte rehne wala" version hai.',
        ],
        formula: {
          positive: 'Sub + had been + V4 + since/for ...  →  They had been playing for an hour.',
          negative: 'Sub + had not been + V4 ...  →  They had not been playing.',
          question: 'Had + Sub + been + V4 ...?  →  Had they been playing?',
        },
        examples: [
          { en: 'I had been working since morning when he called.', hi: 'जब उसने फोन किया, मैं सुबह से काम कर रहा था।' },
          { en: 'They had been waiting for an hour.', hi: 'वे एक घंटे से इंतज़ार कर रहे थे।' },
          { en: 'She had not been feeling well.', hi: 'वह ठीक महसूस नहीं कर रही थी।' },
          { en: 'Had you been studying all night?', hi: 'क्या तुम रात भर पढ़ रहे थे?' },
        ],
        signals: ['since', 'for', 'how long', 'before', 'all day'],
        rules: [
          'Sabhi subjects ke saath "had been" hi lagta hai.',
          'been ke baad hamesha V4 (ing) aata hai.',
          'since = point, for = duration — Present Perfect Continuous jaise hi.',
        ],
        mistakes: [
          { wrong: 'He had been wait for an hour.', right: 'He had been waiting for an hour.', why: 'been ke baad V4 (waiting) chahiye.' },
          { wrong: 'They had being playing.', right: 'They had been playing.', why: 'sahi helper "been" hai, "being" nahi.' },
        ],
        quiz: [
          {
            q: 'They ___ been playing since noon.',
            options: ['have', 'has', 'had', 'was'],
            answer: 2,
            explain: 'Past me duration = had been + V4.',
          },
          {
            q: 'She had been working ___ two hours.',
            options: ['since', 'for', 'from', 'at'],
            answer: 1,
            explain: '"for" duration (2 hours) ke liye.',
          },
          {
            q: 'Correct sentence chuno:',
            options: ['I had been study.', 'I had been studying.', 'I have been studying.', 'I had being studying.'],
            answer: 1,
            explain: 'had + been + V4 (studying).',
          },
          {
            q: 'Past Perfect Continuous ka format?',
            options: ['had + V3', 'had been + V4', 'was + V4', 'will be + V4'],
            answer: 1,
            explain: 'Format = had been + V4.',
          },
        ],
      },
    ],
  },
  {
    id: 'future',
    title: 'Future Tense',
    titleHi: 'भविष्य काल — jo aage hoga',
    desc: 'Kal, agle saal, aage — future tense ke 4 roop.',
    emoji: '🌅',
    accent: 'emerald',
    lessons: [
      {
        id: 'future-simple',
        title: 'Future Simple',
        titleHi: 'सामान्य भविष्य काल',
        summary: 'Aage kya hoga — plan, vaada, prediction.',
        concept: [
          'Future Simple batata hai ki kaam **aage** hoga. Format: **will + V1**.',
          'Jaise "I will call you tomorrow" = main kal tumhe call karunga.',
          'Negative: **will not (won\'t) + V1**. Question: **Will + Subject + V1?**',
        ],
        formula: {
          positive: 'Sub + will + V1 + Obj  →  I will help you.',
          negative: 'Sub + will + not + V1 + Obj  →  I will not help you.',
          question: 'Will + Sub + V1 + Obj?  →  Will you help me?',
        },
        examples: [
          { en: 'I will call you tomorrow.', hi: 'मैं कल तुम्हें फोन करूँगा।' },
          { en: 'She will pass the exam.', hi: 'वह परीक्षा पास करेगी।' },
          { en: 'We will not give up.', hi: 'हम हार नहीं मानेंगे।' },
          { en: 'Will you come with me?', hi: 'क्या तुम मेरे साथ आओगे?' },
        ],
        signals: ['tomorrow', 'next week', 'soon', 'later', 'in future'],
        rules: [
          'Sabhi subjects ke saath "will" kaam karta hai (I/You/He/She/We/They).',
          'will ke baad hamesha V1 (base form) aati hai.',
          '"will" ka short form "won\'t" negative me use hota hai.',
        ],
        mistakes: [
          { wrong: 'I will called you.', right: 'I will call you.', why: 'will ke baad V1 (call) aati hai.' },
          { wrong: 'She wills go.', right: 'She will go.', why: 'will sab subjects ke saath same rehta hai, -s nahi.' },
        ],
        quiz: [
          {
            q: 'I ___ help you tomorrow.',
            options: ['will', 'am', 'was', 'did'],
            answer: 0,
            explain: 'Future = will + V1.',
          },
          {
            q: 'Correct sentence chuno:',
            options: ['She will goes.', 'She will go.', 'She wills go.', 'She will went.'],
            answer: 1,
            explain: 'will ke baad V1 (go).',
          },
          {
            q: 'Future negative kaunsa sahi hai?',
            options: ['I not will go.', 'I will not go.', 'I will no go.', 'I do not will go.'],
            answer: 1,
            explain: 'will + not + V1 — sahi order.',
          },
          {
            q: 'Future Simple ka signal word?',
            options: ['yesterday', 'now', 'tomorrow', 'already'],
            answer: 2,
            explain: '"tomorrow" future time batata hai.',
          },
        ],
      },
      {
        id: 'future-continuous',
        title: 'Future Continuous',
        titleHi: 'अपूर्ण भविष्य काल',
        summary: 'Future me koi kaam chal raha hoga.',
        concept: [
          'Future Continuous batata hai ki future me **koi kaam chal raha hoga** ek khaas samay par.',
          'Format: **will be + V4 (ing)**. Jaise "At 8 pm I will be studying" = 8 baje main padhai kar raha hounga.',
        ],
        formula: {
          positive: 'Sub + will be + V4 + Obj  →  I will be working.',
          negative: 'Sub + will not be + V4 + Obj  →  I will not be working.',
          question: 'Will + Sub + be + V4 + Obj?  →  Will you be working?',
        },
        examples: [
          { en: 'At 9 pm I will be sleeping.', hi: '9 बजे मैं सो रहा हूँगा।' },
          { en: 'They will be playing tomorrow.', hi: 'वे कल खेल रहे होंगे।' },
          { en: 'She will not be attending.', hi: 'वह शामिल नहीं हो रही होगी।' },
          { en: 'Will you be using the car?', hi: 'क्या तुम गाड़ी इस्तेमाल कर रहे होंगे?' },
        ],
        signals: ['at that time', 'this time tomorrow', 'still', 'meanwhile'],
        rules: [
          '"will be" sabhi subjects ke saath same rehta hai.',
          'be ke baad hamesha V4 (ing) aata hai.',
          'Ye aksar future ke kisi fixed samay ke saath aata hai (at 8 pm tomorrow).',
        ],
        mistakes: [
          { wrong: 'I will be work tomorrow.', right: 'I will be working tomorrow.', why: 'will be ke baad V4 (working) chahiye.' },
          { wrong: 'She will being study.', right: 'She will be studying.', why: 'sahi helper "be" hai, "being" nahi.' },
        ],
        quiz: [
          {
            q: 'At 7 pm I ___ be cooking.',
            options: ['will', 'am', 'was', 'had'],
            answer: 0,
            explain: 'Future Continuous = will be + V4.',
          },
          {
            q: 'Correct sentence chuno:',
            options: ['They will be play.', 'They will be playing.', 'They will playing.', 'They will be played.'],
            answer: 1,
            explain: 'will be + V4 (playing).',
          },
          {
            q: 'Future Continuous ka format?',
            options: ['will + V1', 'will be + V4', 'will have + V3', 'will have been + V4'],
            answer: 1,
            explain: 'will be + V4.',
          },
          {
            q: 'Future Continuous ke liye signal word?',
            options: ['every day', 'this time tomorrow', 'yesterday', 'since'],
            answer: 1,
            explain: '"this time tomorrow" future ke khaas samay ko batata hai.',
          },
        ],
      },
      {
        id: 'future-perfect',
        title: 'Future Perfect',
        titleHi: 'पूर्ण भविष्य काल',
        summary: 'Future me kisi samay tak kaam poora ho chuka hoga.',
        concept: [
          'Future Perfect batata hai ki future me **kisi waqt tak kaam poora ho chuka hoga**.',
          'Format: **will have + V3**. Jaise "By 5 pm I will have finished" = 5 baje tak main khatam kar chuka hounga.',
          '"by" (tak) is tense ka bada signal hai.',
        ],
        formula: {
          positive: 'Sub + will have + V3 + Obj  →  I will have finished.',
          negative: 'Sub + will not have + V3 + Obj  →  I will not have finished.',
          question: 'Will + Sub + have + V3 + Obj?  →  Will you have finished?',
        },
        examples: [
          { en: 'By 10 pm I will have slept.', hi: '10 बजे तक मैं सो चुका हूँगा।' },
          { en: 'She will have completed it by Monday.', hi: 'वह सोमवार तक इसे पूरा कर चुकी होगी।' },
          { en: 'We will not have reached by then.', hi: 'तब तक हम पहुँच चुके नहीं होंगे।' },
          { en: 'Will you have eaten by 8 pm?', hi: 'क्या तुम 8 बजे तक खा चुके होगे?' },
        ],
        signals: ['by', 'by then', 'by tomorrow', 'before'],
        rules: [
          '"will have" sabhi subjects ke saath same rehta hai.',
          'have ke baad hamesha V3 (finished, done) aata hai.',
          '"by + time" ka matlab hai "us waqt tak".',
        ],
        mistakes: [
          { wrong: 'I will have finish by 5.', right: 'I will have finished by 5.', why: 'will have ke baad V3 (finished) chahiye.' },
          { wrong: 'She will has done it.', right: 'She will have done it.', why: 'will ke baad hamesha "have", "has" nahi.' },
        ],
        quiz: [
          {
            q: 'By 6 pm I ___ have completed it.',
            options: ['will', 'am', 'was', 'had'],
            answer: 0,
            explain: 'Future Perfect = will have + V3.',
          },
          {
            q: 'Correct sentence chuno:',
            options: ['I will have ate.', 'I will have eaten.', 'I will have eat.', 'I will has eaten.'],
            answer: 1,
            explain: 'will have + V3 (eaten).',
          },
          {
            q: 'Future Perfect ka format?',
            options: ['will + V1', 'will be + V4', 'will have + V3', 'had + V3'],
            answer: 2,
            explain: 'will have + V3.',
          },
          {
            q: 'Future Perfect ka bada signal word kaunsa hai?',
            options: ['now', 'by', 'since', 'every day'],
            answer: 1,
            explain: '"by" (tak) is tense ka pakka signal hai.',
          },
        ],
      },
      {
        id: 'future-perfect-continuous',
        title: 'Future Perfect Continuous',
        titleHi: 'पूर्ण अपूर्ण भविष्य काल',
        summary: 'Future me kisi samay tak kaam kitne samay se chal raha hoga.',
        concept: [
          'Ye batata hai ki future me kisi waqt tak koi kaam **kitne time se chal raha hoga**.',
          'Format: **will have been + V4 (ing) + for/since**. Jaise "By June I will have been working here for 2 years."',
          'Ye sabse advanced (aur sabse kam use hone wala) tense hai. Samajh lo, par roj zaroorat nahi.',
        ],
        formula: {
          positive: 'Sub + will have been + V4 + for/since ...  →  I will have been working for 2 years.',
          negative: 'Sub + will not have been + V4 ...  →  I will not have been working.',
          question: 'Will + Sub + have been + V4 ...?  →  Will you have been working?',
        },
        examples: [
          { en: 'By June I will have been working here for 2 years.', hi: 'जून तक मैं यहाँ 2 साल से काम कर रहा हूँगा।' },
          { en: 'By 9 pm they will have been playing for hours.', hi: '9 बजे तक वे घंटों से खेल रहे होंगे।' },
          { en: 'She will not have been teaching long.', hi: 'वह ज़्यादा समय से पढ़ा रही नहीं होगी।' },
          { en: 'Will you have been living here for a year?', hi: 'क्या तुम यहाँ एक साल से रह रहे होगे?' },
        ],
        signals: ['by', 'for', 'since', 'how long'],
        rules: [
          '"will have been" sabhi subjects ke saath same rehta hai.',
          'been ke baad hamesha V4 (ing) aata hai.',
          'for = duration, since = shuru ka point (baaki continuous tenses jaise).',
        ],
        mistakes: [
          { wrong: 'I will have been work for 2 years.', right: 'I will have been working for 2 years.', why: 'been ke baad V4 (working) chahiye.' },
          { wrong: 'They will have being playing.', right: 'They will have been playing.', why: 'sahi helper "been" hai, "being" nahi.' },
        ],
        quiz: [
          {
            q: 'By next year I ___ have been teaching for 10 years.',
            options: ['will', 'am', 'was', 'had'],
            answer: 0,
            explain: 'Future Perfect Continuous = will have been + V4.',
          },
          {
            q: 'Correct sentence chuno:',
            options: ['He will have been work.', 'He will have been working.', 'He will have being working.', 'He will been working.'],
            answer: 1,
            explain: 'will have been + V4 (working).',
          },
          {
            q: 'Future Perfect Continuous ka format?',
            options: ['will have + V3', 'will have been + V4', 'will be + V4', 'had been + V4'],
            answer: 1,
            explain: 'will have been + V4.',
          },
          {
            q: '"for 3 years" yahan kya batata hai?',
            options: ['shuru ka point', 'duration', 'past time', 'na'],
            answer: 1,
            explain: '"for" duration batata hai.',
          },
        ],
      },
    ],
  },
]

let orderCounter = 0
export const fallbackModules: Module[] = curriculumSeed.map((mod, modIdx) => ({
  id: mod.id,
  order: modIdx + 1,
  title: mod.title,
  titleHi: mod.titleHi,
  desc: mod.desc,
  emoji: mod.emoji,
  accent: mod.accent,
  lessons: mod.lessons.map((lesson) => {
    orderCounter += 1
    return {
      ...lesson,
      moduleId: mod.id,
      moduleTitle: mod.title,
      order: orderCounter,
    }
  }),
}))

export const fallbackAllLessons: Lesson[] = fallbackModules.flatMap((m) => m.lessons)
export const TOTAL_LESSONS = fallbackAllLessons.length
