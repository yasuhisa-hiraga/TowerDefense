interface NextWaveMessageProps {
    status:string;
    onStop:()=> void;
    onStart:()=> void;
    onRetry:()=> void;
}

function NextWaveMessage({status, onStop, onStart, onRetry}:NextWaveMessageProps) {

  // if(!children){
  //   return;
  // }

  let content;

  switch( status ){
      // 非表示
    case '':
      return;

      // 次へ
    case 'next':
      content = (
        <>
        <h1 className="text-xl">WAVEクリア</h1>
        <div>次のウェーブを開始します</div>
        <ul className="flex flex-row justify-center gap-1">
          <li className="bg-gray-800 rounded-md p-4 hover:bg-blue-100" onClick={onStop}>再配置</li>
          <li className="bg-gray-800 rounded-md p-4 hover:bg-blue-100" onClick={onStart}>すぐに始める</li>
        </ul>
        </>
      );
      break;

      // ゲームクリア
    case 'clear':
      content =(
        <>
        <h1 className="text-xl">ゲームクリア!!</h1>
        <ul className="flex flex-row justify-center gap-1">
          <li className="bg-gray-800 rounded-md p-4 hover:bg-blue-100" onClick={onRetry}>もう一回遊ぶ</li>
        </ul>
        </>
        );
      break;

    case 'gameover':
      content =(
        <>
        <h1 className="text-xl">ゲームオーバー</h1>
        <ul className="flex flex-row justify-center gap-1">
          <li className="bg-gray-800 rounded-md p-4 hover:bg-blue-100" onClick={onRetry}>もう一回遊ぶ</li>
        </ul>
        </>
        );
      break;
  }
  

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-black bg-opacity-40">
      <div className="w-full p-4 absolute top-1/3 flex flex-col">
        
        {content}     
      </div>
    </div>
  )
}

export default NextWaveMessage