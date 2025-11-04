interface StatusMessagePanelProps {
    children:string;
}

function StatusMessagePanel( {children}:StatusMessagePanelProps ){

    // メッセージを引き渡されてる場合は表示
    if (!children) {
        return null;
    }

    return (
        <div className="bg-gray-800 text-white bg-opacity-80 rounded-md p-2" >
            <div className="p-1">{children}</div>
        </div>
    )
}

export default StatusMessagePanel;