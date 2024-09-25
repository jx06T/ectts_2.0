# ECTTS 2.0
###### *version-V2.1.2* 
---
## 簡介&功能
- 前往 [ectts-2.vercel.app](https://ectts-2.vercel.app/)
- 首頁可以匯出匯入所有單字集，單字集具有唯一 **id** 匯入時，同 **id** 的單字集會被覆蓋為匯入資料，其他舊的單字集則不會被覆蓋（點擊上方的 **ECTTS 2.0** 可以跳至首頁
- 左側欄可建立單字集，可針對單字集重命名或刪除
- 進入單字集後，中間可輸入英文和中文
- 上方功能列表:
  - 眼睛圖案:顯示或隱藏單字（在隱藏狀態時點選單字會暫時顯示），在卡片模式下隱藏中文則卡片預設以英文翻開，若中英文皆隱藏則卡片隨機翻開
  - 鎖頭圖案:鎖定編輯
  - 筆圖案:開啟刪除模式（點擊右邊框框刪除，此時框框為紅色）
  - 導入（在下方依照導出格式貼上後按下即可匯入，此操作會覆蓋當前單字集所有單字）
  - 導出（自動複製到剪貼簿）
  - 切換功能列表（按了就知道）
  - 反向選取
  - 全選/全不選
  - 切換只念選中單字或是只念未完成單字模式（點擊右邊框框選擇單字或標記單字為完成，綠色表完成，紫色表選中）
  - 隨機撥放模式切換（雙擊右邊框框跳到該單字撥放）
  - 卡片模式切換，左滑將標記為學習中，右滑則標記為完成，顯示單字卡的規則與朗讀單字一致，標記的"完成"與前述手動標記的狀態一致（此時也可以按下方播放區聆聽單字）
  
- 下方匯出匯入區域（匯入格式為一行英文一行中文，每個單字不空行）
- 底部播放區
  - 雙擊單字右邊框框則可以跳到該單字
  - 中間可調整朗讀參數（見下方說明，或在網頁中單擊選項查看提示） 
  - 跳至前後單字
  - 開始與暫停
 
## 單字匯出格式
```
victim 
受害者
survivor 
幸存者
photographer
攝影師
base
把總部設在；在某處工作居住
globally 
全球的
harmful 
有害的
......
```

## 單字集匯出格式
``` JSON
[
  {
    "id": "隨機 id（網址列顯示的就是 id）",
    "title": "單字集標題",
    "words": [
      {
        "id": "隨機 id",
        "chinese": "單字中文",
        "english": "單字英文",
        "done" : false
        "selected" : true
        "//comment": "done 以及 selected 這兩個鍵在舊版本的單字集中不一定存在"
      },
    ]
  }
]
```

## 朗讀設定
- WW-每兩個單字的間隔
- EE-英文重複的間隔
- EL-英文與逐字朗讀的間隔
- LC-逐字朗讀與中文的間隔
- speed-英文的朗讀速度
- repeat-英文的重複次數
- letter-是否逐字朗讀英文
- chinese-是否念中文

## 更新

### 2.1
```
2.1.2
新增全部單字集之匯出與匯入功能
新增首頁
頁面導航邏輯重寫

2.1.1
修復單字卡閃爍

2.1.0
新增單字卡功能
隨機撥放邏輯重寫
```

### 2.0
```
2.0.2
背景播放

2.0.1
單字集動態順序

2.0.0
介面重寫
播放邏輯修改
匯出匯入
隨機撥放
```

### 1.0
> 見 [ECtts](https://github.com/jx06T/ECtts)

## 待辦
- 語音選擇
