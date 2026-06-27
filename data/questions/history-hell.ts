import type { Question, Topic } from './types'
import { makeQ, topicList, type Pair, type TopicMeta, type FwMeta } from './_builder'

// ════════════════════════════════════════════════════════════════════════════
// History (modern world) "hell" set (genuine 5★★). Targets the hardest DSE skills:
// distinguishing a TRIGGER from underlying CAUSES, weighing significance, and
// judging source utility vs reliability. Facts are mainstream and syllabus-aligned;
// distractors are the classic confusions. All hard.
// ════════════════════════════════════════════════════════════════════════════

const q = makeQ('history')
const opt = (zh: string, en: string): Pair => [zh, en]
const C = (zh: string, en: string): Pair => [zh, en]

const T = {
  cause: { id: 'hist_causation', zh: '因果分析・導火線與根源', en: 'Causation — trigger vs root cause' },
  sig:   { id: 'hist_significance', zh: '影響與意義評價', en: 'Significance & evaluation' },
  src:   { id: 'hist_source', zh: '史料判讀', en: 'Source analysis' },
} satisfies Record<string, TopicMeta>

const FW = {
  cause:    { id: 'causation', zh: '因果分析', en: 'Causation', emoji: '🔗' },
  evidence: { id: 'evidence',  zh: '史料判讀', en: 'Source Analysis', emoji: '🔍' },
  evaluate: { id: 'evaluate',  zh: '評價影響', en: 'Significance & Evaluation', emoji: '⚖️' },
} satisfies Record<string, FwMeta>

let uid = 0
const id = (p: string) => `histh_${p}_${++uid}`

