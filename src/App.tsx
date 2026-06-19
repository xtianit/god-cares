import logo from "./assets/logo.png";
import Header from "./components/Header";
import { useState, useEffect } from "react";
import {
    BookOpen,
    CheckCircle,
    Edit2,
    Save,
    X,
    Plus,
    Lock,
    Unlock,
} from "lucide-react";

interface PaystackResponse {
    reference: string;
    status: string;
    message: string;
    trans: string;
    transaction: string;
    trxref: string;
}

declare global {
    interface Window {
        PaystackPop: {
            setup: (config: {
                key: string;
                email: string;
                amount: number;
                currency: string;
                reference: string;
                onClose: () => void;
                callback: (response: PaystackResponse) => void;
            }) => { openIframe: () => void };
        };
    }
}

type BibleVersions = {
    KJV: string;
    NKJV: string;
    NIV: string;
    ESV: string;
    AMP: string;
    NLT: string;
};

type ScriptureDB = Record<string, BibleVersions>;

const initialScriptureDB: ScriptureDB = {
  
  "1 Peter 5:7": {
    "KJV": "Casting all your care upon him; for he careth for you.",
    "NKJV": "casting all your care upon Him, for He cares for you.",
    "NIV": "Cast all your anxiety on him because he cares for you.",
    "ESV": "casting all your anxieties on him, because he cares for you.",
    "AMP": "casting all your anxiety [all your worries, all your concerns, once and for all] on Him, for He cares about you [with deepest affection, and watches over you very carefully].",
    "NLT": "Give all your worries and cares to God, for he cares about you."
  },
  "Psalm 8:4": {
    "KJV": "What is man, that thou art mindful of him? and the son of man, that thou visitest him?",
    "NKJV": "What is man that You are mindful of him, And the son of man that You visit him?",
    "NIV": "what is mankind that you are mindful of them, human beings that you care for them?",
    "ESV": "what is man that you are mindful of him, and the son of man that you care for him?",
    "AMP": "What is man that You are mindful of him, And the son of [earthborn] man that You care for him?",
    "NLT": "what are mere mortals that you should think about them, human beings that you should care for them?"
  },
  "Jeremiah 29:11": {
    "KJV": "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
    "NKJV": "For I know the thoughts that I think toward you, says the LORD, thoughts of peace and not of evil, to give you a future and a hope.",
    "NIV": "'For I know the plans I have for you,' declares the LORD, 'plans to prosper you and not to harm you, plans to give you hope and a future.'",
    "ESV": "For I know the plans I have for you, declares the LORD, plans for welfare and not for evil, to give you a future and a hope.",
    "AMP": "‘For I know the plans and thoughts that I have for you,’ says the LORD, ‘plans for peace and well-being and not for disaster, to give you a future and a hope.’",
    "NLT": "'For I know the plans I have for you,' says the LORD. 'They are plans for good and not for disaster, to give you a future and a hope.'"
  },
  "John 3:16": {
    "KJV": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    "NKJV": "For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.",
    "NIV": "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    "ESV": "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
    "AMP": "For God so [greatly] loved and dearly prized the world, that He [even] gave His [One and] unique Son, so that whoever believes will trust in Him shall not perish, but have eternal life.",
    "NLT": "For this is how God loved the world: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life."
  },
  "Numbers 11:4-6": {
    "KJV": "4 And the mixt multitude that was among them fell a lusting: and the children of Israel also wept again, and said, Who shall give us flesh to eat? 5 We remember the fish, which we did eat in Egypt freely; the cucumbers, and the melons, and the leeks, and the onions, and the garlick: 6 But now our soul is dried away: there is nothing at all, beside this manna, before our eyes.",
    "NKJV": "4 Now the mixed multitude who were among them yielded to intense craving; so the children of Israel also wept again and said: 'Who will give us meat to eat? 5 We remember the fish which we ate freely in Egypt, the cucumbers, the melons, the leeks, the onions, and the garlic; 6 but now our whole being is dried up; there is nothing at all except this manna before our eyes!'",
    "NIV": "4 The rabble with them began to crave other food, and again the Israelites started wailing and said, 'If only we had meat to eat! 5 We remember the fish we ate in Egypt at no cost—also the cucumbers, melons, leeks, onions and garlic. 6 But now we have lost our appetite; we never see anything but this manna!'",
    "ESV": "4 Now the rabble that was among them had a strong craving. And the people of Israel also wept again and said, 'Oh that we had meat to eat! 5 We remember the fish we ate in Egypt that cost nothing, the cucumbers, the melons, the leeks, the onions, and the garlic. 6 But now our strength is dried up, and there is nothing at all but this manna to look at.'",
    "AMP": "4 The rabble among them had a strong craving [for other food], and the Israelites wept again and said, 'Who will give us meat to eat? 5 We remember the fish we ate freely and without cost in Egypt, the cucumbers, the melons, the leeks, the onions, and the garlic; 6 but now our appetite is gone. There is nothing at all [to look at] except this manna.'",
    "NLT": "4 Then the foreign rabble who were traveling with the Israelites began to crave the good things of Egypt. And the people of Israel also began to complain. 'Oh, for some meat!' they wailed. 5 'We remember the fish we used to eat for free in Egypt. And we had all the cucumbers, melons, leeks, onions, and garlic we wanted. 6 But now our appetites are gone. All we ever see is this manna!'"
  },
  
  "Numbers 11:10-15": {
    "KJV": "10 Then Moses heard the people weep throughout their families, every man in the door of his tent: and the anger of the LORD was kindled greatly; Moses also was displeased. 11 And Moses said unto the LORD, Wherefore hast thou afflicted thy servant? and wherefore have I not found favour in thy sight, that thou layest the burden of all this people upon me? 12 Have I conceived all this people? have I begotten them, that thou shouldest say unto me, Carry them in thy bosom, as a nursing father beareth the sucking child, unto the land which thou swarest unto their fathers? 13 Whence should I have flesh to give unto all this people? for they weep unto me, saying, Give us flesh, that we may eat. 14 I am not able to bear all this people alone, because it is too heavy for me. 15 And if thou deal thus with me, kill me, I pray thee, out of hand, if I have found favour in thy sight; and let me not see my wretchedness.",
    "NKJV": "10 Then Moses heard the people weeping throughout their families, everyone at the door of his tent; and the anger of the LORD was greatly aroused; Moses also was displeased. 11 So Moses said to the LORD, 'Why have You afflicted Your servant? And why have I not found favor in Your sight, that You have laid the burden of all these people on me? 12 Did I conceive all these people? Did I beget them, that You should say to me, \"Carry them in your bosom, as a guardian carries a nursing child,\" to the land which You swore to their fathers? 13 Where am I to get meat to give to all these people? For they weep all over me, saying, \"Give us meat, that we may eat.\" 14 I am not able to bear all these people alone, because the burden is too heavy for me. 15 If You treat me like this, please kill me here and now—if I have found favor in Your sight—and do not let me see my wretchedness!'",
    "NIV": "10 Moses heard the people of every family wailing at the entrance to their tents. The Lord became exceedingly angry, and Moses was troubled. 11 He asked the Lord, 'Why have you brought this trouble on your servant? What have I done to displease you that you put the burden of all these people on me? 12 Did I conceive all these people? Did I give them birth? Why do you tell me to carry them in my arms, as a nurse carries an infant, to the land you promised on oath to their ancestors? 13 Where can I get meat for all these people? They keep wailing to me, \"Give us meat to eat!\" 14 I cannot carry all these people by myself; the burden is too heavy for me. 15 If this is how you are going to treat me, please go ahead and kill me—if I have found favor in your eyes—and do not let me face my ruin.'",
    "ESV": "10 Moses heard the people weeping throughout their clans, everyone at the door of his tent. And the anger of the Lord blazed hotly, and Moses was displeased. 11 Moses said to the Lord, 'Why have you dealt ill with your servant? And why have I not found favor in your sight, that you lay the burden of all this people on me? 12 Did I conceive all this people? Did I give them birth, that you should say to me, \"Carry them in your bosom, as a nurse carries a nursing child,\" to the land that you swore to give their fathers? 13 Where am I to get meat to give to all this people? For they weep before me and say, \"Give us meat, that we may eat.\" 14 I am not able to carry all this people alone; the burden is too heavy for me. 15 If you will treat me like this, kill me at once, if I find favor in your sight, that I may not see my wretchedness.'",
    "AMP": "10 Moses heard the people weeping throughout their families, everyone at the door of his tent; and the anger of the Lord was kindled greatly, and Moses was displeased. 11 So Moses said to the Lord, 'Why have You dealt so harshly with Your servant? And why have I not found favor in Your sight, that You have laid the burden of all this people on me? 12 Did I conceive all this people? Did I give birth to them, that You should say to me, \"Carry them in your bosom, as a nurse carries a nursing child,\" to the land which You swore to their fathers? 13 Where am I to get meat to give to all this people? For they weep before me, saying, \"Give us meat, that we may eat.\" 14 I am not able to carry all this people alone, because the burden is too heavy for me. 15 So if You are going to deal with me like this, please kill me at once, if I have found favor in Your sight, and do not let me see my wretchedness.'",
    "NLT": "10 Moses heard all the families standing in the doorways of their tents weeping, and the Lord became extremely angry. Moses was also very aggravated. 11 And Moses said to the Lord, 'Why are you treating me, your servant, so harshly? Have mercy on me! Why are you laying the burden of all these people on me? 12 Did I give birth to them? Did I bring them into the world? Why do you tell me to carry them in my arms like a nurse carrying a baby? How can I carry them to the land you swore to give their ancestors? 13 Where am I supposed to get meat for all these people? They keep whining to me, saying, \"Give us meat to eat!\" 14 I can’t carry all these people by myself! The load is far too heavy. 15 If this is how you intend to treat me, just go ahead and kill me. Do me a favor and spare me this misery!'",
   },
  "Numbers 11:33": {
    "KJV": "And while the flesh was yet between their teeth, ere it was chewed, the wrath of the LORD was kindled against the people, and the LORD smote the people with a very great plague.",
    "NKJV": "But while the meat was still between their teeth, before it was chewed, the wrath of the LORD was aroused against the people, and the LORD struck the people with a very great plague.",
    "NIV": "But while the meat was still between their teeth and before it could be consumed, the anger of the Lord burned against the people, and he struck them with a severe plague.",
    "ESV": "While the meat was yet between their teeth, before it was consumed, the anger of the Lord was kindled against the people, and the Lord struck the people with a very great plague.",
    "AMP": "While the meat was still between their teeth, before it was chewed, the anger of the Lord was kindled against the people, and the Lord struck the people with a very great plague.",
    "NLT": "But while they were gorging themselves on the meat—while it was still in their mouths—the anger of the Lord blazed against the people, and he struck them with a severe plague."
  },
  "Numbers 11:10": {
    "KJV": "Then Moses heard the people weep throughout their families, every man in the door of his tent: and the anger of the LORD was kindled greatly; Moses also was displeased.",
    "NKJV": "Then Moses heard the people weeping throughout their families, everyone at the door of his tent; and the anger of the LORD was greatly aroused; Moses was also displeased.",
    "NIV": "Moses heard the people of every family wailing at the entrance to their tents. The Lord became exceedingly angry, and Moses was troubled.",
    "ESV": "Moses heard the people weeping throughout their clans, everyone at the door of his tent. And the anger of the Lord blazed hotly, and Moses was displeased.",
    "AMP": "Moses heard the people weeping throughout their families, everyone at the door of his tent; and the anger of the Lord was kindled greatly, and Moses was displeased.",
    "NLT": "Moses heard all the families standing in the doorways of their tents weeping, and the Lord became extremely angry. Moses was also very aggravated."
  },
  "Numbers 11:9": {
    "KJV": "And when the dew fell upon the camp in the night, the manna fell upon it.",
    "NKJV": "And when the dew fell on the camp in the night, the manna fell on it.",
    "NIV": "When the dew settled on the camp at night, the manna also came down.",
    "ESV": "When the dew fell upon the camp in the night, the manna fell with it.",
    "AMP": "When the dew fell on the camp at night, the manna fell with it.",
    "NLT": "The manna came down on the camp each night when the dew fell."
  },
  "Luke 19:10": {
    "KJV": "For the Son of man is come to seek and to save that which was lost.",
    "NKJV": "for the Son of Man has come to seek and to save that which was lost.",
    "NIV": "For the Son of Man came to seek and to save the lost.",
    "ESV": "For the Son of Man came to seek and to save the lost.",
    "AMP": "For the Son of Man has come to seek and to save that which was lost.",
    "NLT": "For the Son of Man came to seek and to save those who are lost."
  },
  "Luke 12:6-7": {
    "KJV": "6 Are not five sparrows sold for two farthings, and not one of them is forgotten before God? 7 But even the very hairs of your head are all numbered. Fear not therefore: ye are of more value than many sparrows.",
    "NKJV": "6 Are not five sparrows sold for two copper coins? And not one of them is forgotten before God. 7 But the very hairs of your head are all numbered. Do not fear therefore; you are of more value than many sparrows.",
    "NIV": "6 Are not five sparrows sold for two pennies? Yet not one of them is forgotten by God. 7 Indeed, the very hairs of your head are all numbered. Don’t be afraid; you are worth more than many sparrows.",
    "ESV": "6 Are not five sparrows sold for two pennies? And not one of them is forgotten before God. 7 Why, even the hairs of your head are all numbered. Fear not; you are of more value than many sparrows.",
    "AMP": "6 Are not five sparrows sold for two copper coins? Yet not one of them is forgotten before God. 7 But even the very hairs of your head are all numbered. Do not be afraid; you are more valuable than many sparrows.",
    "NLT": "6 What is the price of five sparrows—two copper coins? Yet God does not forget a single one of them. 7 And the very hairs on your head are all numbered. So don’t be afraid; you are more valuable to God than a whole flock of sparrows."
  },
  "1 Kings 17:8-16": {
    "KJV": "8 And the word of the LORD came unto him, saying, 9 Arise, get thee to Zarephath, which belongeth to Zidon, and dwell there: behold, I have commanded a widow woman there to sustain thee. 10 So he arose and went to Zarephath. And when he came to the gate of the city, behold, the widow woman was there gathering of sticks: and he called to her, and said, Fetch me, I pray thee, a little water in a vessel, that I may drink. 11 And as she was going to fetch it, he called to her, and said, Bring me, I pray thee, a morsel of bread in thine hand. 12 And she said, As the LORD thy God liveth, I have not a cake, but an handful of meal in a barrel, and a little oil in a cruse: and, behold, I am gathering two sticks, that I may go in and dress it for me and my son, that we may eat it, and die. 13 And Elijah said unto her, Fear not; go and do as thou hast said: but make me thereof a little cake first, and bring it unto me, and after make for thee and for thy son. 14 For thus saith the LORD God of Israel, The barrel of meal shall not waste, neither shall the cruse of oil fail, until the day that the LORD sendeth rain upon the earth. 15 And she went and did according to the saying of Elijah: and she, and he, and her house, did eat many days. 16 And the barrel of meal wasted not, neither did the cruse of oil fail, according to the word of the LORD, which he spake by Elijah.",
    "NKJV": "8 Then the word of the LORD came to him, saying, 9 'Arise, go to Zarephath, which belongs to Sidon, and dwell there. See, I have commanded a widow there to provide for you.' 10 So he arose and went to Zarephath. And when he came to the gate of the city, indeed, a widow was there gathering sticks. And he called to her and said, 'Please bring me a little water in a cup, that I may drink.' 11 And as she was going to get it, he called to her and said, 'Please bring me a morsel of bread in your hand.' 12 So she said, 'As the LORD your God lives, I do not have bread, only a handful of flour in a bin, and a little oil in a jar; and see, I am gathering a couple of sticks that I may go in and prepare it for myself and my son, that we may eat it, and die.' 13 And Elijah said to her, 'Do not fear; go and do as you have said, but make me a small cake from it first, and bring it to me; and afterward make some for yourself and your son. 14 For thus says the LORD God of Israel: \"The bin of flour shall not be used up, nor shall the jar of oil run dry, until the day the LORD sends rain on the earth.\"' 15 So she went and did according to the word of Elijah; and she and he and her household ate for many days. 16 The bin of flour was not used up, nor did the jar of oil run dry, according to the word of the LORD which He spoke by Elijah.",
    "NIV": "8 Then the word of the Lord came to him: 9 'Go at once to Zarephath in the region of Sidon and stay there. I have directed a widow there to supply you with food.' 10 So he went to Zarephath. When he came to the town gate, a widow was there gathering sticks. He called to her and said, 'Would you bring me a little water in a jar so I may have a drink?' 11 As she was going to get it, he called, 'And please bring me a piece of bread.' 12 'As surely as the Lord your God lives,' she replied, 'I don’t have any bread—only a handful of flour in a jar and a little olive oil in a jug. I am gathering a few sticks to take home and make a meal for myself and my son, so that we may eat it—and die.' 13 Elijah said to her, 'Don’t be afraid. Go home and do as you have said. But first make a small loaf of bread for me from what you have and bring it to me, and then make something for yourself and your son. 14 For this is what the Lord, the God of Israel, says: \"The jar of flour will not be used up and the jug of oil will not run dry until the day the Lord sends rain on the land.\"' 15 She went away and did as Elijah had told her. So there was food every day for Elijah and for the woman and her family. 16 For the jar of flour was not used up and the jug of oil did not run dry, in keeping with the word of the Lord spoken by Elijah.",
    "ESV": "8 Then the word of the Lord came to him, 9 'Arise, go to Zarephath, which belongs to Sidon, and dwell there. Behold, I have commanded a widow there to feed you.' 10 So he arose and went to Zarephath. And when he came to the gate of the city, behold, a widow was there gathering sticks. And he called to her and said, 'Bring me a little water in a vessel, that I may drink.' 11 And as she was going to bring it, he called to her and said, 'Bring me a morsel of bread in your hand.' 12 And she said, 'As the Lord your God lives, I have nothing baked, only a handful of flour in a jar and a little oil in a jug. And now I am gathering a couple of sticks that I may go in and prepare it for myself and my son, that we may eat it and die.' 13 And Elijah said to her, 'Do not fear; go and do as you have said. But first make me a little cake of it and bring it to me, and afterward make something for yourself and your son. 14 For thus says the Lord, the God of Israel, \"The jar of flour shall not be spent, and the jug of oil shall not be empty, until the day that the Lord sends rain upon the earth.\"' 15 And she went and did as Elijah said. And she and he and her household ate for many days. 16 The jar of flour was not spent, neither did the jug of oil become empty, according to the word of the Lord that he spoke by Elijah.",
    "AMP": "8 Then the word of the Lord came to him, saying, 9 'Arise, go to Zarephath, which belongs to Sidon, and stay there. Behold, I have commanded a widow there to provide for you.' 10 So he arose and went to Zarephath. When he came to the gate of the city, behold, a widow was there gathering sticks. He called to her and said, 'Please bring me a little water in a jar, so that I may drink.' 11 As she was going to get it, he called to her and said, 'Please bring me a piece of bread in your hand.' 12 But she said, 'As the Lord your God lives, I have no bread, only a handful of flour in the bowl and a little oil in the jar; and see, I am gathering a few sticks so that I may go in and prepare it for me and my son, so that we may eat it, and die.' 13 Elijah said to her, 'Do not fear; go and do as you have said. Just make me a little cake from it first and bring it to me, and afterward make some for yourself and for your son. 14 For this is what the Lord God of Israel says: \"The bowl of flour shall not be exhausted, nor shall the jar of oil be empty, until the day that the Lord sends rain on the face of the earth.\"' 15 So she went and did as Elijah told her; and she and he and her household ate for many days. 16 The bowl of flour was not exhausted, nor was the jar of oil empty, in accordance with the word of the Lord which He spoke through Elijah.",
    "NLT": "8 Then the Lord said to Elijah, 9 'Go and live in the village of Zarephath, near the city of Sidon. I have instructed a widow there to feed you.' 10 So he went to Zarephath. As he arrived at the gates of the village, he saw a widow gathering sticks. He called out to her, 'Please bring me a little water in a cup.' 11 As she was going to get it, he called to her, 'Bring me a bite of bread, too.' 12 But she said, 'I swear by the Lord your God that I don’t have a single piece of bread in the house. And I have only a handful of flour left in the jar and a little cooking oil in the bottom of the jug. I was just gathering a few sticks to cook this last meal for myself and my son, and then we will die.' 13 But Elijah said to her, 'Don’t be afraid! Go ahead and do just what you’ve said, but make a little bread for me first. Then use what’s left to prepare a meal for yourself and your son. 14 For this is what the Lord, the God of Israel, says: There will always be flour and olive oil left in your containers until the time the Lord sends rain and the crops grow again!' 15 So she did as Elijah said, and she and Elijah and her family continued to eat for many days. 16 There was always plenty of flour and olive oil left in the containers, just as the Lord had promised through Elijah."
  },
  "1 Kings 17:9": {
    "KJV": "9 Arise, get thee to Zarephath, which belongeth to Zidon, and dwell there: behold, I have commanded a widow woman there to sustain thee.",
    "NKJV": "9 'Arise, go to Zarephath, which belongs to Sidon, and dwell there. See, I have commanded a widow there to provide for you.'",
    "NIV": "9 'Go at once to Zarephath in the region of Sidon and stay there. I have directed a widow there to supply you with food.'",
    "ESV": "9 'Arise, go to Zarephath, which belongs to Sidon, and dwell there. Behold, I have commanded a widow there to feed you.'",
    "AMP": "9 'Arise, go to Zarephath, which belongs to Sidon, and stay there. Behold, I have commanded a widow there to provide for you.'",
    "NLT": "9 'Go and live in the village of Zarephath, near the city of Sidon. I have instructed a widow there to feed you.'"
  },
  "1 Kings 17:10-15": {
    "KJV": "10 So he arose and went to Zarephath. And when he came to the gate of the city, behold, the widow woman was there gathering of sticks: and he called to her, and said, Fetch me, I pray thee, a little water in a vessel, that I may drink. 11 And as she was going to fetch it, he called to her, and said, Bring me, I pray thee, a morsel of bread in thine hand. 12 And she said, As the LORD thy God liveth, I have not a cake, but an handful of meal in a barrel, and a little oil in a cruse: and, behold, I am gathering two sticks, that I may go in and dress it for me and my son, that we may eat it, and die. 13 And Elijah said unto her, Fear not; go and do as thou hast said: but make me thereof a little cake first, and bring it unto me, and after make for thee and for thy son. 14 For thus saith the LORD God of Israel, The barrel of meal shall not waste, neither shall the cruse of oil fail, until the day that the LORD sendeth rain upon the earth. 15 And she went and did according to the saying of Elijah: and she, and he, and her house, did eat many days.",
    "NKJV": "10 So he arose and went to Zarephath. And when he came to the gate of the city, indeed, a widow was there gathering sticks. And he called to her and said, 'Please bring me a little water in a cup, that I may drink.' 11 And as she was going to get it, he called to her and said, 'Please bring me a morsel of bread in your hand.' 12 So she said, 'As the LORD your God lives, I do not have bread, only a handful of flour in a bin, and a little oil in a jar; and see, I am gathering a couple of sticks that I may go in and prepare it for myself and my son, that we may eat it, and die.' 13 And Elijah said to her, 'Do not fear; go and do as you have said, but make me a small cake from it first, and bring it to me; and afterward make some for yourself and your son. 14 For thus says the LORD God of Israel: \"The bin of flour shall not be used up, nor shall the jar of oil run dry, until the day the LORD sends rain on the earth.\"' 15 So she went and did according to the word of Elijah; and she and he and her household ate for many days.",
    "NIV": "10 So he went to Zarephath. When he came to the town gate, a widow was there gathering sticks. He called to her and said, 'Would you bring me a little water in a jar so I may have a drink?' 11 As she was going to get it, he called, 'And please bring me a piece of bread.' 12 'As surely as the Lord your God lives,' she replied, 'I don’t have any bread—only a handful of flour in a jar and a little olive oil in a jug. I am gathering a few sticks to take home and make a meal for myself and my son, so that we may eat it—and die.' 13 Elijah said to her, 'Don’t be afraid. Go home and do as you have said. But first make a small loaf of bread for me from what you have and bring it to me, and then make something for yourself and your son. 14 For this is what the Lord, the God of Israel, says: \"The jar of flour will not be used up and the jug of oil will not run dry until the day the Lord sends rain on the land.\"' 15 She went away and did as Elijah had told her. So there was food every day for Elijah and for the woman and her family.",
    "ESV": "10 So he arose and went to Zarephath. And when he came to the gate of the city, behold, a widow was there gathering sticks. And he called to her and said, 'Bring me a little water in a vessel, that I may drink.' 11 And as she was going to bring it, he called to her and said, 'Bring me a morsel of bread in your hand.' 12 And she said, 'As the Lord your God lives, I have nothing baked, only a handful of flour in a jar and a little oil in a jug. And now I am gathering a couple of sticks that I may go in and prepare it for myself and my son, that we may eat it and die.' 13 And Elijah said to her, 'Do not fear; go and do as you have said. But first make me a little cake of it and bring it to me, and afterward make something for yourself and your son. 14 For thus says the Lord, the God of Israel, \"The jar of flour shall not be spent, and the jug of oil shall not be empty, until the day that the Lord sends rain upon the earth.\"' 15 And she went and did as Elijah said. And she and he and her household ate for many days.",
    "AMP": "10 So he arose and went to Zarephath. When he came to the gate of the city, behold, a widow was there gathering sticks. He called to her and said, 'Please bring me a little water in a jar, so that I may drink.' 11 As she was going to get it, he called to her and said, 'Please bring me a piece of bread in your hand.' 12 But she said, 'As the Lord your God lives, I have no bread, only a handful of flour in the bowl and a little oil in the jar; and see, I am gathering a few sticks so that I may go in and prepare it for me and my son, so that we may eat it, and die.' 13 Elijah said to her, 'Do not fear; go and do as you have said. Just make me a little cake from it first and bring it to me, and afterward make some for yourself and for your son. 14 For this is what the Lord God of Israel says: \"The bowl of flour shall not be exhausted, nor shall the jar of oil be empty, until the day that the Lord sends rain on the face of the earth.\"' 15 So she went and did as Elijah told her; and she and he and her household ate for many days.",
    "NLT": "10 So he went to Zarephath. As he arrived at the gates of the village, he saw a widow gathering sticks. He called out to her, 'Please bring me a little water in a cup.' 11 As she was going to get it, he called to her, 'Bring me a bite of bread, too.' 12 But she said, 'I swear by the Lord your God that I don’t have a single piece of bread in the house. And I have only a handful of flour left in the jar and a little cooking oil in the bottom of the jug. I was just gathering a few sticks to cook this last meal for myself and my son, and then we will die.' 13 But Elijah said to her, 'Don’t be afraid! Go ahead and do just what you’ve said, but make a little bread for me first. Then use what’s left to prepare a meal for yourself and your son. 14 For this is what the Lord, the God of Israel, says: There will always be flour and olive oil left in your containers until the time the Lord sends rain and the crops grow again!' 15 So she did as Elijah said, and she and Elijah and her family continued to eat for many days."
  },
  
 };





