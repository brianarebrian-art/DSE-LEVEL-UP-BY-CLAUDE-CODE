// AUTO-GATED question bank —— 由 scripts/qbank/auto-promote.mts 自動入庫。
// 【本檔題目未經真人逐題審批。】機器只能檢驗客觀項目：格式、選項、術語紅線、
// LaTeX、與現有題庫的重複度、topic id 是否已註冊。答案在學術上是否正確，
// 並不在此閘的能力範圍之內 —— 故出題端必須 correct-by-construction，或引用
// 可查證的原文。前端 QuestionProvenance 會如實向學生顯示
// 「經自動檢查 …本題未有實名逐題審批紀錄」。
//   subject  : ict
//   count    : 6  (easy 2 / medium 4 / hard 0)
//   types    : mc 6 / text 0 / long 0
//   updated  : 2026-10-08
// 請勿手動編輯 —— 修改將於下次執行 auto-promote 時被覆寫。
import type { Question } from './types'

export const ictAutoQuestions: Question[] = [
  {
    "id": "rcl_ict_drc_23",
    "type": "mc",
    "subject": "ict",
    "topic": "data_representation",
    "topicZh": "資料表示與處理",
    "topicEn": "Data Representation & Processing",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEn": "Auto-gated",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "一段錄音原本以 44.1 kHz 的取樣頻率錄製。若把取樣頻率改為 8 kHz，其他設定不變，最可能出現甚麼結果？",
    "explanation": "取樣頻率是每秒量度聲音訊號的次數。由 44.1 kHz 降至 8 kHz，每秒的樣本由 44,100 個減至 8,000 個；在位元深度和聲道數不變下，檔案約減至原來的五分之一。取樣頻率越低，能記錄的聲音頻率範圍越窄，較高音的細節便會流失，音質下降。認為檔案變大，是把取樣頻率與樣本數量的關係倒轉了。取樣頻率不會改變播放速度。檔案變小必然以減少數據為代價，所以音質不可能完全不受影響。",
    "options": [
      "檔案變大，因為每秒需要儲存更多樣本。",
      "檔案大小不變，只是播放速度會變慢。",
      "檔案變小，而音質完全不會受到影響。",
      "檔案變小，但較高音的細節會流失。"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "A sound recording was made with a sampling rate of 44.1 kHz. If the sampling rate is changed to 8 kHz with all other settings the same, what is the most likely result?",
    "optionsEn": [
      "The file is larger, because more samples are stored each second.",
      "The file size is the same; it just plays back more slowly.",
      "The file is smaller and the sound quality is not affected at all.",
      "The file is smaller, but detail in the higher sounds is lost."
    ],
    "explanationEn": "The sampling rate is the number of times per second the sound signal is measured. Going from 44.1 kHz to 8 kHz cuts the samples per second from 44,100 to 8,000; with the same bit depth and number of channels, the file shrinks to about a fifth. The lower the sampling rate, the narrower the range of frequencies it can record, so detail in the higher sounds is lost and quality falls. Saying the file grows reverses the link between sampling rate and number of samples. The sampling rate does not change playback speed. A smaller file comes from storing less data, so the quality cannot be completely unaffected."
  },
  {
    "id": "rcl_ict_prog_66",
    "type": "mc",
    "subject": "ict",
    "topic": "programming",
    "topicZh": "程式編寫與算法",
    "topicEn": "Programming & Algorithms",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEn": "Auto-gated",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "執行以下虛擬碼：x ← 5；y ← x；x ← x + 3；輸出 y。輸出的結果是甚麼？",
    "explanation": "變數是有名稱、可儲存並改變數值的記憶位置。y ← x 把 x 當時的數值 5 複製到 y；之後 x 改為 8，y 不會隨之改變，所以輸出 5。認為輸出 8，是以為 y 會一直「跟隨」x 的數值。3 只是 x 增加的數值，並非 y 的內容。變數的數值可以在程式執行期間改變，重新賦值不會出錯，這正是變數與常數的分別。",
    "options": [
      "5",
      "8",
      "3",
      "程式出錯，因為 x 不可以重新賦值"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "The following pseudocode is run: x ← 5; y ← x; x ← x + 3; output y. What is the output?",
    "optionsEn": [
      "5",
      "8",
      "3",
      "An error, because x cannot be given a new value"
    ],
    "explanationEn": "A variable is a named memory location whose value can be stored and changed. y ← x copies the current value of x, 5, into y; when x later becomes 8, y does not change, so the output is 5. Answering 8 assumes y keeps following the value of x. 3 is only the amount added to x, not the content of y. A variable’s value can change while the program runs, so giving x a new value causes no error; that is the difference between a variable and a constant."
  },
  {
    "id": "rcl_ict_prog_68",
    "type": "mc",
    "subject": "ict",
    "topic": "programming",
    "topicZh": "程式編寫與算法",
    "topicEn": "Programming & Algorithms",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEn": "Auto-gated",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "某學生寫下煮麵的步驟：把水煮沸；放入麵條；煮至麵條軟硬適中為止；上碟。若以演算法的要求評估，這組步驟最主要的問題是甚麼？",
    "explanation": "演算法是解決問題的有限、明確步驟序列：每一步必須清楚、可執行，並在有限的步驟後結束。「煮至軟硬適中為止」依賴個人判斷，沒有可以客觀檢查的條件，不同人執行會得出不同結果，可改為「煮 3 分鐘」之類的明確條件。演算法需要明確，但不必寫出與結果無關的細節，例如爐具型號。演算法並沒有步驟數目的下限，亦不一定要有重複結構。",
    "options": [
      "「把水煮沸」不夠詳細，因為演算法必須寫明所用爐具的型號和火力。",
      "「煮至軟硬適中為止」沒有明確的停止條件，不同人會有不同做法。",
      "步驟太少，因為一個演算法必須最少包含十個步驟。",
      "「上碟」之後沒有重複的步驟，所以不符合演算法的要求。"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "A student writes these steps for cooking noodles: boil the water; add the noodles; cook until the noodles are just right; serve. Judged against the requirements of an algorithm, what is the main problem with these steps?",
    "optionsEn": [
      "“Boil the water” is not detailed enough, because an algorithm must state the stove model and heat setting.",
      "“Cook until just right” has no clear stopping condition, so different people will do it differently.",
      "There are too few steps, because an algorithm must have at least ten steps.",
      "There is no repetition after “serve”, so the steps do not meet the requirements of an algorithm."
    ],
    "explanationEn": "An algorithm is a finite sequence of well-defined steps for solving a problem: each step must be clear and executable, and it must end after a finite number of steps. “Cook until just right” depends on personal judgement and has no condition that can be checked objectively, so different people will get different results; it could be replaced by a definite condition such as “cook for 3 minutes”. An algorithm must be precise but need not include details that do not affect the result, such as the stove model. There is no minimum number of steps, and an algorithm need not contain repetition."
  },
  {
    "id": "rcl_ict_prog_70",
    "type": "mc",
    "subject": "ict",
    "topic": "programming",
    "topicZh": "程式編寫與算法",
    "topicEn": "Programming & Algorithms",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEn": "Auto-gated",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "一個計算三個分數平均值的程式可以順利執行，但輸入 60、70、80 後輸出 210。下列哪項最能描述這個錯誤及合適的找錯方法？",
    "explanation": "60 + 70 + 80 = 210，正確的平均值應是 70，可見程式只計算了總和，漏了除以 3 的一步。程式能夠執行並輸出結果，只是結果不正確，屬邏輯錯誤；追蹤表可以逐步記錄各變數的值，找出計算在哪一步出錯。語法錯誤會令程式無法翻譯或執行，與本題的情況不符。執行時錯誤會令程式在運行期間中斷，但本題的程式已完整輸出結果。問題出在計算步驟，與輸入數值的大小無關。",
    "options": [
      "語法錯誤；應根據編譯器顯示的錯誤訊息，找出出錯的一行。",
      "執行時錯誤；程式在運算途中中斷，所以輸出了錯誤而不完整的數值。",
      "邏輯錯誤；可用追蹤表記錄各變數的值，找出漏了除以 3 的一步。",
      "輸入錯誤；只要改為輸入較小的數值，輸出便會變得正確。"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "A program that calculates the average of three marks runs without stopping, but for the inputs 60, 70 and 80 it outputs 210. Which statement best describes the error and a suitable way to find it?",
    "optionsEn": [
      "A syntax error; use the compiler’s error message to find the faulty line.",
      "A run-time error; the program stopped during calculation, so it output a wrong, incomplete value.",
      "A logic error; use a trace table to record each variable and find the missing division by 3.",
      "An input error; entering smaller numbers would make the output correct."
    ],
    "explanationEn": "60 + 70 + 80 = 210, while the correct average is 70, so the program only adds up the marks and leaves out the division by 3. The program runs and produces output, but the output is wrong, which is a logic error; a trace table records each variable step by step and shows where the calculation goes wrong. A syntax error would stop the program from being translated or run, which is not the case here. A run-time error would stop the program while it runs, but this program finished and gave an output. The problem is in the calculation, not in the size of the inputs."
  },
  {
    "id": "rcl_ict_db_82",
    "type": "mc",
    "subject": "ict",
    "topic": "databases",
    "topicZh": "資料庫",
    "topicEn": "Databases",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEn": "Auto-gated",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某校以多份獨立的試算表記錄學生資料，校務處、圖書館及社工各有一份。最近發現同一名學生在三份檔案中的地址各不相同。改用資料庫管理系統集中儲存資料，最能解決甚麼問題？",
    "explanation": "同一項資料分別儲存在多份檔案中，稱為資料冗餘；更新時若只改了其中一份，便會出現資料不一致。資料庫管理系統把資料集中儲存，同一項資料只需存一次，各部門讀取的都是同一份，更新一次便處處一致。資料庫管理系統可以設定資料驗證減少錯誤，但不能保證輸入永遠正確。它亦可按部門設定存取權限，並非讓所有人隨意修改所有資料。集中儲存的資料一旦損毀影響更大，所以仍然需要備份。",
    "options": [
      "令資料永遠不會輸入錯誤，因此不再需要任何資料驗證或檢查。",
      "令每個部門都可以隨意修改其他部門的所有資料。",
      "令資料不再需要備份，因為系統會自動永久保存。",
      "減少資料重複，避免同一項資料在不同檔案中不一致。"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "A school keeps student records in separate spreadsheets: the general office, the library and the social worker each have one. It has found that one student’s address is different in all three files. Which problem would moving to a database management system with central storage best solve?",
    "optionsEn": [
      "Data can never be entered wrongly, so no validation or checking is needed any more.",
      "Every department can freely change all the data of the other departments.",
      "Data no longer needs backing up, because the system keeps it permanently.",
      "It reduces duplicated data, so the same item is not inconsistent across files."
    ],
    "explanationEn": "Storing the same item in several files is data redundancy; if an update changes only one copy, the data becomes inconsistent. A database management system stores data centrally, so each item is stored once and every department reads the same copy; one update keeps it consistent everywhere. A DBMS can apply validation to reduce errors, but it cannot guarantee input is always correct. It also sets access rights by department rather than letting everyone change everything. Central data is even more costly to lose, so it still needs backing up."
  },
  {
    "id": "rcl_ict_sec_87",
    "type": "mc",
    "subject": "ict",
    "topic": "security_ethics",
    "topicZh": "資訊保安與道德",
    "topicEn": "Security & Ethics",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEn": "Auto-gated",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某學生收到一封自稱來自銀行的電郵，寄件網域與該銀行的官方網域只相差一個字母，內容指其帳戶將於 24 小時內被凍結，要求立即按連結登入核實。最合適的做法是甚麼？",
    "explanation": "網絡釣魚常見的特徵包括：仿冒的寄件網域、製造緊迫感、要求按連結登入或提供資料。正確的做法是經獨立而可信的途徑核實，例如自行輸入官方網址或致電銀行，而不是使用電郵提供的連結。標誌可以輕易複製，不能證明電郵是真的。回覆電郵等於把資料直接交給騙徒。按連結本身已有風險：仿冒網頁可能下載惡意程式，亦會引導用戶在仿冒頁面上輸入資料。",
    "options": [
      "不按連結，自行輸入銀行的官方網址或致電銀行查詢。",
      "按連結登入，因為電郵附有銀行標誌，應該是真的。",
      "回覆電郵並提供帳戶號碼，請對方先暫停凍結帳戶。",
      "按連結但不輸入密碼，只看看網頁的內容和標誌是否正常。"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "A student receives an email claiming to be from a bank. The sender’s domain differs from the bank’s official domain by one letter, and the message says the account will be frozen within 24 hours unless the student clicks a link and logs in at once. What is the most appropriate action?",
    "optionsEn": [
      "Do not click; type the bank’s official address yourself or phone the bank.",
      "Click and log in, because the email has the bank’s logo and must be genuine.",
      "Reply with the account number and ask them to hold off freezing it.",
      "Click the link but do not type a password, just to see if the page and logo look normal."
    ],
    "explanationEn": "Common signs of phishing include an imitation sender domain, a sense of urgency and a request to click a link to log in or give details. The right response is to check through an independent, trusted route, such as typing the official address yourself or phoning the bank, rather than using the link in the email. A logo is easy to copy and proves nothing. Replying hands the details straight to the fraudster. Clicking the link is already risky: the fake page may download malware and leads users to enter details on an imitation site."
  }
]