const cause: Question[] = [
  q(id('ca'), T.cause, FW.cause, 'hard', 2024, 3,
    C('1914 年塞拉耶佛刺殺事件常被視為第一次世界大戰的「導火線」。從因果分析角度，最準確的理解是？',
      'The 1914 Sarajevo assassination is often called the “trigger” of WWI. From a causation standpoint, the most accurate understanding is that?'),
    [opt('刺殺只是「導火線」，把一場地區危機點燃為大戰的根本，是同盟體系、軍國主義、帝國主義與民族主義等長期結構性因素',
        'the assassination was only the spark; what turned a local crisis into a general war were long-term structural causes — the alliance system, militarism, imperialism and nationalism'),
      opt('刺殺事件本身就是大戰的唯一根本原因',
        'the assassination by itself was the sole fundamental cause'),
      opt('大戰純屬偶然，並無任何深層原因',
        'the war was purely accidental with no underlying causes'),
      opt('同盟體系阻止了戰爭爆發',
        'the alliance system prevented the war')],
    C('「導火線」與「根本原因」必須分辨：刺殺提供了引爆點，但若無預先存在的兩大同盟對峙、軍備競賽、殖民爭奪與民族矛盾，一宗刺殺不會升級為世界大戰。同盟體系反而把局部衝突連鎖擴大。\n\n【陷阱】「唯一根本原因」把導火線當根源；「純屬偶然」否定結構因素；「同盟阻止戰爭」與史實相反（同盟正是把戰爭擴大的機制）。',
      'A trigger is not a root cause: the assassination was the flashpoint, but without the pre-existing rival alliances, arms race, colonial rivalry and nationalist tensions, one murder would not have escalated into a world war. The alliance system in fact chain-linked a local clash into a general one.\n\n【Trap】 “Sole fundamental cause” mistakes trigger for root; “purely accidental” denies structural causes; “alliances prevented war” is the reverse of what happened.')),

  q(id('ca'), T.cause, FW.cause, 'hard', 2023, 3,
    C('1919 年《凡爾賽條約》如何成為日後第二次世界大戰的遠因之一？',
      'How did the 1919 Treaty of Versailles become a long-term cause of WWII?'),
    [opt('苛刻的條款（戰爭罪責、巨額賠款、領土割讓、限制軍備）激起德國的怨恨與經濟困頓，為希特拉的崛起提供土壤',
        'its harsh terms (war-guilt, huge reparations, territorial losses, disarmament) fuelled German resentment and economic hardship, providing fertile ground for Hitler’s rise'),
      opt('條約對德國極為寬大，令德國得以迅速重新武裝',
        'it was extremely lenient to Germany, letting it rearm quickly'),
      opt('條約與德國的政局發展毫無關係',
        'it had no bearing on Germany’s political development'),
      opt('條約確立了長久穩定的歐洲和平',
        'it established a lasting, stable European peace')],
    C('凡爾賽條約把全部戰爭罪責歸於德國、課以沉重賠款並割地裁軍，造成普遍的屈辱感與經濟動盪；納粹正是利用這種怨憤與大蕭條的苦況崛起。這是「遠因」如何透過情緒與經濟條件醞釀後果的典型。\n\n【陷阱】「極為寬大」與條約的苛刻相反；「毫無關係」「長久和平」皆與其埋下戰爭種子的史實相違。',
      'Versailles pinned full war-guilt on Germany, imposed heavy reparations, and stripped land and arms, breeding humiliation and economic turmoil; the Nazis exploited exactly this resentment and Depression-era misery to rise. A textbook case of a long-term cause working through emotion and economic conditions.\n\n【Trap】 “Extremely lenient” is the opposite; “no bearing” and “lasting peace” contradict the seeds of war it sowed.')),

  q(id('ca'), T.cause, FW.cause, 'hard', 2024, 3,
    C('1930 年代英法對納粹德國推行「綏靖政策」(appeasement)，至慕尼黑協定達於頂峰，最終失敗。其失敗的根本原因是？',
      'In the 1930s Britain and France pursued “appeasement” of Nazi Germany, peaking at the Munich Agreement, but it ultimately failed. The fundamental reason it failed was that?'),
    [opt('讓步並未滿足希特拉的野心，反而令他得寸進尺，誤判英法軟弱，繼續侵略',
        'concessions did not satisfy Hitler’s ambitions but emboldened him — he read Britain and France as weak and pressed on with aggression'),
      opt('綏靖政策對德國過於強硬，激怒了希特拉',
        'appeasement was too tough on Germany and provoked Hitler'),
      opt('英法從未對德國作出任何讓步',
        'Britain and France never made any concession to Germany'),
      opt('綏靖政策成功阻止了戰爭',
        'appeasement successfully prevented war')],
    C('綏靖的算盤是以讓步換取和平，但對一個擴張主義的獨裁者而言，讓步只被解讀為軟弱的訊號，反而鼓勵更大膽的侵略（佔領蘇台德後旋即吞併整個捷克、進攻波蘭）。\n\n【陷阱】「過於強硬」與綏靖的本質（退讓）相反；「從未讓步」與慕尼黑協定史實相違；「成功阻止戰爭」更與二戰爆發相矛盾。',
      'Appeasement bet that concessions would buy peace, but to an expansionist dictator concessions only signalled weakness and encouraged bolder aggression (the Sudetenland was followed by the seizure of all Czechoslovakia and the invasion of Poland).\n\n【Trap】 “Too tough” contradicts the conciliatory nature of appeasement; “never conceded” contradicts Munich; “prevented war” contradicts the outbreak of WWII.')),
]

