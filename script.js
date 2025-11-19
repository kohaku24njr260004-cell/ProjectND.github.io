// ----- クライアント側の簡易判定ロジック -----
// 質問ごとに重みを定義し、選択肢ごとにスコアを割り当てる。
// 合計スコアで低/中/高を返す（あくまで目安）。
document.getElementById('localBtn').addEventListener('click', ()=>{
    const q1 = document.getElementById('q1').value; // 許諾
    const q2 = document.getElementById('q2').value; // 商用
    const q3 = document.getElementById('q3').value; // 使用量
    const q4 = document.getElementById('q4').value; // 加工
    const q5 = document.getElementById('q5').value; // 出所
    const notes = document.getElementById('notes').value;
  
    // 重みとスコア割当
    const mapping = {
      q1: { yes:0, unclear:2, no:4 },      // 許諾無いほどリスク上昇
      q2: { no:0, unclear:2, yes:3 },      // 商用はリスク上昇
      q3: { small:0, substantial:3, full:5 },
      q4: { none:3, some:1, heavy:0 },     // 加工なしはオリジナルに近い -> リスク上昇
      q5: { yes:0, partial:1, no:2 }
    };
  
    const total = mapping.q1[q1] + mapping.q2[q2] + mapping.q3[q3] + mapping.q4[q4] + mapping.q5[q5];
    const max = 4+3+5+3+2; // 各項目の最大合計 = 17
    const pct = Math.round((total/max)*100);
  
    let label = '不明確（要確認）';
    if(pct <= 30) label = '低い（リスク低）';
    else if(pct <= 65) label = '中程度（要注意）';
    else label = '高い（要精査／法務確認推奨）';
  
    // 根拠リスト
    const reasons = [];
    if(q1 === 'no') reasons.push('原作者の許諾がない／確認できないためリスクが上がります。');
    if(q2 === 'yes') reasons.push('商用利用のため権利行使の対象になりやすいです。');
    if(q3 === 'full' || q3 === 'substantial') reasons.push('元作品の重要部分や長い利用があるためリスクが上がります。');
    if(q4 === 'none') reasons.push('ほとんど加工がないため、原著作物に近いと判断される可能性があります。');
    if(q5 === 'no') reasons.push('出所（クレジット）が無いため盗用と受け取られる恐れがあります。');
    if(notes.trim()) reasons.push('追加メモ: ' + notes.trim());
  
    // 表示
    document.getElementById('resultSummary').textContent = `判定: ${label}（スコア ${pct}%）`;
    const list = document.getElementById('reasonList');
    list.innerHTML = '';
    reasons.forEach(r=>{
      const d = document.createElement('div');
      d.className = 'reason';
      d.textContent = r;
      list.appendChild(d);
    });
  });
  
  // ----- フォームをリセットする処理 -----
document.getElementById('aiBtn').textContent = 'フォームをリセット';
document.getElementById('aiBtn').addEventListener('click', () => {
  // フォームの要素を取得
  const form = document.getElementById('checkForm');

  // 入力内容をリセット
  form.reset();

  // 結果表示をクリア
  document.getElementById('resultSummary').textContent = 'まだ判定されていません。';
  document.getElementById('reasonList').innerHTML = '';

  // メッセージを一瞬表示（任意）
  const msg = document.createElement('div');
  msg.textContent = 'フォームをリセットしました。';
  msg.style.color = 'green';
  msg.style.marginTop = '10px';
  form.appendChild(msg);
  setTimeout(() => msg.remove(), 2000);
});