const SundaySchoolApp = () => {
    const [showPaymentGate, setShowPaymentGate] = useState(true);
    const [isPaid, setIsPaid] = useState(false);
    const [activeTab, setActiveTab] = useState("intro");
    const [darkMode, setDarkMode] = useState(true);
    const [fontSize, setFontSize] = useState(16);
    const [loading, setLoading] = useState(false);
    const [appLoading, setAppLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [scriptureDB, setScriptureDB] =
        useState<ScriptureDB>(initialScriptureDB);
    const [selectedVerse, setSelectedVerse] = useState<string | null>(null);
    const [bibleVersion, setBibleVersion] =
        useState<keyof BibleVersions>("KJV");
    const [showVerseModal, setShowVerseModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [newVerse, setNewVerse] = useState<{
        reference: string;
        versions: BibleVersions;
    }>({
        reference: "",
        versions: { KJV: "", NKJV: "", NIV: "", ESV: "", AMP: "", NLT: "" },
    });
    const [verseLoading, setVerseLoading] = useState(false);
    
    const [editingContent, setEditingContent] = useState<string | null>(null);

    type SubPoint = { title: string; content: string; scripture?: string };
    type LessonPoint = {
        title: string;
        content: string;
        scriptures: string[];
        subPoints: SubPoint[];
    };
    type ContentData = {
        lessonDate: string;
        lessonTitle: string;
        memoryVerse: string;
        memoryVerseRef: string;
        introduction: string;
        introScriptures: string[];
        lessonIntroScriptures: string[];
        aims: string;
        objectives: string;
        lessonIntro: string;
        lessonPoints: LessonPoint[];
        conclusion: string;
        conclusionScriptures: string[];
        prayerPoints: string[];
    };
    


const [contentData, setContentData] = useState<ContentData>({
    lessonDate: "June 21, 2026", // Assuming sequential weekly date following June 14
    lessonTitle: "GOD CARES",

    memoryVerse:
        "Casting all your care upon Him; for He careth for you. - 1 Pet. 5:7",
    memoryVerseRef: "1 Peter 5:7",

    introScriptures: ["Psalm 8:4", "Jeremiah 29:11", "John 3:16"],
    lessonIntroScriptures: ["Numbers 11:4-6", "Numbers 11:10-15", "Numbers 11:33"],

    introduction:
        "It is the assumption of many people that God is a careless figurehead who sits on his exalted throne, watching in enjoyment man and creation twisting themselves to destruction. This is not true because the scriptures prove God to be so careful for man and His domain. Ps 8:4, Jer 29:11, Jn 3:16. He is not the originator of our mess, yet He is so careful even for you regardless of your status.",

    aims:
        "To help all men realize and believe that God cares for all.",

    objectives:
        "To achieve concentration of God's care through knowledge. Hos 4:6.",

    lessonIntro:
        "God sent Prophet Elijah to save the family of a dying widow about eighty (80) miles away from Samaria His choice land. Although a heathen (unbeliever), without a relationship with God, yet He reached out to rescue her, proving His care for all.",

    lessonPoints: [
        {
            title: "A COMMANDMENT OF HELP vs 9:",
            content:
                "The same way God commanded Elijah to this widow, He has for you. Until we recognize and relate with our Elijah, we may not experience a tangible change in our circumstance and thereby thinking that God doesn't care. Your help has come.",
            scriptures: ["1 Kings 17:9"], // Corresponds to 'vs 10' referenced in text
            subPoints: [],
        },
        {
            title: "NO DISTANCE, NO BARRIER vs 9:",
            content:
                "There is no place too far for God to save, neither is there any race nor person that God is not willing to save. Luke 19:10. Prophet Elijah was commanded to go and save a widow about eighty miles away from Samaria. There is no barrier with God but with the individual that God determines to save. One can be the barrier to himself by despising or resisting His help.",
            scriptures: ["1 Kings 17:9","Luke 19:10"],
            subPoints: [],
        },
        {
            title: "THE INDIVIDUAL'S PART vs 10-15:",
            content:
                "God has done His part by sending His agent to help you as His measure of care, and you have to play your part to activate the help. John 3:16 - God sent... you believe... if not, the mission cannot be accomplished. This widow believed and sowed into the life of Prophet Elijah and was saved. Don't sit back and blame God for not caring, but walk to activate the care that's already provided. Your faith, obedience, and care for God's instrument of salvation will activate your miracle.",
            scriptures: ["1 Kings 17:10-15"],
            subPoints: [],
        },
    ],

    conclusion:
        "God cares even about the smallest things on earth, how much more man that He has made in His own image. LK12:6-7. Believe, receive and be well.",

    conclusionScriptures: ["Luke 12:6-7"],

    // Generated dynamically to match the exact context and tone of the typed lesson
    prayerPoints: [
        "Lord, I throw off every heavy weight of worry and anchor my heart in the absolute truth that You see me, You know me, and You deeply care for me!",
        "Father, I declare that no distance is too far and no barrier is too high for Your saving hand. I receive the divine help and strategic relationships sent to lift my life today!",
        "Oh Lord, stir up a dynamic faith within me! I step out of passive waiting into bold obedience, knowing that my faith activates the supernatural breakthroughs You have already provided!"
    ],
});






    const formatScriptureText = (text: string) => {
        const parts = text.split(/(\d+)/);
        return parts.map((part, index) => {
            if (/^\d+$/.test(part)) {
                return (
                    <strong key={index} className="font-bold">
                        {part}
                    </strong>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setAppLoading(false), 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
        return () => clearInterval(interval);
    }, []);

    const toggleTheme = () => setDarkMode(!darkMode);
    const adjustFontSize = (delta: number) =>
        setFontSize((prev) => Math.min(Math.max(prev + delta, 12), 24));
    const handleTabChange = (tab: string) => {
        setLoading(true);
        setTimeout(() => {
            setActiveTab(tab);
            setLoading(false);
        }, 500);
    };

    const showBibleVersions = (reference: string) => {
        setSelectedVerse(reference);
        setShowVerseModal(true);
        setVerseLoading(true);
        setTimeout(() => setVerseLoading(false), 800);
    };

    const changeBibleVersion = (version: keyof BibleVersions) => {
        setVerseLoading(true);
        setTimeout(() => {
            setBibleVersion(version);
            setVerseLoading(false);
        }, 600);
    };

    const addNewScripture = () => {
        if (
            newVerse.reference &&
            Object.values(newVerse.versions).some((v) => v !== "")
        ) {
            setScriptureDB((prev) => ({
                ...prev,
                [newVerse.reference]: newVerse.versions,
            }));
            setNewVerse({
                reference: "",
                versions: {
                    KJV: "",
                    NKJV: "",
                    NIV: "",
                    ESV: "",
                    AMP: "",
                    NLT: "",
                },
            });
            setEditMode(false);
        }
    };

    const updateVerseVersion = (version: keyof BibleVersions, text: string) => {
        setNewVerse((prev) => ({
            ...prev,
            versions: { ...prev.versions, [version]: text },
        }));
    };

    

   

   

   

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === "M") {
                e.preventDefault();
                handleTabChange("manage");
            }
            if (e.ctrlKey && e.shiftKey && e.key === "E") {
                e.preventDefault();
                setEditingContent(editingContent ? null : activeTab);
            }
        };
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [editingContent, activeTab]);

    const updateContent = (field: string, value: string) =>
        setContentData((prev) => ({ ...prev, [field]: value }));
    const updateLessonPoint = (index: number, field: string, value: string) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === index ? { ...point, [field]: value } : point
            ),
        }));
    };
    const updatePrayerPoint = (index: number, value: string) => {
        setContentData((prev) => ({
            ...prev,
            prayerPoints: prev.prayerPoints.map((prayer, i) =>
                i === index ? value : prayer
            ),
        }));
    };
    const updateLessonSubPoint = (
        pointIndex: number,
        subIndex: number,
        field: string,
        value: string
    ) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === pointIndex
                    ? {
                          ...point,
                          subPoints: point.subPoints.map((sub, j) =>
                              j === subIndex ? { ...sub, [field]: value } : sub
                          ),
                      }
                    : point
            ),
        }));
    };
    const addLessonSubPoint = (pointIndex: number) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === pointIndex
                    ? {
                          ...point,
                          subPoints: [
                              ...point.subPoints,
                              {
                                  title: "New Point",
                                  content: "",
                                  scripture: "",
                              },
                          ],
                      }
                    : point
            ),
        }));
    };
    const deleteLessonSubPoint = (pointIndex: number, subIndex: number) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === pointIndex
                    ? {
                          ...point,
                          subPoints: point.subPoints.filter(
                              (_, j) => j !== subIndex
                          ),
                      }
                    : point
            ),
        }));
    };
    const addPrayerPoint = () =>
        setContentData((prev) => ({
            ...prev,
            prayerPoints: [...prev.prayerPoints, "New prayer point..."],
        }));

    const PAYSTACK_PUBLIC_KEY =
        "pk_test_bed97038ebcf74b30219ed0500cfffc6e80948f1";
    const PAYMENT_AMOUNT = 500000;

    const handlePaystackSuccess = (reference: unknown) => {
        console.log("Payment successful:", reference);
        setIsPaid(true);
        setShowPaymentGate(false);
    };

    const handlePaystackClose = () => console.log("Payment closed");

    const initializePaystack = () => {
        if (!window.PaystackPop) {
            alert("Paystack script not loaded!");
            return;
        }
        const paystack = window.PaystackPop.setup({
            key: PAYSTACK_PUBLIC_KEY,
            email: "user@example.com",
            amount: PAYMENT_AMOUNT,
            currency: "NGN",
            reference: "SSA_" + Math.floor(Math.random() * 1000000000 + 1),
            onClose: () => handlePaystackClose(),
            callback: (transaction: PaystackResponse) =>
                handlePaystackSuccess(transaction),
        });
        paystack.openIframe();
    };

    const handleFreePlan = () => {
        setShowPaymentGate(false);
        setIsPaid(false);
    };

    const themeClasses = darkMode
        ? "bg-gradient-to-br from-gray-900 via-blue-900 to-green-900 text-white"
        : "bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 text-gray-900";


        if (appLoading) {
    const animatedText = "My Month of Divine Mercy - Eccl. 33:17-19".split("");

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center z-50">
            <div className="text-center">
                <div className="relative mb-8">
                    <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-20 h-20 object-contain"
                        />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full border-4 border-white/30 animate-ping"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="w-40 h-40 rounded-full border-4 border-white/20 animate-ping"
                            style={{ animationDelay: "0.3s" }}
                        ></div>
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Life Gate Ministries Worldwide
                </h1>
                <p className="text-xl text-white/90 mb-8">
                    Sunday School Lessons
                </p>

                {/* Single-color glowing neon text */}
                <div className="flex justify-center mb-6 text-3xl md:text-4xl font-extrabold">
                    {animatedText.map((char, idx) => (
                        <span
                            key={idx}
                            className="inline-block text-blue-400 drop-shadow-[0_0_10px_#00ffff] animate-[wave_1.5s_ease-in-out_infinite]"
                            style={{
                                animationDelay: `${idx * 0.1}s`,
                            }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </span>
                    ))}
                </div>

                <div className="text-white/80 mb-6 text-lg animate-pulse">
                    Loading Sunday School Lesson...
                </div>
                <div className="w-64 mx-auto bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                    <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300 ease-out shadow-lg"
                        style={{ width: `${loadingProgress}%` }}
                    ></div>
                </div>
                <p className="text-white/70 mt-3 text-sm">
                    {loadingProgress}%
                </p>
            </div>

            {/* Keyframes for smooth wave bounce */}
            <style>
                {`
                    @keyframes wave {
                        0%, 100% { transform: translateY(0); }
                        25% { transform: translateY(-12px); }
                        50% { transform: translateY(8px); }
                        75% { transform: translateY(-6px); }
                    }
                `}
            </style>
        </div>
    );
}




    if (showPaymentGate) {
        return (
            <div
                className={`min-h-screen ${themeClasses} flex items-center justify-center p-4 relative overflow-hidden`}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-96 h-96 bg-purple-500/30 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
                    <div
                        className="absolute w-96 h-96 bg-blue-500/30 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"
                        style={{ animationDelay: "1s" }}
                    ></div>
                    <div
                        className="absolute w-64 h-64 bg-pink-500/20 rounded-full blur-3xl top-1/2 left-1/2 animate-pulse"
                        style={{ animationDelay: "2s" }}
                    ></div>
                </div>
                <div className="max-w-4xl w-full relative z-10">
                    <div className="text-center mb-12">
                        <div className="w-24 h-24 mx-auto mb-6 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl border border-white/20">
                            <img
                                src={logo}
                                alt="Logo"
                                className="w-16 h-16 object-contain"
                            />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Sunday School Lesson
                        </h1>
                        <p className="text-xl opacity-80">
                            GOD CARES
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition duration-300 shadow-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold">
                                        Free Access
                                    </h3>
                                    <Unlock
                                        className="text-green-400"
                                        size={32}
                                    />
                                </div>
                                <div className="mb-6">
                                    <p className="text-4xl font-bold mb-2">
                                        ₦0
                                    </p>
                                    <p className="opacity-70">View Only Mode</p>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-green-400"
                                        />
                                        <span>Read all lesson content</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-green-400"
                                        />
                                        <span>Take interactive quizzes</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <X size={20} className="text-red-400" />
                                        <span className="opacity-50">
                                            No content editing
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <X size={20} className="text-red-400" />
                                        <span className="opacity-50">
                                            No scripture management
                                        </span>
                                    </li>
                                </ul>
                                <button
                                    onClick={handleFreePlan}
                                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-semibold text-white shadow-lg transform hover:scale-105 transition duration-300"
                                >
                                    Continue Free
                                </button>
                            </div>
                        </div>
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition duration-300 shadow-2xl">
                                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                    BEST VALUE
                                </div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold">
                                        Premium Access
                                    </h3>
                                    <Lock
                                        className="text-purple-400"
                                        size={32}
                                    />
                                </div>
                                <div className="mb-6">
                                    <p className="text-4xl font-bold mb-2">
                                        ₦5,000
                                    </p>
                                    <p className="opacity-70">Full Access</p>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Everything in Free</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Edit all lesson content</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Manage Bible scriptures</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Save your commitments</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Priority support</span>
                                    </li>
                                </ul>
                                <button
                                    onClick={initializePaystack}
                                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-xl font-semibold text-white shadow-lg transform hover:scale-105 transition duration-300"
                                >
                                    Unlock Premium
                                </button>
                            </div>
                        </div>
                    </div>
                    <p className="text-center mt-8 opacity-70 text-sm">
                        Secure payment powered by Paystack • All transactions
                        are encrypted
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen ${themeClasses} transition-all duration-500 relative`}
            style={{ fontSize: `${fontSize}px` }}
        >
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl top-0 left-1/4 animate-pulse"></div>
                <div
                    className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl bottom-0 right-1/4 animate-pulse"
                    style={{ animationDelay: "1s" }}
                ></div>
            </div>
            <Header
                logo={logo}
                contentData={contentData}
                fontSize={fontSize}
                adjustFontSize={adjustFontSize}
                darkMode={darkMode}
                toggleTheme={toggleTheme}
            />
            <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {contentData.lessonTitle}
                </h2>
                <div className="flex gap-2 mb-6 overflow-x-auto flex-nowrap md:flex-wrap justify-start md:justify-center scrollbar-hide backdrop-blur-sm bg-white/5 p-2 rounded-2xl border border-white/10">
                    {[
                        "intro",
                        "lesson",
                        "conclusion",
                        "prayer",
                    ].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all flex-shrink-0 ${
                                activeTab === tab
                                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105"
                                    : darkMode
                                    ? "bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/10"
                                    : "bg-black/10 backdrop-blur-md hover:bg-black/20 border border-black/10"
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                    {isPaid && (
                        <button
                            onClick={() => handleTabChange("manage")}
                            className={`px-2 py-3 rounded-xl font-semibold transition-all flex-shrink-0 opacity-0 hover:opacity-10 ${
                                activeTab === "manage"
                                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105"
                                    : "bg-white/10 backdrop-blur-md"
                            }`}
                            title="Admin"
                            style={{ width: "40px" }}
                        >
                            <Edit2 size={16} className="mx-auto" />
                        </button>
                    )}
                </div>
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                    </div>
                )}
                {!loading && (
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8">
                        {activeTab === "intro" && (
                            <div className="space-y-6">
                                {editingContent === "intro" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <div
                                    className={`${
                                        darkMode
                                            ? "bg-blue-900/30"
                                            : "bg-blue-50"
                                    } p-6 rounded-lg border-l-4 border-blue-600`}
                                >
                                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                        <BookOpen className="text-blue-600" />{" "}
                                        Memory Verse
                                    </h3>
                                    {editingContent === "intro" ? (
                                        <textarea
                                            value={contentData.memoryVerse}
                                            onChange={(e) =>
                                                updateContent(
                                                    "memoryVerse",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full px-4 py-2 rounded-lg border text-xl italic mb-4 ${
                                                darkMode
                                                    ? "bg-gray-800 border-gray-600"
                                                    : "bg-white border-gray-300"
                                            }`}
                                            rows={2}
                                        />
                                    ) : (
                                        <blockquote className="text-xl italic mb-4">
                                            {contentData.memoryVerse}
                                        </blockquote>
                                    )}
                                    <button
                                        onClick={() =>
                                            showBibleVersions(
                                                contentData.memoryVerseRef
                                            )
                                        }
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                    >
                                        <BookOpen size={16} />
                                        Read {contentData.memoryVerseRef}
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-3">
                                        Text: 1 Kings 17:8-16
                                    </h3>
                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            onClick={() =>
                                                showBibleVersions(
                                                    "1 Kings 17:8-16"
                                                )
                                            }
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 mt-2 rounded-lg transition flex items-center gap-2 text-sm"
                                        >
                                        <BookOpen size={16} />
                                            Read 1 Kings 17:8-16
                                        </button>
                                       

                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-3">
                                        Introduction
                                    </h3>
                                    {editingContent === "intro" ? (
                                        <textarea
                                            value={contentData.introduction}
                                            onChange={(e) =>
                                                updateContent(
                                                    "introduction",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full px-4 py-2 rounded-lg border ${
                                                darkMode
                                                    ? "bg-gray-800 border-gray-600"
                                                    : "bg-white border-gray-300"
                                            }`}
                                            rows={6}
                                        />
                                    ) : (
                                        <p className="leading-relaxed">
                                            {contentData.introduction}
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                <button
                                                onClick={() =>
                                                    showBibleVersions(
                                                        "Psalm 8:4"
                                                    )
                                                }
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 mt-2 rounded-lg transition flex items-center gap-2 text-sm"
                        
                                            >
                                            <BookOpen size={16} />
                                                Psalm 8:4
                                            </button>

                                            <button
                                            onClick={() =>
                                                showBibleVersions(
                                                    "Jeremiah 29:11"
                                                )
                                            }
                                         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-2 rounded-lg transition flex items-center gap-2 text-sm"
                                        >
                                            <BookOpen size={16} />
                                                Jeremiah 29:11
                                            </button>
                                            <button
                                            onClick={() =>
                                                showBibleVersions(
                                                    "John 3:16"
                                                )
                                            }
                                         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-2 rounded-lg transition flex items-center gap-2 text-sm"
                                        >
                                            <BookOpen size={16} />
                                                John 316
                                            </button>
                                            </div>
                                            
                                        </p>
                                        
                                    )}
                                   
                                </div>
                                <div
                                    className={`${
                                        darkMode
                                            ? "bg-green-900/30"
                                            : "bg-green-50"
                                    } p-6 rounded-lg`}
                                >
                                    <h3 className="text-xl font-bold mb-3">
                                        Aims and Objectives
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <strong className="text-green-700 dark:text-green-400">
                                                AIMS:
                                            </strong>
                                            {editingContent === "intro" ? (
                                                <textarea
                                                    value={contentData.aims}
                                                    onChange={(e) =>
                                                        updateContent(
                                                            "aims",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full px-3 py-2 rounded-lg border mt-2 ${
                                                        darkMode
                                                            ? "bg-gray-800 border-gray-600"
                                                            : "bg-white border-gray-300"
                                                    }`}
                                                    rows={3}
                                                />
                                            ) : (
                                                <p>{contentData.aims}</p>
                                            )}
                                        </div>
                                        <div>
                                            <strong className="text-green-700 dark:text-green-400">
                                                OBJECTIVES:
                                            </strong>
                                            {editingContent === "intro" ? (
                                                <textarea
                                                    value={
                                                        contentData.objectives
                                                    }
                                                    onChange={(e) =>
                                                        updateContent(
                                                            "objectives",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full px-3 py-2 rounded-lg border mt-2 ${
                                                        darkMode
                                                            ? "bg-gray-800 border-gray-600"
                                                            : "bg-white border-gray-300"
                                                    }`}
                                                    rows={2}
                                                />
                                            ) : (
                                                <p>{contentData.objectives}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "lesson" && (
                            <div className="space-y-6">
                                {editingContent === "lesson" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-4">
                                    Lesson Content
                                </h3>
                                {editingContent === "lesson" ? (
                                    <textarea
                                        value={contentData.lessonIntro}
                                        onChange={(e) =>
                                            updateContent(
                                                "lessonIntro",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full px-4 py-2 rounded-lg border mb-4 ${
                                            darkMode
                                                ? "bg-gray-800 border-gray-600"
                                                : "bg-white border-gray-300"
                                        }`}
                                        rows={3}
                                    />
                                ) : (
                                    <p className="leading-relaxed mb-4">
                                        {contentData.lessonIntro}
                                        {/* <div className="mt-4 flex flex-wrap gap-2">
                                            {contentData.lessonIntroScriptures.map(
                                                (scripture) => (
                                                    <button
                                                        key={scripture}
                                                        onClick={() =>
                                                            showBibleVersions(
                                                                scripture
                                                            )
                                                        }
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
                                                    >
                                                        <BookOpen size={14} />
                                                        {scripture}
                                                    </button>
                                                )
                                            )}
                                    
                                        </div> */}
                                        
                                    </p>
                                    
                                )}
                                <div className="space-y-6">
                                    {contentData.lessonPoints.map(
                                        (section, idx) => (
                                            <div
                                                key={idx}
                                                className={`${
                                                    darkMode
                                                        ? "bg-gray-700"
                                                        : "bg-gray-50"
                                                } p-5 rounded-lg`}
                                            >
                                                {editingContent === "lesson" ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            value={
                                                                section.title
                                                            }
                                                            onChange={(e) =>
                                                                updateLessonPoint(
                                                                    idx,
                                                                    "title",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={`w-full px-3 py-2 rounded-lg border mb-3 text-xl font-semibold ${
                                                                darkMode
                                                                    ? "bg-gray-800 border-gray-600"
                                                                    : "bg-white border-gray-300"
                                                            }`}
                                                        />
                                                        {section.content && (
                                                            <textarea
                                                                value={
                                                                    section.content
                                                                }
                                                                onChange={(e) =>
                                                                    updateLessonPoint(
                                                                        idx,
                                                                        "content",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className={`w-full px-3 py-2 rounded-lg border mb-3 ${
                                                                    darkMode
                                                                        ? "bg-gray-800 border-gray-600"
                                                                        : "bg-white border-gray-300"
                                                                }`}
                                                                rows={3}
                                                            />
                                                        )}
                                                        <div className="ml-6 space-y-3 mt-3">
                                                            {section.subPoints.map(
                                                                (
                                                                    subPoint,
                                                                    subIdx
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            subIdx
                                                                        }
                                                                        className={`${
                                                                            darkMode
                                                                                ? "bg-gray-800"
                                                                                : "bg-white"
                                                                        } p-3 rounded-lg`}
                                                                    >
                                                                        <div className="flex justify-between items-start mb-2">
                                                                            <span className="text-sm font-bold text-yellow-600">
                                                                                {String.fromCharCode(
                                                                                    97 +
                                                                                        subIdx
                                                                                )}

                                                                                .
                                                                            </span>
                                                                            <button
                                                                                onClick={() =>
                                                                                    deleteLessonSubPoint(
                                                                                        idx,
                                                                                        subIdx
                                                                                    )
                                                                                }
                                                                                className="text-red-600 hover:text-red-800"
                                                                            >
                                                                                <X
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                subPoint.title
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLessonSubPoint(
                                                                                    idx,
                                                                                    subIdx,
                                                                                    "title",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Sub-point title"
                                                                            className={`w-full px-3 py-1 rounded border mb-2 text-sm font-semibold ${
                                                                                darkMode
                                                                                    ? "bg-gray-700 border-gray-600"
                                                                                    : "bg-gray-50 border-gray-300"
                                                                            }`}
                                                                        />
                                                                        <textarea
                                                                            value={
                                                                                subPoint.content
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLessonSubPoint(
                                                                                    idx,
                                                                                    subIdx,
                                                                                    "content",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Sub-point content"
                                                                            className={`w-full px-3 py-1 rounded border mb-2 text-sm ${
                                                                                darkMode
                                                                                    ? "bg-gray-700 border-gray-600"
                                                                                    : "bg-gray-50 border-gray-300"
                                                                            }`}
                                                                            rows={
                                                                                2
                                                                            }
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                subPoint.scripture ||
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLessonSubPoint(
                                                                                    idx,
                                                                                    subIdx,
                                                                                    "scripture",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Scripture reference (optional)"
                                                                            className={`w-full px-3 py-1 rounded border text-sm ${
                                                                                darkMode
                                                                                    ? "bg-gray-700 border-gray-600"
                                                                                    : "bg-gray-50 border-gray-300"
                                                                            }`}
                                                                        />
                                                                    </div>
                                                                )
                                                            )}
                                                            <button
                                                                onClick={() =>
                                                                    addLessonSubPoint(
                                                                        idx
                                                                    )
                                                                }
                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                                                            >
                                                                <Plus
                                                                    size={14}
                                                                />{" "}
                                                                Add Sub-point
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <h4 className="text-xl font-semibold mb-2">
                                                            {idx + 1}.{" "}
                                                            {section.title}
                                                        </h4>
                                                        {section.content && (
                                                            <p className="leading-relaxed mb-3">
                                                                {
                                                                    section.content
                                                                }
                                                            </p>
                                                        )}
                                                        {section.scriptures &&
                                                            section.scriptures
                                                                .length > 0 && (
                                                                <div className="mt-3 flex flex-wrap gap-2">
                                                                    {section.scriptures.map(
                                                                        (
                                                                            scripture
                                                                        ) => (
                                                                            <button
                                                                                key={
                                                                                    scripture
                                                                                }
                                                                                onClick={() =>
                                                                                    showBibleVersions(
                                                                                        scripture
                                                                                    )
                                                                                }
                                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition flex items-center gap-2 text-sm"
                                                                            >
                                                                                <BookOpen
                                                                                    size={
                                                                                        14
                                                                                    }
                                                                                />
                                                                                {
                                                                                    scripture
                                                                                }
                                                                            </button>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                        {section.subPoints &&
                                                            section.subPoints
                                                                .length > 0 && (
                                                                <ol className="list-[lower-alpha] ml-6 space-y-3 mt-3">
                                                                    {section.subPoints.map(
                                                                        (
                                                                            subPoint,
                                                                            subIdx
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    subIdx
                                                                                }
                                                                            >
                                                                                <strong>
                                                                                    {
                                                                                        subPoint.title
                                                                                    }

                                                                                    :
                                                                                </strong>{" "}
                                                                                {
                                                                                    subPoint.content
                                                                                }
                                                                                {subPoint.scripture && (
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            if (
                                                                                                subPoint.scripture
                                                                                            )
                                                                                                showBibleVersions(
                                                                                                    subPoint.scripture
                                                                                                );
                                                                                        }}
                                                                                        className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                                                                                    >
                                                                                        📖
                                                                                        Read{" "}
                                                                                        {
                                                                                            subPoint.scripture
                                                                                        }
                                                                                    </button>
                                                                                )}
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ol>
                                                            )}
                                                    </>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === "conclusion" && (
                            <div className="space-y-4">
                                {editingContent === "conclusion" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-4">
                                    Conclusion
                                </h3>
                                {editingContent === "conclusion" ? (
                                    <textarea
                                        value={contentData.conclusion}
                                        onChange={(e) =>
                                            updateContent(
                                                "conclusion",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full px-4 py-2 rounded-lg border text-lg ${
                                            darkMode
                                                ? "bg-gray-800 border-gray-600"
                                                : "bg-white border-gray-300"
                                        }`}
                                        rows={4}
                                    />
                                ) : (
                                    <p className="text-lg leading-relaxed">
                                        {contentData.conclusion}
                                    </p>
                                )}
                                {contentData.conclusionScriptures &&
                                    contentData.conclusionScriptures.length >
                                        0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {contentData.conclusionScriptures.map(
                                                (scripture) => (
                                                    <button
                                                        key={scripture}
                                                        onClick={() =>
                                                            showBibleVersions(
                                                                scripture
                                                            )
                                                        }
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
                                                    >
                                                        <BookOpen size={14} />
                                                        {scripture}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>
                        )}
            

                       











                       
                        {activeTab === "prayer" && (
                            <div className="space-y-4">
                                {editingContent === "prayer" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-6">
                                    Prayer Points
                                </h3>
                                {contentData.prayerPoints.map((prayer, idx) => (
                                    <div
                                        key={idx}
                                        className={`${
                                            darkMode
                                                ? "bg-gray-700"
                                                : "bg-gradient-to-r from-purple-50 to-pink-50"
                                        } p-6 rounded-lg border-l-4 border-purple-600`}
                                    >
                                        {editingContent === "prayer" ? (
                                            <textarea
                                                value={prayer}
                                                onChange={(e) =>
                                                    updatePrayerPoint(
                                                        idx,
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full px-3 py-2 rounded-lg border ${
                                                    darkMode
                                                        ? "bg-gray-800 border-gray-600"
                                                        : "bg-white border-gray-300"
                                                }`}
                                                rows={3}
                                            />
                                        ) : (
                                            <p className="text-lg leading-relaxed">
                                                {prayer}
                                            </p>
                                        )}
                                    </div>
                                ))}
                                {editingContent === "prayer" && (
                                    <button
                                        onClick={addPrayerPoint}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                    >
                                        <Plus size={16} /> Add Prayer Point
                                    </button>
                                )}
                            </div>
                        )}
                        {activeTab === "manage" && isPaid && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold">
                                        Manage Scriptures
                                    </h3>
                                    <button
                                        onClick={() => setEditMode(!editMode)}
                                        className={`${
                                            editMode
                                                ? "bg-red-600 hover:bg-red-700"
                                                : "bg-green-600 hover:bg-green-700"
                                        } text-white px-4 py-2 rounded-lg transition flex items-center gap-2`}
                                    >
                                        {editMode ? (
                                            <>
                                                <X size={16} /> Cancel
                                            </>
                                        ) : (
                                            <>
                                                <Edit2 size={16} /> Add New
                                            </>
                                        )}
                                    </button>
                                </div>
                                {editMode && (
                                    <div
                                        className={`${
                                            darkMode
                                                ? "bg-gray-700"
                                                : "bg-blue-50"
                                        } p-6 rounded-lg space-y-4`}
                                    >
                                        <input
                                            type="text"
                                            value={newVerse.reference}
                                            onChange={(e) =>
                                                setNewVerse({
                                                    ...newVerse,
                                                    reference: e.target.value,
                                                })
                                            }
                                            placeholder="Scripture Reference (e.g., John 3:16)"
                                            className={`w-full px-4 py-2 rounded-lg border ${
                                                darkMode
                                                    ? "bg-gray-800 border-gray-600"
                                                    : "bg-white border-gray-300"
                                            }`}
                                        />
                                        {(
                                            [
                                                "KJV",
                                                "NKJV",
                                                "NIV",
                                                "ESV",
                                                "AMP",
                                                "NLT",
                                            ] as const
                                        ).map((version) => (
                                            <div key={version}>
                                                <label className="block font-semibold mb-2">
                                                    {version}
                                                </label>
                                                <textarea
                                                    value={
                                                        newVerse.versions[
                                                            version
                                                        ] || ""
                                                    }
                                                    onChange={(e) =>
                                                        updateVerseVersion(
                                                            version,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={`Enter ${version} text...`}
                                                    rows={3}
                                                    className={`w-full px-4 py-2 rounded-lg border ${
                                                        darkMode
                                                            ? "bg-gray-800 border-gray-600"
                                                            : "bg-white border-gray-300"
                                                    }`}
                                                />
                                            </div>
                                        ))}
                                        <button
                                            onClick={addNewScripture}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition flex items-center gap-2"
                                        >
                                            <Save size={16} /> Save Scripture
                                        </button>
                                    </div>
                                )}
                                <div className="space-y-3">
                                    {Object.keys(scriptureDB).map(
                                        (reference) => (
                                            <div
                                                key={reference}
                                                className={`${
                                                    darkMode
                                                        ? "bg-gray-700"
                                                        : "bg-white border border-gray-200"
                                                } p-4 rounded-lg`}
                                            >
                                                <h4 className="font-bold text-lg mb-2">
                                                    {reference}
                                                </h4>
                                                <button
                                                    onClick={() =>
                                                        showBibleVersions(
                                                            reference
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                    View All Versions →
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === "manage" && !isPaid && (
                            <div className="text-center py-12">
                                <Lock
                                    size={64}
                                    className="mx-auto mb-4 text-purple-400"
                                />
                                <h3 className="text-2xl font-bold mb-4">
                                    Premium Feature
                                </h3>
                                <p className="mb-6">
                                    Upgrade to Premium to access scripture
                                    management
                                </p>
                                <button
                                    onClick={() => setShowPaymentGate(true)}
                                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold"
                                >
                                    Unlock Now
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {showVerseModal && selectedVerse && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={() => setShowVerseModal(false)}
                >
                    <div
                        className={`${
                            darkMode ? "bg-gray-800" : "bg-white"
                        } rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-bold">
                                    {selectedVerse}
                                </h3>
                                <button
                                    onClick={() => setShowVerseModal(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                            {(
                                [
                                    "KJV",
                                    "NKJV",
                                    "NIV",
                                    "ESV",
                                    "AMP",
                                    "NLT",
                                ] as const
                            ).map((version) => (
                                <button
                                    key={version}
                                    onClick={() => changeBibleVersion(version)}
                                    disabled={verseLoading}
                                    className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                                        bibleVersion === version
                                            ? "bg-blue-600 text-white"
                                            : darkMode
                                            ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                    } ${
                                        verseLoading
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    {version}
                                </button>
                            ))}
                        </div>
                        <div
                            className="p-6 overflow-y-auto"
                            style={{ maxHeight: "calc(85vh - 180px)" }}
                        >
                            {verseLoading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="relative w-16 h-16 mb-4">
                                        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                                    </div>
                                    <p className="text-gray-500 animate-pulse">
                                        Loading scripture...
                                    </p>
                                </div>
                            ) : selectedVerse &&
                              scriptureDB[selectedVerse] &&
                              scriptureDB[selectedVerse][bibleVersion] ? (
                                <div className="text-lg leading-relaxed animate-fadeIn">
                                    {formatScriptureText(
                                        scriptureDB[selectedVerse][bibleVersion]
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">
                                    Translation not available
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SundaySchoolApp;