const sig: Question[] = [
  q(id('si'), T.sig, FW.evaluate, 'hard', 2024, 3,
    C('關於冷戰的「起源」，較全面的歷史理解是？',
      'A fuller historical understanding of the ORIGINS of the Cold War is that?'),
    [opt('源於資本主義與共產主義的意識形態對立，加上戰後雙方的相互猜疑與權力真空爭奪——並非單一因素或單方責任',
        'it arose from the ideological clash of capitalism and communism, compounded by post-war mutual suspicion and a struggle over power vacuums — not a single factor or one side’s fault alone'),
      opt('完全是美國單方面挑起的',
        'it was entirely provoked by the USA alone'),
      opt('完全是蘇聯單方面挑起的',
        'it was entirely provoked by the USSR alone'),
      opt('與意識形態毫無關係，純為經濟糾紛',
        'it had nothing to do with ideology and was purely an economic dispute')],
    C('冷戰起源是多因交織：根本的意識形態對立，加上二戰後互不信任、對歐洲與其他地區權力真空的爭奪。把責任全推一方，或抽走意識形態因素，都失之片面。\n\n【陷阱】「完全是美方／蘇方挑起」皆屬單方歸因；「與意識形態無關」抽走了核心矛盾。',
      'Cold War origins were multi-causal: a fundamental ideological clash, plus post-war distrust and competition over power vacuums in Europe and beyond. Blaming one side wholly, or removing ideology, is one-sided.\n\n【Trap】 “Entirely the USA/USSR” are single-side attributions; “nothing to do with ideology” removes the core conflict.')),

  q(id('si'), T.sig, FW.evaluate, 'hard', 2023, 3,
    C('明治維新對日本以至亞洲歷史的最重要意義是？',
      'The most important significance of the Meiji Restoration for Japan and Asian history was that?'),
    [opt('透過由上而下的全面現代化（工業、軍事、教育、立憲），使日本崛起為首個非西方的現代強國',
        'through top-down, comprehensive modernisation (industry, military, education, a constitution) Japan rose as the first non-Western modern great power'),
      opt('使日本維持鎖國、拒絕一切西方影響',
        'it kept Japan isolated and rejected all Western influence'),
      opt('恢復了幕府將軍的統治',
        'it restored the rule of the shogunate'),
      opt('令日本長期積弱、淪為列強殖民地',
        'it left Japan weak and reduced it to a colony of the great powers')],
    C('明治維新「脫亞入歐」式地推行全方位現代化，短期內由封建落後躍升為工業與軍事強國，並於甲午、日俄戰爭中取勝，成為首個躋身列強的非西方國家，影響深遠。\n\n【陷阱】其餘三項（維持鎖國／恢復幕府／淪為殖民地）皆與維新「開國、廢幕、自強」的史實相反。',
      'The Meiji Restoration drove all-round modernisation, vaulting Japan from feudal backwardness to an industrial and military power that won the Sino-Japanese and Russo-Japanese wars — the first non-Western state to join the great powers.\n\n【Trap】 The others (staying isolated / restoring the shogunate / becoming a colony) contradict the opening-up, anti-shogunate, self-strengthening reality of Meiji.')),
]

const src: Question[] = [
  q(id('sr'), T.src, FW.evidence, 'hard', 2024, 3,
    C('一張戰時政府印製的「宣傳海報」，把敵國描繪為野蠻怪物。對歷史學家而言，這份史料的價值在於？',
      'A wartime government propaganda poster depicts the enemy as a savage monster. For a historian, the value of this source is that it?'),
    [opt('雖然帶有偏見、不能視作客觀事實，但正好反映該政府的宣傳手法、戰時情緒與意圖',
        'though biased and not objective fact, it is precisely useful for revealing the government’s propaganda methods, wartime emotions and intentions'),
      opt('因為帶有偏見，所以對歷史研究毫無價值',
        'because it is biased it has no value for historical study'),
      opt('可被當作敵國真實面貌的客觀記錄',
        'can be taken as an objective record of what the enemy was really like'),
      opt('史料只要帶情緒，就一定是偽造的',
        'any emotional source must be a forgery')],
    C('史料的「可靠性」與「用途」要分開：宣傳海報作為事實記錄並不可靠，但作為研究「宣傳策略、官方立場與民眾情緒」的證據卻極有價值。帶偏見的史料一樣有用，關鍵在於問對問題。\n\n【陷阱】「毫無價值」否定了偏見史料的用途；「客觀記錄敵國真貌」混淆了宣傳與事實；「帶情緒即偽造」是對史料的粗暴否定。',
      'Reliability and utility must be separated: a propaganda poster is unreliable as a factual record, yet highly valuable as evidence of propaganda strategy, official stance and public mood. Biased sources are still useful if you ask the right question.\n\n【Trap】 “No value” denies the use of biased sources; “objective record of the enemy” confuses propaganda with fact; “emotional = forged” is a crude dismissal.')),
]

export const historyHellQuestions: Question[] = [...cause, ...sig, ...src]

export const historyHellTopics: Topic[] = topicList([
  { topic: T.cause, fw: FW.cause,    count: cause.length },
  { topic: T.sig,   fw: FW.evaluate, count: sig.length },
  { topic: T.src,   fw: FW.evidence, count: src.length },
])
